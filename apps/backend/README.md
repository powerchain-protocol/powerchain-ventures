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
