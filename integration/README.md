# PowerChain integration surface

Production integrations are intentionally isolated from transaction settlement.

- **Helius** — backend Solana RPC failover and DAS token metadata.
- **Birdeye** — backend price/liquidity/token-overview observations.
- **Coinbase CDP SQL** — optional Solana transfer/instruction analytics.
- **Supabase/PostgreSQL** — authoritative persistence, locks, RLS and settlement functions.
- **Prisma ORM** — typed companion schema/tooling for backend development.

The Launchpad UI exposes a safe `/integration` status page. Provider API keys, Supabase service-role credentials, private RPC keys and transaction-builder credentials never belong in browser configuration.
