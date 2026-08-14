-- PowerChain Launchpad 1.0.0 production hardening
alter table launchpad_sales add column if not exists eligibility_mode text not null default 'public' check (eligibility_mode in ('public','allowlist','trusted'));
alter table launchpad_sales add column if not exists min_purchase_usd_micros bigint not null default 1 check (min_purchase_usd_micros > 0);
alter table launchpad_sales add column if not exists max_purchase_usd_micros bigint not null default 9223372036854775807 check (max_purchase_usd_micros > 0);
alter table launchpad_sales add column if not exists sold_base_units numeric(30,0) not null default 0 check (sold_base_units >= 0);
alter table launchpad_sales add column if not exists updated_at timestamptz not null default now();
create index if not exists launchpad_sales_phase_idx on launchpad_sales(phase,starts_at,ends_at);
create index if not exists launchpad_purchases_sale_wallet_idx on launchpad_purchases(sale_id,wallet,created_at desc);
create index if not exists launchpad_claims_sale_wallet_idx on launchpad_claims(sale_id,wallet,created_at desc);
create unique index if not exists launchpad_purchases_signature_unique on launchpad_purchases(signature) where signature is not null;
create unique index if not exists launchpad_claims_signature_unique on launchpad_claims(signature) where signature is not null;
create table if not exists launchpad_vesting (
 id uuid primary key default gen_random_uuid(), sale_id uuid not null references launchpad_sales(id) on delete cascade,
 wallet text not null, total_base_units numeric(30,0) not null check(total_base_units>0), claimed_base_units numeric(30,0) not null default 0 check(claimed_base_units>=0),
 cliff_at timestamptz, starts_at timestamptz not null, ends_at timestamptz not null,
 created_at timestamptz not null default now(), unique(sale_id,wallet), check(starts_at<=ends_at), check(claimed_base_units<=total_base_units)
);
create table if not exists launchpad_idempotency (
 scope text not null, key text not null, request_hash text not null, response_status int, response_body jsonb,
 expires_at timestamptz not null, created_at timestamptz not null default now(), primary key(scope,key)
);
