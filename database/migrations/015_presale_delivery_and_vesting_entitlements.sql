-- PowerChain Launchpad 1.0.0 — presale delivery, wallet routing and vesting entitlements.
alter table launchpad_sales add column if not exists source_vault_token_account text;
alter table launchpad_sales add column if not exists payment_receiver_wallet text;
alter table launchpad_sales add column if not exists delivery_mode text not null default 'claim' check (delivery_mode in ('immediate','claim'));

alter table launchpad_purchases add column if not exists buyer_token_account text;
alter table launchpad_purchases add column if not exists delivered_base_units numeric(30,0) not null default 0 check (delivered_base_units>=0);
alter table launchpad_purchases add column if not exists delivery_verified_at timestamptz;
alter table launchpad_claims add column if not exists buyer_token_account text;
alter table launchpad_claims add column if not exists delivery_verified_at timestamptz;

create index if not exists launchpad_purchases_delivery_idx on launchpad_purchases(sale_id,wallet,delivery_verified_at);
create index if not exists launchpad_claims_delivery_idx on launchpad_claims(sale_id,wallet,delivery_verified_at);

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
security definer
set search_path=public
as $$
declare
  s launchpad_sales%rowtype;
  wallet_spent bigint;
  purchase_id uuid;
  inserted_purchase boolean := false;
  expected_tokens numeric;
  expected_fee bigint;
  eligible boolean;
  vest_start timestamptz;
  vest_cliff timestamptz;
  vest_end timestamptz;
begin
  if p_usd_micros <= 0 or p_token_base_units <= 0 or p_fee_usd_micros < 0 then raise exception 'invalid_purchase_amount'; end if;
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

  select coalesce(sum(usd_micros),0)::bigint into wallet_spent from launchpad_purchases where sale_id=p_sale_id and wallet=p_wallet and status='confirmed';
  if wallet_spent + p_usd_micros > s.max_purchase_usd_micros then raise exception 'wallet_purchase_limit_exceeded'; end if;

  insert into launchpad_purchases(sale_id,wallet,idempotency_key,usd_micros,token_base_units,fee_usd_micros,signature,status,review_id,confirmed_slot,updated_at)
  values(p_sale_id,p_wallet,p_idempotency_key,p_usd_micros,p_token_base_units,p_fee_usd_micros,p_signature,'confirmed',p_review_id,p_confirmed_slot,now())
  on conflict(idempotency_key) do nothing returning id into purchase_id;

  if purchase_id is not null then
    inserted_purchase := true;
    update launchpad_sales set sold_base_units=sold_base_units+p_token_base_units,updated_at=now() where id=p_sale_id;

    -- Vesting entitlement is created from the confirmed purchase itself. No browser input can mint entitlement.
    if s.delivery_mode='claim' or s.vesting_enabled then
      vest_start := s.claim_starts_at;
      vest_cliff := s.claim_starts_at + make_interval(days=>s.vesting_cliff_days);
      vest_end := case when s.vesting_duration_days>0 then s.claim_starts_at + make_interval(days=>s.vesting_duration_days) else s.claim_starts_at end;
      insert into launchpad_vesting(sale_id,wallet,total_base_units,claimed_base_units,starts_at,cliff_at,ends_at)
      values(p_sale_id,p_wallet,p_token_base_units,0,vest_start,vest_cliff,vest_end)
      on conflict(sale_id,wallet) do update set total_base_units=launchpad_vesting.total_base_units+excluded.total_base_units;
    end if;
  else
    select id into purchase_id from launchpad_purchases where idempotency_key=p_idempotency_key;
  end if;

  return jsonb_build_object(
    'purchaseId',purchase_id,
    'soldBaseUnits',(select sold_base_units from launchpad_sales where id=p_sale_id),
    'walletSpentUsdMicros',wallet_spent + case when inserted_purchase then p_usd_micros else 0 end,
    'deliveryMode',s.delivery_mode,
    'vestingEntitlementCreated',inserted_purchase and (s.delivery_mode='claim' or s.vesting_enabled)
  );
end;
$$;

revoke all on function launchpad_apply_confirmed_purchase(uuid,text,bigint,numeric,bigint,text,text,uuid,bigint) from public;
do $$ begin
 if exists(select 1 from pg_roles where rolname='service_role') then
   grant execute on function launchpad_apply_confirmed_purchase(uuid,text,bigint,numeric,bigint,text,text,uuid,bigint) to service_role;
 end if;
end $$;
