-- PowerChain Launchpad 1.0.0 — monotonic transaction settlement state and live purchase review guard.

create or replace function public.launchpad_advance_review_stage(
  p_review_id uuid,
  p_stage text,
  p_status text default null,
  p_error text default null
) returns table(settlement_stage text,status text)
language plpgsql
security definer
set search_path=public
as $$
declare
  v_current text;
  v_current_rank integer;
  v_next_rank integer;
begin
  if p_stage not in ('prepared','submitted','chain-confirmed','payment-verified','delivery-verified','settled','failed','expired') then
    raise exception 'invalid_settlement_stage';
  end if;

  select r.settlement_stage into v_current
    from public.launchpad_transaction_reviews r
   where r.id=p_review_id
   for update;
  if not found then raise exception 'review_not_found'; end if;

  -- Terminal states never move again. This protects against delayed/reordered retries.
  if v_current in ('settled','failed','expired') then
    return query select r.settlement_stage,r.status from public.launchpad_transaction_reviews r where r.id=p_review_id;
    return;
  end if;

  if p_stage in ('failed','expired') then
    update public.launchpad_transaction_reviews
       set settlement_stage=p_stage,
           status=coalesce(p_status,p_stage),
           last_confirmation_error=case when p_error is null then last_confirmation_error else left(p_error,500) end
     where id=p_review_id;
    return query select r.settlement_stage,r.status from public.launchpad_transaction_reviews r where r.id=p_review_id;
    return;
  end if;

  v_current_rank=case v_current
    when 'prepared' then 0 when 'submitted' then 1 when 'chain-confirmed' then 2
    when 'payment-verified' then 3 when 'delivery-verified' then 4 when 'settled' then 5 else -1 end;
  v_next_rank=case p_stage
    when 'prepared' then 0 when 'submitted' then 1 when 'chain-confirmed' then 2
    when 'payment-verified' then 3 when 'delivery-verified' then 4 when 'settled' then 5 else -1 end;

  if v_next_rank < v_current_rank then
    return query select r.settlement_stage,r.status from public.launchpad_transaction_reviews r where r.id=p_review_id;
    return;
  end if;

  update public.launchpad_transaction_reviews
     set settlement_stage=p_stage,
         status=coalesce(p_status,case when p_stage='settled' then 'confirmed' when p_stage='submitted' then 'submitted' else status end),
         last_confirmation_error=case when p_error is null then last_confirmation_error else left(p_error,500) end
   where id=p_review_id;
  return query select r.settlement_stage,r.status from public.launchpad_transaction_reviews r where r.id=p_review_id;
end;
$$;

revoke all on function public.launchpad_advance_review_stage(uuid,text,text,text) from public;
do $$ begin
 if exists(select 1 from pg_roles where rolname='service_role') then
  grant execute on function public.launchpad_advance_review_stage(uuid,text,text,text) to service_role;
 end if;
end $$;

-- Only one live purchase review is allowed for a wallet/sale pair. Expired/failed/settled
-- reviews do not block a new purchase. The application additionally checks expiry before prepare.
create unique index if not exists launchpad_reviews_one_live_purchase_per_wallet_sale
  on public.launchpad_transaction_reviews(sale_id,wallet)
  where kind='purchase' and status in ('prepared','submitted');
