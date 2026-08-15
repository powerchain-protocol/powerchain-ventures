# Architecture

PowerChain Launchpad is a pnpm/Turborepo full-stack monorepo.

## Applications

### `apps/frontend`

Next.js App Router web application.

Responsibilities:

- landing and sale discovery
- wallet connection
- participation UX
- claims
- creator console
- transaction/receipt views
- public runtime data
- legal/documentation routes

The frontend never receives server-only signing or provider credentials.

### `apps/backend`

Next.js App Router backend/API.

Responsibilities:

- API v1
- sale state and mutation validation
- quote authority
- persistent idempotency
- mutation orchestration
- runtime audit
- settlement/finality reconciliation
- server-only third-party integrations
- production readiness and health checks

### `apps/checkout`

Dedicated Next.js payment and purchase application.

Responsibilities:

- payment-method presentation
- authoritative quote retrieval
- exact transaction review
- connected-wallet signature
- pending-signature recovery
- durable settlement polling through `reconciled`

Checkout does not own price authority, signing secrets, transaction construction or settlement writes.

### `apps/mobile`

Expo / React Native companion.

Responsibilities:

- native browsing and portfolio views
- auth/session support
- sale/claim UX
- mobile creator companion
- runtime public-data consumption

Native transaction signing remains fail-closed until an intentionally reviewed adapter is enabled.

## Shared packages

`packages/token-data` is the canonical shared public/runtime contract package. It owns stable token/public-data schemas, mutation contracts, settlement contracts, API metadata, cache/security policies, and validators.

Other packages should depend on shared contracts instead of redefining equivalent types.

## Data ownership

Static/canonical data:

- PWRC identity and supply
- Token-2022 extension policy
- release/schema metadata
- public fee policy
- deployment state
- public registry/integrity data

Dynamic/backend-authoritative data:

- sale lifecycle
- allocations
- participant state
- eligibility
- claims
- settlement
- transaction verification
- runtime idempotency/audit state

Static snapshots are never settlement authority.

## Financial mutation path

```text
client
→ backend validation
→ runtime request guards
→ atomic idempotency reservation
→ durable mutation receipt
→ mutation lease
→ application/database transaction
→ chain submission
→ settlement record
→ outbox
→ Solana observation
→ finalized
→ reconciliation
```

## Deployment boundaries

Production requires:

- verified environment configuration
- PostgreSQL/Supabase persistence
- database-backed runtime adapters
- migrated runtime tables
- valid Solana RPC
- verified program/token identifiers where required


## Workspace boundaries

```text
apps/*     product/runtime boundaries
packages/* reusable contracts, UI, transport and protocol clients
programs/* Solana on-chain source
database/* ordered migrations and schema snapshot
deploy/*   deployment images/config
```

An app may import shared packages, but it may not reach into another app with a relative source import. Packages may not import application internals. The boundary is enforced by `scripts/check-workspace-boundaries.mjs`.

There is no `payload/` application layer.
