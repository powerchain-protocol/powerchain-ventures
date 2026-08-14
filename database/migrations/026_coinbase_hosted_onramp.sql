-- PowerChain Launchpad 1.0.0 - Coinbase-hosted Onramp audit state.
create table if not exists public.launchpad_onramp_sessions (
  id uuid primary key default gen_random_uuid(),
  partner_user_ref text not null unique,
  wallet text not null,
  sale_id uuid not null references public.launchpad_sales(id) on delete cascade,
  provider text not null default 'coinbase-hosted' check (provider = 'coinbase-hosted'),
  purchase_asset text not null default 'SOL' check (purchase_asset = 'SOL'),
  destination_network text not null default 'solana' check (destination_network = 'solana'),
  payment_currency text not null default 'USD' check (payment_currency = 'USD'),
  requested_payment_amount numeric(30,2) not null check (requested_payment_amount >= 5),
  provider_status text not null default 'session-created',
  provider_transaction_id text,
  provider_tx_hash text,
  created_at timestamptz not null default now(),
  last_checked_at timestamptz,
  completed_at timestamptz
);
create index if not exists launchpad_onramp_wallet_created_idx on public.launchpad_onramp_sessions(wallet,created_at desc);
create index if not exists launchpad_onramp_sale_created_idx on public.launchpad_onramp_sessions(sale_id,created_at desc);
alter table public.launchpad_onramp_sessions enable row level security;
revoke all on public.launchpad_onramp_sessions from anon, authenticated;
grant select,insert,update on public.launchpad_onramp_sessions to service_role;
