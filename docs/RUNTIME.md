# PowerChain Launchpad runtime policy

PowerChain Launchpad 1.0.0 separates public runtime configuration from server-only configuration. Production startup should run `pnpm preflight:production` before accepting traffic.

## Request integrity

Frontend API calls attach `x-request-id`. Mutation retries are disabled unless an explicit idempotency key is supplied. Retryable GET/idempotent requests use bounded exponential backoff and respect `Retry-After` up to 120 seconds.

Backend API responses preserve the request ID so a client-visible failure can be correlated with server logs and reconciliation records.

## Origin enforcement

Production mutations require an `Origin` header matching `ALLOWED_ORIGINS` or `NEXT_PUBLIC_APP_URL`. Missing origins fail closed for browser-facing API routes. Server-to-server maintenance actions use their dedicated authenticated paths/secrets rather than browser mutation endpoints.

## Environment validation

`@powerchain/launchpad-config` exposes separate public and server runtime validators. Mainnet production requires HTTPS endpoints, a valid PowerChain treasury wallet, and at least two server-side Solana RPC endpoints.


## Frontend client boundary

`apps/frontend/lib/config.ts` parses only `NEXT_PUBLIC_*` values through the local `lib/env/public.ts` module. The browser runtime does not import the shared config package root, preventing client bundles from traversing server/runtime barrels. Frontend constants use the explicit `@powerchain/launchpad-config/constants` subpath.
