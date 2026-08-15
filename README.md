# PowerChain Launchpad™

**Version:** `1.0.0`  
**Network:** Solana `mainnet-beta`  
**Token standard:** SPL Token-2022  
**Workspace:** pnpm `11.21.0` + Turborepo

PowerChain Launchpad is a full-stack platform for creating, operating, participating in, and settling Token-2022 token sales on Solana. Wallet custody and transaction approval remain with the user; server-side services own authoritative quote, eligibility, persistence, reconciliation, and release checks.

## Monorepo

```text
apps/
├── frontend/    Next.js Launchpad, creator console, wallet/account UI
├── backend/     Next.js API v1, pricing, transaction building and settlement
├── checkout/    Next.js dedicated payment and token-purchase application
└── mobile/      Expo / React Native companion

packages/
├── config/      network, runtime and deployment configuration
├── domain/      sale, quote, claim and settlement domain logic
├── integrations/ provider clients, prices, rates and amount conversion
├── program-client/ Launchpad instruction/PDA client
├── solana/      shared Solana transport
├── token-data/  settlement/finality contracts
├── ui/          shared web UI primitives
└── utils/       cross-app helpers and transport

database/        Prisma schema and SQL migrations
programs/        Solana program source and clients
env/             environment profile examples
docs/            architecture, API, security and operations
scripts/         workspace/release doctors and validators
tests/           repository regression tests
```

There is no `payload/` application layer. Source files live directly in their canonical workspace locations.

## Dedicated Checkout

Token purchase UI lives only in `apps/checkout/`. The Launchpad frontend shows sale information and redirects buyers to:

```text
NEXT_PUBLIC_CHECKOUT_URL/checkout/<saleId>
```

The checkout never authorizes its own price or payment. `apps/backend` reloads sale state, calculates the quote, obtains a bounded SOL/USD market observation, builds and simulates the exact Solana Launchpad transaction, applies the canonical **2.5%** purchase fee, and partially signs with the configured quote authority. The buyer wallet supplies the final signature after reviewing the exact transaction.

There is no `apps/payload/` or root `payload/` application layer; `pnpm doctor:layout` enforces this.

### Transaction construction ownership

PowerChain owns reviewed Solana transaction construction inside the monorepo:

```text
purchase                         apps/backend/lib/purchase-transaction-builder.ts
claim/lifecycle/program actions  apps/backend/lib/local-program-transaction-builder.ts
sale activation                  local when creator controls vault
delegated vault activation       optional external builder capability
```

The optional delegated-vault path is enabled only with `POWERCHAIN_DELEGATED_VAULT_ACTIVATION_ENABLED=1`.

### Durable purchase finality

Production uses Prisma/PostgreSQL runtime persistence and a leased outbox worker for settlement observation. A purchase moves through `submitted → observed/confirmed → finalized → reconciled`; Checkout shows success only at `reconciled`.

`pnpm runtime:persistence:health` and `pnpm doctor:settlement-worker` protect this architecture at source level.

## Branding

The application brand uses one canonical PowerChain mark:

```text
apps/frontend/public/assets/brand/powerchain-mark-dark.png
```

The reusable web component is:

```text
apps/frontend/components/logo.tsx
```

`PowerChainLogo` and `PowerChainMark` support dark and light surface tones without maintaining duplicate application-logo artwork. PWRC token artwork remains separate from application branding.

Generated app assets include favicon, Apple touch icon, PWA icons, Expo app icon, adaptive icon, splash icon, and notification icon.

See [`docs/BRANDING.md`](docs/BRANDING.md).

## Network and RPC

The runtime is mainnet-beta first. Browser clients use the PowerChain backend RPC proxy so provider credentials remain server-only:

```text
POST /api/v1/solana/rpc
```

Production frontend example:

```env
NEXT_PUBLIC_SOLANA_CLUSTER=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://backend.powerchain.energy/api/v1/solana/rpc
```

Backend providers support `auto`, `helius`, `custom`, and `solana` selection. Keep `HELIUS_API_KEY` and other provider secrets out of `NEXT_PUBLIC_*` and `EXPO_PUBLIC_*` variables.

See [`env/README.md`](env/README.md) and [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md).

## Install

Requirements:

- Node.js 24
- pnpm 11.21.0
- PostgreSQL/Supabase for persistent production state
- Solana/Rust toolchain when building the on-chain program

```bash
corepack enable
corepack prepare pnpm@11.21.0 --activate
pnpm install
pnpm prisma:generate
```

## Development

```bash
pnpm dev:backend     # http://localhost:3001
pnpm dev:frontend    # http://localhost:3000
pnpm dev:checkout    # http://localhost:3002
pnpm dev:mobile
```

Local app environment files are intentionally easy to edit:

```text
.env.local
apps/frontend/.env.local
apps/backend/.env.local
apps/checkout/.env.local
```

Never place real private keys, seed phrases, signing material, service-role credentials, or provider API secrets in browser/mobile environment files.

## Quality gates

```bash
pnpm doctor:workspace
pnpm doctor:workspace-boundaries
pnpm doctor:program-parity
pnpm doctor:local-builders
pnpm doctor:payment-protocols
pnpm doctor:settlement-worker
pnpm doctor:env
pnpm doctor:runtime-resolution
pnpm openapi:check
pnpm validate
pnpm typecheck
pnpm test
pnpm build
```

Production-sensitive runtime gates are documented in [`docs/RELEASE-CHECKLIST.md`](docs/RELEASE-CHECKLIST.md).

## API

The backend owns the single canonical API contract:

```text
apps/backend/api/openapi/openapi.yaml
```

Routes:

```text
GET  /api/v1/openapi
GET  /api/v1/swagger
POST /api/v1/solana/rpc
```

Human developer documentation is available at `/docs/api` in the frontend.

## Security and settlement

Financial mutation safety is layered:

```text
request validation
→ request ID
→ CORS/origin policy
→ rate limiting
→ atomic idempotency reservation
→ mutation receipt
→ mutation lease / heartbeat
→ transaction submission
→ settlement record
→ Solana finality observation
→ reconciliation
```

A transaction signature alone is not treated as completed settlement. Production completion requires finalized and reconciled settlement state.

## Documentation

Start with [`docs/README.md`](docs/README.md).
