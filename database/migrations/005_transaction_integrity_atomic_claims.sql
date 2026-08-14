-- PowerChain Launchpad 1.0.0: immutable review payloads + atomic claim application
alter table launchpad_transaction_reviews add column if not exists plan jsonb;
create index if not exists launchpad_transaction_reviews_expiry_idx on launchpad_transaction_reviews(status, expires_at) where status in ('prepared','submitted');
create unique index if not exists launchpad_one_live_claim_review
  on launchpad_transaction_reviews(sale_id,wallet)
  where kind='claim' and status in ('prepared','submitted');

create or replace function launchpad_apply_confirmed_claim(
  p_sale_id uuid,
  p_wallet text,
  p_amount numeric,
  p_signature text,
  p_idempotency_key text
) returns numeric
language plpgsql
as $$
declare
  current_claimed numeric;
  total_alloc numeric;
begin
  if p_amount <= 0 then raise exception 'invalid_claim_amount'; end if;
  select claimed_base_units,total_base_units into current_claimed,total_alloc
    from launchpad_vesting where sale_id=p_sale_id and wallet=p_wallet for update;
  if not found then raise exception 'vesting_not_found'; end if;
  if current_claimed + p_amount > total_alloc then raise exception 'claim_exceeds_allocation'; end if;

  insert into launchpad_claims(sale_id,wallet,amount_base_units,signature,idempotency_key)
    values(p_sale_id,p_wallet,p_amount,p_signature,p_idempotency_key)
    on conflict(idempotency_key) do nothing;

  if found then
    update launchpad_vesting set claimed_base_units=current_claimed+p_amount
      where sale_id=p_sale_id and wallet=p_wallet;
    return current_claimed+p_amount;
  end if;
  return current_claimed;
end;
$$;
