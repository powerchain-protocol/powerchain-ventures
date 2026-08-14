-- PowerChain Launchpad 1.0.0: signed creator lifecycle actions.
alter table launchpad_sales add column if not exists cancelled_at timestamptz;
alter table launchpad_sales add column if not exists completed_at timestamptz;

create or replace function launchpad_apply_sale_action(
  p_sale_id uuid,
  p_creator_wallet text,
  p_action text
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  current_phase text;
  owner_wallet text;
  confirmed_purchases bigint := 0;
  purchased_tokens numeric := 0;
  claimed_tokens numeric := 0;
begin
  if p_action not in ('cancel','complete') then raise exception 'invalid_sale_action'; end if;

  select phase, creator_wallet into current_phase, owner_wallet
    from launchpad_sales where id=p_sale_id for update;
  if not found then raise exception 'sale_not_found'; end if;
  if owner_wallet <> p_creator_wallet then raise exception 'creator_mismatch'; end if;

  if p_action='cancel' then
    if current_phase='cancelled' then return 'cancelled'; end if;
    if current_phase='completed' then raise exception 'completed_sale_cannot_cancel'; end if;
    select count(*) into confirmed_purchases from launchpad_purchases
      where sale_id=p_sale_id and status='confirmed';
    if confirmed_purchases > 0 then raise exception 'sale_has_confirmed_purchases'; end if;
    update launchpad_sales set phase='cancelled', cancelled_at=coalesce(cancelled_at,now()) where id=p_sale_id;
    return 'cancelled';
  end if;

  if current_phase='completed' then return 'completed'; end if;
  if current_phase='cancelled' then raise exception 'cancelled_sale_cannot_complete'; end if;
  if current_phase not in ('ended','claimable') then raise exception 'sale_not_ready_to_complete'; end if;

  select coalesce(sum(token_base_units),0) into purchased_tokens
    from launchpad_purchases where sale_id=p_sale_id and status='confirmed';
  select coalesce(sum(amount_base_units),0) into claimed_tokens
    from launchpad_claims where sale_id=p_sale_id;
  if claimed_tokens < purchased_tokens then raise exception 'unclaimed_tokens_remain'; end if;

  update launchpad_sales set phase='completed', completed_at=coalesce(completed_at,now()) where id=p_sale_id;
  return 'completed';
end;
$$;

create unique index if not exists launchpad_one_live_sale_action_review
  on launchpad_transaction_reviews(sale_id,wallet,kind)
  where kind in ('sale-cancel','sale-complete') and status in ('prepared','submitted');

create index if not exists launchpad_sales_phase_creator_idx
  on launchpad_sales(creator_wallet,phase,created_at desc);
