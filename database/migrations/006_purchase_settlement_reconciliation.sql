-- PowerChain Launchpad 1.0.0: atomic purchase settlement + reconciliation
alter table launchpad_purchases add column if not exists confirmed_slot bigint;
alter table launchpad_purchases add column if not exists updated_at timestamptz not null default now();
alter table launchpad_purchases add column if not exists review_id uuid references launchpad_transaction_reviews(id);
alter table launchpad_purchases add column if not exists expires_at timestamptz;

create index if not exists launchpad_purchases_status_idx on launchpad_purchases(status, created_at);
create unique index if not exists launchpad_purchase_review_unique on launchpad_purchases(review_id) where review_id is not null;
create unique index if not exists launchpad_one_live_purchase_review
  on launchpad_transaction_reviews(sale_id,wallet)
  where kind='purchase' and status in ('prepared','submitted');

create or replace function launchpad_apply_confirmed_purchase(
  p_sale_id uuid,
  p_wallet text,
  p_usd_micros bigint,
  p_token_base_units numeric,
  p_fee_usd_micros bigint,
  p_signature text,
  p_idempotency_key text,
  p_review_id uuid,
  p_confirmed_slot bigint
) returns jsonb
language plpgsql
as $$
declare
  s launchpad_sales%rowtype;
  wallet_spent bigint;
  purchase_id uuid;
  inserted_purchase boolean := false;
  expected_tokens numeric;
  expected_fee bigint;
  eligible boolean;
begin
  if p_usd_micros <= 0 or p_token_base_units <= 0 or p_fee_usd_micros < 0 then
    raise exception 'invalid_purchase_amount';
  end if;

  select * into s from launchpad_sales where id=p_sale_id for update;
  if not found then raise exception 'sale_not_found'; end if;
  if s.phase not in ('private','public') then raise exception 'sale_not_open'; end if;
  if now() < s.starts_at or now() >= s.ends_at then raise exception 'sale_not_in_active_window'; end if;
  if s.sold_base_units + p_token_base_units > s.allocation_base_units then raise exception 'sale_allocation_exceeded'; end if;
  if p_usd_micros < s.min_purchase_usd_micros then raise exception 'purchase_below_minimum'; end if;

  expected_tokens := trunc((p_usd_micros::numeric * power(10::numeric,s.decimals)) / s.price_usd_micros::numeric);
  expected_fee := ceil((p_usd_micros::numeric * s.service_fee_bps::numeric) / 10000::numeric)::bigint;
  if expected_tokens <> p_token_base_units then raise exception 'purchase_token_amount_mismatch'; end if;
  if expected_fee <> p_fee_usd_micros then raise exception 'purchase_service_fee_mismatch'; end if;

  if s.eligibility_mode <> 'public' then
    select exists(select 1 from launchpad_wallets where sale_id=p_sale_id and wallet=p_wallet and kind=s.eligibility_mode) into eligible;
    if not eligible then raise exception 'wallet_not_eligible'; end if;
  end if;

  select coalesce(sum(usd_micros),0)::bigint into wallet_spent
    from launchpad_purchases
    where sale_id=p_sale_id and wallet=p_wallet and status='confirmed';
  if wallet_spent + p_usd_micros > s.max_purchase_usd_micros then raise exception 'wallet_purchase_limit_exceeded'; end if;

  insert into launchpad_purchases(
    sale_id,wallet,idempotency_key,usd_micros,token_base_units,fee_usd_micros,
    signature,status,review_id,confirmed_slot,updated_at
  ) values(
    p_sale_id,p_wallet,p_idempotency_key,p_usd_micros,p_token_base_units,p_fee_usd_micros,
    p_signature,'confirmed',p_review_id,p_confirmed_slot,now()
  )
  on conflict(idempotency_key) do nothing
  returning id into purchase_id;

  if purchase_id is not null then
    inserted_purchase := true;
    update launchpad_sales
      set sold_base_units=sold_base_units+p_token_base_units, updated_at=now()
      where id=p_sale_id;
  else
    select id into purchase_id from launchpad_purchases where idempotency_key=p_idempotency_key;
  end if;

  return jsonb_build_object(
    'purchaseId', purchase_id,
    'soldBaseUnits', (select sold_base_units from launchpad_sales where id=p_sale_id),
    'walletSpentUsdMicros', wallet_spent + case when inserted_purchase then p_usd_micros else 0 end
  );
end;
$$;

create or replace function launchpad_expire_stale_reviews() returns integer
language plpgsql
as $$
declare affected integer;
begin
  update launchpad_transaction_reviews
    set status='expired'
    where status in ('prepared','submitted') and expires_at is not null and expires_at <= now();
  get diagnostics affected = row_count;
  return affected;
end;
$$;
