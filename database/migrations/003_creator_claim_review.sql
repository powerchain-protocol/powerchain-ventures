-- PowerChain Launchpad 1.0.0: creator, claim and transaction review support
alter table launchpad_sales add column if not exists symbol text not null default 'PWRC';
alter table launchpad_sales add column if not exists decimals int not null default 9 check (decimals between 0 and 18);
alter table launchpad_sales add column if not exists creator_wallet text;
alter table launchpad_sales add column if not exists vesting_enabled boolean not null default false;
alter table launchpad_sales add column if not exists vesting_cliff_days int not null default 0 check (vesting_cliff_days >= 0);
alter table launchpad_sales add column if not exists vesting_duration_days int not null default 0 check (vesting_duration_days >= 0);
create index if not exists launchpad_vesting_wallet_idx on launchpad_vesting(wallet, created_at desc);
create table if not exists launchpad_transaction_reviews (
 id uuid primary key default gen_random_uuid(),
 wallet text not null,
 kind text not null check(kind in ('claim','sale-activation','purchase')),
 sale_id uuid references launchpad_sales(id) on delete cascade,
 plan_hash text not null,
 expires_at timestamptz,
 submitted_signature text unique,
 status text not null default 'prepared' check(status in ('prepared','submitted','confirmed','failed','expired')),
 created_at timestamptz not null default now()
);
create index if not exists launchpad_transaction_reviews_wallet_idx on launchpad_transaction_reviews(wallet,created_at desc);
