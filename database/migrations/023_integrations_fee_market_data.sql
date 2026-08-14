-- PowerChain Launchpad 1.0.0 — canonical fee routing + provider/market data persistence.

alter table if exists public.launchpad_sales
  add column if not exists fee_wallet text not null default 'FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy',
  add column if not exists launchpad_program_id text;

alter table if exists public.launchpad_sales drop constraint if exists launchpad_sales_fee_wallet_check;
alter table if exists public.launchpad_sales add constraint launchpad_sales_fee_wallet_check
  check (fee_wallet = 'FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy');

create table if not exists public.launchpad_token_market_snapshots (
  id bigint generated always as identity primary key,
  mint text not null,
  price_usd numeric(38,18),
  liquidity_usd numeric(38,6),
  market_data jsonb not null default '{}'::jsonb,
  asset_data jsonb not null default '{}'::jsonb,
  source text not null default 'birdeye+helius',
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists launchpad_market_snapshots_mint_observed_idx on public.launchpad_token_market_snapshots(mint,observed_at desc);

alter table public.launchpad_token_market_snapshots enable row level security;
revoke all on table public.launchpad_token_market_snapshots from public;
do $$ begin
 if exists(select 1 from pg_roles where rolname='anon') then revoke all on table public.launchpad_token_market_snapshots from anon; end if;
 if exists(select 1 from pg_roles where rolname='authenticated') then revoke all on table public.launchpad_token_market_snapshots from authenticated; end if;
 if exists(select 1 from pg_roles where rolname='service_role') then grant all on table public.launchpad_token_market_snapshots to service_role; end if;
end $$;

comment on column public.launchpad_sales.fee_wallet is 'Canonical PowerChain 2.5% service-fee recipient for Launchpad 1.0.0.';
comment on table public.launchpad_token_market_snapshots is 'Server-cached Birdeye/Helius market and asset observations. Never settlement truth.';
