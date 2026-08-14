# PowerChain Launchpad 1.0.0 — Full-stack production architecture

## Runtime topology

- `apps/frontend` — public Launchpad, sale catalog/detail, wallet connection, purchase review/signing, claims and Creator Console.
- `apps/backend` — server-owned API, RPC failover, Token-2022 validation, quote policy, transaction preparation/confirmation, reconciliation and audit.
- `database` — ordered PostgreSQL/Supabase migrations and canonical fresh-install schema.
- `packages/domain` — deterministic fee, quote, vesting and sale-state rules.
- `packages/solana` — Solana transaction wire/message integrity helpers.
- `packages/config` — shared version/network configuration.

The browser never receives the Supabase service-role key, reconciliation secret, transaction-builder API key or server RPC fallbacks.

## Purchase flow

1. Public catalog reads canonical sale state from the backend.
2. Quote validates sale window, eligibility, wallet limits, allocation, mint decimals and 2.5% fee.
3. Prepare creates a short-lived exact Solana review plan and persists its SHA-256 digest.
4. User reviews instructions, program IDs, account metas, recipients and fees.
5. Wallet signs and broadcasts the exact serialized transaction.
6. Backend confirms the signature, fetches the on-chain transaction, compares its message byte-for-byte with the reviewed transaction, then applies atomic PostgreSQL settlement under a sale row lock.
7. Reconciliation handles submitted/expired reviews and lifecycle progression.

## Creator flow

Draft validation includes Token-2022 mint validation, economics, timing, eligibility and vesting. Activation is not trusted until the creator signs the prepared Solana transaction. PostgreSQL independently checks creator ownership and derives `scheduled`, `public` or `private`. Unsigned stale drafts expire after 24 hours.

## Deployment

Use `docker compose build` and `docker compose up -d` for the two-service deployment. Frontend traffic is same-origin and proxies `/api/v1/*` to the backend. Production mutation requests are protected by configured browser-origin checks. The backend readiness endpoint must return 200 before traffic is enabled.
