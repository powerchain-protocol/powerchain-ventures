# PowerChain API v1 — Wallet and Checkout Layer

PowerChain Launchpad 1.0.0 exposes a constrained API surface around the existing launchpad settlement pipeline.

- `GET|OPTIONS /api/v1/cors` — inspect the configured CORS contract / preflight.
- `GET /api/v1/tokens` — list Token-2022 mints that have visible PowerChain sales; optional `mint` filter.
- `GET /api/v1/transactions` — stable v1 alias for wallet transaction receipts/status history.
- `POST /api/v1/checkout` — validate wallet, sale, amount and idempotency; returns the canonical quote/prepare/confirm endpoints. It never bypasses the existing server-owned quote and settlement pipeline.

All mutation traffic is origin checked in production by `apps/backend/proxy.ts`. CORS uses an explicit allowlist from `ALLOWED_ORIGINS` plus `NEXT_PUBLIC_APP_URL`; credentials are not enabled. Sensitive actions carry `x-request-id` and use `idempotency-key` where retries could duplicate work.

Embedded-wallet support is adapter-only and non-custodial. The application must never accept, store, log, transmit, or request private keys, seed phrases, or recovery mnemonics.
