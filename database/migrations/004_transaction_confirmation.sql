-- PowerChain Launchpad 1.0.0: bind prepared transaction reviews to confirmed effects
alter table launchpad_transaction_reviews add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table launchpad_transaction_reviews add column if not exists confirmed_slot bigint;
create unique index if not exists launchpad_transaction_review_id_wallet on launchpad_transaction_reviews(id,wallet);
