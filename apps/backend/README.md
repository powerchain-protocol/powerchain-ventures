# PowerChain Launchpad Backend

Next.js API service for PowerChain Launchpad™ `1.0.0`.

## Responsibilities

- API v1 request validation
- Supabase Auth session brokering
- canonical sale quotes and fee policy
- Solana transaction preparation/confirmation boundaries
- exact transaction-message, payment, and token-delivery verification
- reconciliation and operational health
- Helius, Birdeye, Coinbase CDP, and Coinbase Onramp server integrations
- Prisma/Supabase persistence

Canonical OpenAPI source: [`openapi/powerchain-launchpad.openapi.yaml`](openapi/powerchain-launchpad.openapi.yaml).

## Development

```bash
pnpm --filter @powerchain/launchpad-backend dev
pnpm --filter @powerchain/launchpad-backend typecheck
pnpm --filter @powerchain/launchpad-backend build
```


## Environment

Use the backend-local files:

```bash
cp apps/backend/.env.example apps/backend/.env.local
```

The backend env owns Solana RPC, Supabase/server credentials, integration keys,
transaction-builder credentials, reconciliation secrets, CORS origins, and
other server-only configuration. Next.js loads this app-local `.env.local`
automatically. Keep real credentials out of source control.
