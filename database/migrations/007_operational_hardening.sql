-- PowerChain Launchpad 1.0.0: operational hardening
-- Safe indexes for confirmation lookup, creator dashboards, reconciliation, and audit review.
create index if not exists launchpad_reviews_signature_idx
  on launchpad_transaction_reviews(submitted_signature)
  where submitted_signature is not null;
create index if not exists launchpad_reviews_sale_status_idx
  on launchpad_transaction_reviews(sale_id,status,created_at desc);
create index if not exists launchpad_sales_creator_created_idx
  on launchpad_sales(creator_wallet,created_at desc);
create index if not exists launchpad_claims_wallet_sale_idx
  on launchpad_claims(wallet,sale_id,created_at desc);
create index if not exists launchpad_purchases_wallet_sale_idx
  on launchpad_purchases(wallet,sale_id,created_at desc);
create index if not exists launchpad_audit_entity_idx
  on launchpad_audit_log(entity_type,entity_id,created_at desc);
create index if not exists launchpad_audit_actor_idx
  on launchpad_audit_log(actor,created_at desc)
  where actor is not null;
