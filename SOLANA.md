# PowerChain Ventures — Solana, Helius and Market Data v1.7.0

## Clusters

`SOLANA_CLUSTER` supports `devnet`, `mainnet-beta` and `testnet`. Browser configuration uses `NEXT_PUBLIC_SOLANA_CLUSTER` independently so public wallet reads can use a browser-safe endpoint while backend provider credentials remain private.

## RPC provider selection

```text
SOLANA_RPC_PROVIDER=auto|helius|solana|custom
SOLANA_RPC_URL=
SOLANA_FALLBACK_RPC_URL=
SOLANA_WS_URL=
SOLANA_FALLBACK_WS_URL=
SOLANA_RPC_FAILURE_THRESHOLD=3
SOLANA_RPC_COOLDOWN_MS=30000
```

`auto` prefers Helius when a server-side Helius configuration exists, then falls back to a configured/public Solana endpoint. `custom` requires `SOLANA_RPC_URL`. After repeated failures, the local circuit breaker temporarily skips the affected endpoint and reports sanitized state through `/api/v1/system/fallbacks`.

## Helius

Server-only variables:

```text
HELIUS_API_KEY=
HELIUS_RPC_URL=
HELIUS_WS_URL=
```

The API exposes narrow routes for DAS assets and wallet transaction/transfer history. Raw provider credentials and keyed RPC URLs are not returned to clients.

## Market data

Normalized market sources are Pyth, Birdeye and CoinGecko. `MARKET_PROVIDER_ORDER` controls fallback order. Pyth Hermes can operate without an API key when the configured endpoint allows it; Birdeye requires an API key; CoinGecko can use public, demo or pro modes.

```text
GET /api/v1/market/price?symbol=SOL
GET /api/v1/market/prices?symbols=SOL,USDC,PWRC
GET /api/v1/market/providers
```

Each price includes its source, publish time, staleness and provider-specific optional confidence/liquidity/change information.

## Program lifecycle

The Rust program in `programs/src/` stores launch authority and lifecycle status. Its current state transitions are:

```text
DRAFT → REVIEW → LIVE → PAUSED → LIVE
                    └──────────→ ENDED
```

Direct `DRAFT → LIVE` and transitions out of `ENDED` are rejected. Initialization verifies the PDA, authority signature and account ownership and rejects already-initialized state.

## Signing boundary

Backend services may construct a versioned transaction and run `simulateTransaction` with signature verification disabled. They do not sign. The frontend presents the exact review object, requires the connected authority wallet, submits only after explicit wallet approval, then asks the API to verify the resulting signature and program state.
