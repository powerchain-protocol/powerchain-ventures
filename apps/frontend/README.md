# PowerChain Launchpad Frontend

Next.js frontend for PowerChain Launchpad™ `1.0.0`.

## Responsibilities

- sale catalog and sale details
- wallet connection and wallet center
- checkout and exact transaction review
- claims and transaction receipts
- creator console/dashboard
- onboarding/auth/account UI
- analytics and integration status

The frontend never receives service-role, provider, quote-authority, or transaction-builder secrets.

## Development

```bash
# Recommended full-stack development (frontend :3000 + backend :3001)
pnpm dev:all

# Frontend-only development is also supported. API calls return a structured
# BACKEND_UNAVAILABLE 503 while the backend is stopped.
pnpm --filter @powerchain/launchpad-frontend dev

pnpm --filter @powerchain/launchpad-frontend typecheck
pnpm --filter @powerchain/launchpad-frontend build
```


## Environment

Use the app-local files:

```bash
cp apps/frontend/.env.example apps/frontend/.env.local
```

Required development values are `NEXT_PUBLIC_APP_URL`, `BACKEND_ORIGIN`,
`NEXT_PUBLIC_SOLANA_CLUSTER`, and `NEXT_PUBLIC_SOLANA_RPC_URL`. Do not place API
keys, database credentials, service-role keys, or transaction-builder secrets in
the frontend env. Next.js loads this app-local `.env.local` automatically.

## Routes

Public routes include `/`, `/sales`, `/wallet`, `/claims`, `/transactions`, `/analytics`, `/integration`, `/docs`, `/eligibility`, `/vesting`, `/security`, `/legal` and `/settings`. `/dashboard`, `/create` and `/account` require an authenticated account session. Mobile users are shown `/onboarding` on first visit; desktop users are not redirected into onboarding.

The frontend serves `/api/v1/*` through a route-handler proxy to `BACKEND_ORIGIN`. When the backend is not running, the proxy returns HTTP 503 with `BACKEND_UNAVAILABLE` rather than crashing the Next rewrite layer.
