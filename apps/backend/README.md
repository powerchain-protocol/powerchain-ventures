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

Claims, pause/resume, timing changes, cancel/complete and creator-controlled sale activation are also constructed and simulated locally by `lib/local-program-transaction-builder.ts`.

The remote transaction-builder integration is optional and is used only when delegated vault-authority sale activation is explicitly enabled.


## Runtime settlement finality

Production runtime persistence is configured with `POWERCHAIN_RUNTIME_PERSISTENCE=database`. Backend Node startup validates migrations before activating the Prisma-backed persistence layer.

Purchase confirmations create durable settlement IDs. The minutely `/api/v1/runtime/settlements/reconcile` worker advances Solana finality until `reconciled`; Checkout does not show a successful purchase before that state.


## Atomic settlement registration

`lib/runtime-persistence/settlement-registration.ts` creates/binds the durable settlement and its `settlement.observe` outbox event inside one Prisma/PostgreSQL transaction. This prevents a confirmed purchase from being persisted without the worker event required to advance finality.

Manual-review recovery uses `/api/v1/runtime/settlements/{settlementId}/action`. `retry-observation` only requeues observation of the already-signed transaction; it never sends the financial transaction again.


## Solana Pay and protocol APIs

PowerChain exposes the prepared purchase through the Solana Pay transaction-request standard without creating a second settlement path:

```text
GET|POST /api/v1/payments/solana-pay/transaction
GET      /api/v1/payments/solana-pay/status
GET      /api/v1/solana/settlement
GET      /api/v1/payments/config
GET      /api/v1/protocols
```

The Solana Pay transaction request is buyer-bound and returns the same reviewed serialized transaction used by connected-wallet checkout. The status route accepts only a signature whose message matches the prepared transaction.

Circle CCTP V2 and ZK Compression are capability-gated and disabled by default. CCTP message/attestation inspection is available at `/api/v1/protocols/cctp/messages` only when CCTP is enabled.
