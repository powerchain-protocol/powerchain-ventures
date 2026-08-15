# PWRC — Canonical Token Profile

PowerChain (PWRC) is represented by one public data contract shared by the frontend, backend, and native mobile application.

## Canonical profile

| Field | Value |
|---|---|
| Chain | Solana |
| Cluster | mainnet-beta |
| Standard | SPL Token-2022 |
| Decimals | 9 |
| Fixed supply | 18,446,000,000 PWRC |
| Base units | 18,446,000,000,000,000,000 |
| Enabled extensions | MetadataPointer, TokenMetadata |
| Purchase service fee | 2.5% |
| Claims / wallet transfer / creator lifecycle fee | 0% |
| Deployment status | configuration-ready |

The production mint and metadata addresses remain unset until verified. The repository must never publish a fabricated mainnet mint.

## Authority policy

The genesis design mints the fixed supply once and permanently revokes mint authority. Freeze authority is disabled. Transfer-fee, permanent-delegate, mint-close, default-frozen, interest-bearing, scaled-UI and pausable extensions are disabled.

Canonical machine-readable source: `packages/token-data/data/pwrc.json`.
