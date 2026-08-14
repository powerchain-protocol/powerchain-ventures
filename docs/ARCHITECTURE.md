# Architecture

`apps/frontend` owns customer-facing Launchpad UX. `apps/backend` owns server-side quote, eligibility, claim and readiness boundaries. `packages/domain` contains deterministic sale invariants. `packages/solana` contains Solana-only transport helpers. `database` contains portable PostgreSQL/Supabase migrations.

Production writes must remain server-owned and idempotent. Wallet clients sign transactions but never determine canonical price, fee, eligibility, allocation or claimable amounts.
