# PowerChain Launchpad 1.0.0 — Operations

## RPC resilience

Server-side Solana reads use `SOLANA_RPC_URL`, then `SOLANA_RPC_FALLBACK_URL`, followed by the comma-separated `SOLANA_RPC_FALLBACK_URLS` pool. Each endpoint has a bounded request timeout and failures move to the next endpoint. Browser code never receives server-only fallback endpoints.

`GET /api/v1/ready` performs a live `getHealth` check and reports the selected endpoint by pool index, latency, and per-attempt status without exposing endpoint URLs.

## Creator recovery

The Creator Console autosaves unfinished wizard data to browser local storage under a versioned PowerChain key. A refresh restores the last unfinished step. The local draft is deleted after a sale activation transaction is submitted successfully or when the creator selects **Clear draft**. On-chain activation and database sale state remain server-authoritative.

## Audit trail

Confirmed claims, purchases, and sale activation events write best-effort records to `launchpad_audit_log`. Audit failure is logged but never rolls back an already-confirmed chain settlement. Operators should alert on `audit_write_failed` structured log events.

## Reconciliation

Run the protected reconciliation endpoint on a scheduler. It expires stale prepared/submitted reviews. Confirmation endpoints are idempotent and may be safely retried for a known review/signature pair.

## Deployment gates

Production readiness requires a healthy Solana RPC endpoint, a valid PowerChain treasury address, Supabase service configuration, transaction-builder configuration, and a reconciliation secret of at least 32 characters. A failed gate returns HTTP 503 from `/api/v1/ready`.

## Signed creator lifecycle actions

Creator cancellation and completion are write-protected by the same reviewed Solana transaction pipeline used elsewhere in Launchpad. The frontend prepares a `sale-action` transaction through the backend, displays the exact instructions/fees/recipients, requires the connected creator wallet to sign, waits for Solana confirmation, and only then calls the database transition function under a row lock.

Cancellation fails when any confirmed purchase exists. Completion requires an ended/claimable sale and rejects while confirmed purchased token units remain unclaimed. Repeated confirmation is idempotent through the persisted transaction review.

Transaction-builder integration must implement `POST {POWERCHAIN_TRANSACTION_BUILDER_URL}/sale-action` for production signing. The builder must use the creator wallet as fee payer and return the same verified/simulated serialized transaction review format as claim, purchase, and sale activation.

## Distributed abuse controls

PowerChain Launchpad 1.0.0 uses a PostgreSQL-backed fixed-window limiter for transaction preparation and other expensive public endpoints. The limiter is atomic across horizontally scaled frontend/backend instances; it is not an in-memory process counter.

`RATE_LIMIT_REQUESTS_PER_MINUTE` defines the default ceiling. More sensitive operations use tighter route-specific ceilings. A rejected request returns HTTP `429`, `Retry-After`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`.

The reconciliation task removes old rate-limit buckets. Do not expose the Supabase service-role key to the browser; only the backend invokes `launchpad_consume_rate_limit`.

## Quote integrity

`/api/v1/launchpad/quote` reads the canonical sale row on every request. Quotes use the sale's validated Token-2022 decimals and price, enforce active timing, allocation remaining, per-wallet caps and restricted-sale eligibility, and independently verify the PowerChain service fee remains exactly 250 bps.

## Resumable confirmation state

Signed transaction reviews now retain an explicit settlement stage and retry metadata. Operators can distinguish `submitted`, `chain-confirmed`, `payment-verified`, `delivery-verified`, and `settled` instead of treating all pending transactions as identical. `POST /api/v1/launchpad/reconcile` reports stage counts, reviews due for another confirmation check, and the maximum observed retry count. The public wallet-scoped `GET /api/v1/launchpad/transaction/status?reviewId=...&wallet=...` endpoint exposes only the review's confirmation state and no private builder metadata.

Purchase and claim UIs persist the submitted review/signature for the exact sale and wallet, allowing confirmation to resume after a browser refresh or transient connection loss. Database settlement and Solana verification remain authoritative.

## Coinbase CDP SQL API (Solana analytics)

PowerChain Launchpad can optionally use Coinbase Developer Platform SQL API as a server-only read/indexing layer for Solana Mainnet analytics. It does **not** replace Solana RPC confirmation, exact transaction-message verification, payment verification, or Token-2022 delivery verification.

Required server-only variables:

```text
CDP_API_KEY_ID=
CDP_API_KEY_SECRET=
CDP_SQL_REQUIRED=false
```

The integration creates a short-lived request-bound JWT using `@coinbase/cdp-sdk/auth` and calls `POST https://api.cdp.coinbase.com/platform/v2/data/query/run`. Query templates are fixed by the backend; users can only supply validated Solana addresses, bounded lookback windows (1-90 days), bounded result limits, and an allowlisted instruction name.

Endpoints:

- `GET /api/v1/launchpad/analytics/mint?mint=<address>&days=7&limit=100`
- `GET /api/v1/launchpad/analytics/wallet?wallet=<address>&days=7&limit=100`
- `GET /api/v1/launchpad/analytics/instructions?program=token-2022&instruction=transferChecked&days=7&limit=100`
- `GET /api/v1/launchpad/analytics/status`

CDP Solana support is public beta and historical retention is approximately three months. Treat SQL API results as analytics/reconciliation evidence and retain Solana RPC as the settlement source of truth.

## Monotonic settlement stages

Migration `020_monotonic_settlement_and_purchase_review_guard.sql` makes transaction settlement stages monotonic at the PostgreSQL boundary. Delayed or reordered retries cannot move a transaction backwards (for example from `delivery-verified` to `submitted`), and terminal `settled`, `failed`, or `expired` reviews cannot be reopened by stale requests.

The same migration allows only one live `purchase` review per sale/wallet pair. The purchase prepare API expires a stale review before permitting a replacement. The Transaction Center exposes **Retry verification** for signed non-terminal reviews so users can safely resume backend verification after temporary RPC or network failures.

## Scheduled reconciliation and operations status

Production deployments should run `/api/v1/launchpad/reconcile` every five minutes. The backend Vercel project now declares this schedule in `apps/backend/vercel.json`.

Set `CRON_SECRET` on Vercel. Vercel sends it as `Authorization: Bearer <CRON_SECRET>` for cron requests. Non-Vercel deployments may continue using `RECONCILIATION_SECRET`; when both are configured, `CRON_SECRET` is authoritative.

Reconciliation is protected by a database-backed lease (`launchpad-reconciliation`, 240 seconds) so a slow run cannot overlap the next scheduled invocation. A live lease returns HTTP 409 instead of running two settlement/cleanup passes concurrently.

`GET /api/v1/launchpad/ops/status` uses the same bearer secret and provides operator-safe health information: RPC state, pending review counts by stage/type, due retry count, sale phase counts, active operation leases, and the latest reconciliation timestamp. It never returns serialized transaction plans or secrets.
