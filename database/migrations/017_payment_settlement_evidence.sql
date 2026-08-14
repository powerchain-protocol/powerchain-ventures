-- PowerChain Launchpad 1.0.0 — exact payment/proceeds settlement evidence.
alter table if exists public.launchpad_purchases
  add column if not exists payment_asset_kind text,
  add column if not exists payment_amount_base_units numeric(30,0),
  add column if not exists service_fee_payment_base_units numeric(30,0),
  add column if not exists payment_verified_at timestamptz,
  add column if not exists payment_rpc_endpoint text;

alter table if exists public.launchpad_purchases
  drop constraint if exists launchpad_purchases_payment_asset_kind_check;
alter table if exists public.launchpad_purchases
  add constraint launchpad_purchases_payment_asset_kind_check
  check (payment_asset_kind is null or payment_asset_kind in ('native-sol'));

create index if not exists launchpad_purchases_payment_verified_idx
  on public.launchpad_purchases(sale_id,payment_verified_at)
  where payment_verified_at is not null;

comment on column public.launchpad_purchases.payment_verified_at is
  'Timestamp when PowerChain verified exact on-chain proceeds + 2.5% service-fee balance deltas.';
