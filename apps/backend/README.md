# @powerchain/launchpad-backend

Next.js App Router backend/API for PowerChain Launchpad™.

## Responsibilities

- API v1
- authoritative sale state
- eligibility/claim validation
- authoritative quotes and SOL/USD market conversion
- real Launchpad purchase transaction construction and simulation
- payment/token-delivery verification
- persistent idempotency
- runtime protection
- mutation orchestration
- mutation leases/crash recovery
- settlement/finality reconciliation
- server-only provider integrations
- readiness/health

## Environment

Use `apps/backend/.env.example`.

Never expose backend secret values to frontend/mobile packages.

## Database

Apply migrations before enabling mutation traffic.

Runtime persistence should use PostgreSQL/Supabase in horizontally scaled production.

## Commands

```bash
pnpm dev:backend
pnpm build:backend
pnpm production:settlement:check
```


## Purchase transaction builder

`lib/purchase-transaction-builder.ts` builds the buyer's actual Solana purchase transaction in-process. It creates the Token-2022 ATA when required, converts canonical USD sale principal to SOL from bounded backend market data, enforces the 250 bps fee recipient, builds the Launchpad program instruction, partially signs with the configured quote authority, and simulates before returning the review plan.

`POWERCHAIN_QUOTE_AUTHORITY_KEYPAIR_JSON` is server-only. The configured public key must match `POWERCHAIN_QUOTE_AUTHORITY_WALLET`.

The legacy remote transaction-builder integration remains available for operation classes not yet migrated to local construction; it is no longer required by the purchase route.


## Runtime settlement finality

Production runtime persistence is configured with `POWERCHAIN_RUNTIME_PERSISTENCE=database`. Backend Node startup validates migrations before activating the Prisma-backed persistence layer.

Purchase confirmations create durable settlement IDs. The minutely `/api/v1/runtime/settlements/reconcile` worker advances Solana finality until `reconciled`; Checkout does not show a successful purchase before that state.
