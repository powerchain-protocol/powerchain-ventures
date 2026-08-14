# PowerChain Shared Packages

Shared packages are private workspace modules used by the frontend, backend, mobile app, and deployment tooling.

- `config` — protocol constants and validated runtime/deployment configuration.
- `domain` — bigint economics, lifecycle, vesting, and transaction-review rules.
- `solana` — Solana transaction/message and wire-format helpers.
- `utils` — address, bigint, HTTP, retry, idempotency, and typed-error utilities.
- `integrations` — server-side Helius and Birdeye clients.
- `program-client` — Launchpad program PDA/instruction/state TypeScript client.

Runtime exports are built to `dist/`; workspace packages remain version `1.0.0`.
