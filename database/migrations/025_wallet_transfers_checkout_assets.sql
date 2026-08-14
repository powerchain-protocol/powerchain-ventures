-- PowerChain Launchpad 1.0.0 — non-custodial wallet transfers and asset/checkout evidence.
alter table if exists public.launchpad_transaction_reviews
  drop constraint if exists launchpad_transaction_reviews_kind_check;
alter table if exists public.launchpad_transaction_reviews
  add constraint launchpad_transaction_reviews_kind_check check (kind in (
    'claim','sale-activation','purchase','sale-cancel','sale-complete',
    'program-pause','program-resume','program-update-timing','wallet-transfer'
  ));
create index if not exists launchpad_wallet_transfer_reviews_idx
  on public.launchpad_transaction_reviews(wallet,created_at desc)
  where kind='wallet-transfer';
create unique index if not exists launchpad_one_live_wallet_transfer_review
  on public.launchpad_transaction_reviews(wallet)
  where kind='wallet-transfer' and status in ('prepared','submitted');
comment on index public.launchpad_wallet_transfer_reviews_idx is 'Wallet-scoped PWRC/SOL transfer receipt lookup.';
