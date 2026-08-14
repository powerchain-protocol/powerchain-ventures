# Supabase

PowerChain Launchpad uses Supabase PostgreSQL as its production persistence boundary.

Apply `database/migrations/*.sql` in order. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Launchpad tables use RLS/privilege revocation so browser roles cannot bypass backend quote, eligibility, transaction-review, claim or settlement policy.

Provider market snapshots from Helius/Birdeye are informational caches and are never settlement truth.
