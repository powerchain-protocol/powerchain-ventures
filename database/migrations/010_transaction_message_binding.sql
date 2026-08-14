-- PowerChain Launchpad 1.0.0: bind confirmed signatures to the exact reviewed Solana message.
alter table launchpad_transaction_reviews add column if not exists confirmed_message_hash text;
alter table launchpad_transaction_reviews add column if not exists confirmed_rpc_endpoint text;
alter table launchpad_transaction_reviews add column if not exists confirmed_at timestamptz;

create index if not exists launchpad_reviews_confirmed_message_hash_idx
  on launchpad_transaction_reviews(confirmed_message_hash)
  where confirmed_message_hash is not null;

create index if not exists launchpad_reviews_confirmation_audit_idx
  on launchpad_transaction_reviews(status,confirmed_at desc)
  where status='confirmed';

comment on column launchpad_transaction_reviews.confirmed_message_hash is
  'SHA-256 of the exact serialized Solana transaction message verified against getTransaction after wallet submission.';
