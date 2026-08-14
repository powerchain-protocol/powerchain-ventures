create table if not exists launchpad_sales (
 id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null, mint text not null,
 phase text not null check (phase in ('draft','scheduled','private','public','ended','claimable','completed','cancelled')),
 starts_at timestamptz not null, ends_at timestamptz not null, claim_starts_at timestamptz not null,
 price_usd_micros bigint not null check (price_usd_micros>0), allocation_base_units numeric(30,0) not null check (allocation_base_units>0),
 service_fee_bps int not null default 250 check(service_fee_bps between 0 and 10000), created_at timestamptz not null default now()
);
create table if not exists launchpad_wallets (sale_id uuid references launchpad_sales(id) on delete cascade, wallet text not null, kind text not null check(kind in('trusted','allowlist')), primary key(sale_id,wallet,kind));
create table if not exists launchpad_purchases (id uuid primary key default gen_random_uuid(), sale_id uuid references launchpad_sales(id), wallet text not null, idempotency_key text unique not null, usd_micros bigint not null, token_base_units numeric(30,0) not null, fee_usd_micros bigint not null, signature text unique, status text not null, created_at timestamptz not null default now());
create table if not exists launchpad_claims (id uuid primary key default gen_random_uuid(), sale_id uuid references launchpad_sales(id), wallet text not null, amount_base_units numeric(30,0) not null, signature text unique, idempotency_key text unique not null, created_at timestamptz not null default now());
create table if not exists launchpad_audit_log (id bigserial primary key, actor text, action text not null, entity_type text not null, entity_id text, payload jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());
