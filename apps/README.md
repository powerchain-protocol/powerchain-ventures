# PowerChain Applications

PowerChain Launchpad™ `1.0.0` has three runnable applications.

- [`frontend/`](frontend/) — Next.js public Launchpad, checkout, wallet, claims, transactions, creator console, and account UI.
- [`backend/`](backend/) — Next.js API v1, auth broker, settlement verification, reconciliation, integrations, and operational endpoints.
- [`mobile/`](mobile/) — Expo/React Native iOS and Android companion using the same backend contracts.

Shared protocol/business logic belongs in `packages/`; Solana on-chain logic belongs in `programs/`.
