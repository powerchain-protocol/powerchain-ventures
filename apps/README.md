# PowerChain Applications

PowerChain Launchpad™ `1.0.0` has three runnable applications.

- [`frontend/`](frontend/) — Next.js public Launchpad, checkout, wallet, claims, transactions, creator console, and account UI.
- [`backend/`](backend/) — Next.js API v1, auth broker, settlement verification, reconciliation, integrations, and operational endpoints.
- [`mobile/`](mobile/) — Expo/React Native iOS and Android companion using the same backend contracts.

Shared protocol/business logic belongs in `packages/`; Solana on-chain logic belongs in `programs/`.


## Environment ownership

Each application owns `.env.example` and `.env.local` in its own app directory.
The Next.js applications load their app-local env files automatically; they do
not depend on `@next/env`. Frontend files are browser-safe only, backend files
may contain server-only credentials, and mobile files may contain only
`EXPO_PUBLIC_*` values plus native bundle/package identifiers.
