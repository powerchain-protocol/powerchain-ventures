# Provider integrations

## Helius

PowerChain uses Helius only from the backend. Configure `HELIUS_API_KEY`; optionally override `HELIUS_RPC_URL` (default `https://mainnet.helius-rpc.com/`). The key is inserted server-side and redacted from health/audit endpoint labels.

`SOLANA_RPC_URL` remains the required primary server RPC. A distinct Helius RPC URL can satisfy the second mainnet redundancy slot; duplicate endpoints are deduplicated before readiness is calculated.

Helius DAS `getAsset` enriches validated SPL/Token-2022 mints. Solana signature/message/payment/delivery verification remains authoritative for settlement.

## Birdeye

Configure backend-only `BIRDEYE_API_KEY`. Requests send `X-API-KEY` plus `x-chain: solana` and use fixed, bounded price/token-overview templates. Public market routes are rate-limited.

Birdeye observations are informational. They never set sale price, authorize purchases, confirm transactions, or mutate settlement state.

## PWRC

`POWERCHAIN_PWRC_MINT_ADDRESS` is intentionally `null` in source until the real deployed mainnet Token-2022 mint is supplied. Production must configure `POWERCHAIN_PRESALE_MINT`.

`POWERCHAIN_LAUNCHPAD_PROGRAM_ID` is also intentionally `null` until the real deployed program address is supplied. Production must configure `POWERCHAIN_LAUNCHPAD_PROGRAM_ID`.

The canonical service-fee wallet is:

`FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy`

Purchase settlement rejects any different fee recipient.

## Prisma + Supabase

Supabase/PostgreSQL SQL migrations in `database/migrations` remain authoritative for schema, locking, settlement functions, RLS and privileges. Migration `023_integrations_fee_market_data.sql` adds provider market observations and canonical fee/program fields.

Prisma ORM **7.9.1** is a typed companion layer. The Prisma schema lives at `database/prisma/schema.prisma` and CLI configuration at `/prisma.config.ts`. `DATABASE_URL` is server-only.

## OpenAPI / Swagger

The canonical API contract is `apps/backend/openapi/powerchain-launchpad.openapi.yaml` and is served at `/api/v1/openapi`.

Run:

```bash
pnpm openapi:sync
pnpm openapi:check
```

The sync command generates `apps/backend/openapi/swagger.yaml` and the root `openapi/openapi.yaml` compatibility copy.
