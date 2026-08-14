# Production deployment

1. Copy `.env.example` to the deployment secret store and replace every placeholder.
2. Apply `database/migrations/*.sql` in filename order, or use `database/schemas/launchpad.sql` only for a new empty database.
3. Run `node scripts/check-production-env.mjs` in the deployment environment.
4. Build both services with `docker compose build`.
5. Start with `docker compose up -d`.
6. Require `GET /api/v1/ready` to return HTTP 200 before routing production traffic.
7. Schedule `POST /api/v1/launchpad/reconcile` with `Authorization: Bearer $RECONCILIATION_SECRET` at an operationally appropriate cadence.

The transaction builder remains fail-closed. Do not set `POWERCHAIN_TRANSACTION_BUILDER_URL` to a service that cannot produce verified, simulated transactions for the deployed PowerChain Launchpad program/vault configuration.

## Mainnet RPC production gate

For `mainnet-beta`, production preflight and `/api/v1/ready` require at least two server-side RPC endpoints and reject the public `api.mainnet-beta.solana.com` endpoint. Use dedicated authenticated infrastructure for the primary RPC plus at least one independent fallback. Devnet remains permissive for local/testing workflows.

## Vercel deployment

PowerChain Launchpad can be deployed as two Vercel projects from this monorepo:

- **Frontend project:** repository root using the root `vercel.json`, or Root Directory `apps/frontend` using `apps/frontend/vercel.json`.
- **Backend project:** Root Directory `apps/backend` using `apps/backend/vercel.json`.

Set `BACKEND_ORIGIN` on the frontend project to the HTTPS origin of the backend project. Keep `SUPABASE_SERVICE_ROLE_KEY`, `SOLANA_RPC_URL`, RPC fallbacks, transaction-builder credentials, treasury configuration and `RECONCILIATION_SECRET` only on the backend project. Browser-safe values are the only values that may use the `NEXT_PUBLIC_` prefix.

The Next.js configs intentionally use `output: "standalone"` for non-Vercel/container deployments and leave output selection to Vercel when `VERCEL=1`. Both apps explicitly transpile their local PowerChain workspace packages.

Do not add a Vercel Cron directly to the current reconciliation route without an authenticated GET/cron adapter: Vercel Cron invokes a URL on a schedule, while the canonical reconciliation endpoint is intentionally protected and mutation-oriented.
