-- PowerChain Launchpad 1.0.0 — public catalog/runtime indexes
create index if not exists launchpad_sales_catalog_idx
  on launchpad_sales(phase,starts_at,ends_at)
  where phase in ('scheduled','private','public','ended','claimable','completed');
create index if not exists launchpad_purchases_catalog_metrics_idx
  on launchpad_purchases(sale_id,status,wallet);
create index if not exists launchpad_reviews_pending_reconcile_idx
  on launchpad_transaction_reviews(status,expires_at)
  where status in ('prepared','submitted');
