-- PowerChain Launchpad 1.0.0 — claim/transaction fee evidence and wallet history indexes.
alter table if exists public.launchpad_claims
  add column if not exists reviewed_network_fee_lamports numeric(30,0),
  add column if not exists reviewed_rent_lamports numeric(30,0),
  add column if not exists reviewed_service_fee_lamports numeric(30,0) not null default 0,
  add column if not exists confirmed_slot bigint;

alter table if exists public.launchpad_claims
  drop constraint if exists launchpad_claims_no_service_fee;
alter table if exists public.launchpad_claims
  add constraint launchpad_claims_no_service_fee check (reviewed_service_fee_lamports = 0);

create index if not exists launchpad_transaction_reviews_wallet_created_idx
  on public.launchpad_transaction_reviews(wallet,created_at desc);
create index if not exists launchpad_transaction_reviews_wallet_kind_stage_idx
  on public.launchpad_transaction_reviews(wallet,kind,settlement_stage,created_at desc);

comment on column public.launchpad_claims.reviewed_service_fee_lamports is
  'PowerChain service fee for claims. Must remain zero in Launchpad 1.0.0.';
