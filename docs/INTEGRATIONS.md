# Provider integrations

Provider credentials are backend-only. Frontend, Checkout and mobile environment files must never contain Helius, Pyth, Birdeye or CoinMarketCap secrets.

## Helius

Helius is available for server-side Solana RPC/API infrastructure. `HELIUS_API_KEY` may be selected as a dedicated RPC provider through the centralized RPC pool. Browser clients use the backend `/api/v1/solana/rpc` proxy.

## Pyth

Pyth is the preferred oracle-quality SOL/USD source when configured.

```text
PYTH_API_KEY=
PYTH_HERMES_URL=https://pyth.dourolabs.app/hermes
PYTH_SOL_USD_FEED_ID=
PYTH_USDC_USD_FEED_ID=
PYTH_SUI_USD_FEED_ID=
```

Feed IDs are deployment configuration. Source code does not invent them.

## Birdeye

Birdeye supplies address-based token spot data and liquidity context:

```text
BIRDEYE_API_KEY=
BIRDEYE_BASE_URL=https://public-api.birdeye.so
```

Requests use server-side `X-API-KEY` and the target `x-chain`.

Birdeye is also the mint-specific PWRC market source once a real PWRC mint is configured.

## CoinMarketCap

CoinMarketCap is an optional authenticated fallback:

```text
COINMARKETCAP_API_KEY=
COINMARKETCAP_BASE_URL=https://pro-api.coinmarketcap.com
```

PowerChain does not rely on undocumented browser endpoints for production price conversion.

## Price policy

Implementation:

```text
packages/integrations/src/
├── amount.ts
├── rates.ts
├── prices.ts
├── pyth.ts
├── birdeye.ts
├── coinmarketcap.ts
└── helius.ts

apps/backend/lib/integrations/prices.ts
```

Market observations have bounded timeouts and freshness. Multiple available sources are checked for excessive divergence. Backend price snapshots are cached briefly to avoid repeated provider fan-out.

Public read endpoints:

```text
GET /api/v1/market/prices
GET /api/v1/market/prices?asset=SOL
GET /api/v1/market/rates
```

Market data does not change the configured token sale price. For SOL purchases it is used only to convert the already-authoritative USD sale principal into the exact SOL amount used in the reviewed transaction.

## Coinbase CDP Onramp

Onramp credentials remain server-side. The hosted URL is single-use and is never persisted. Onramp funds the user's wallet; it does not bypass PowerChain purchase preparation or on-chain verification.

## Database and API

The canonical API contract remains:

```text
apps/backend/api/openapi/openapi.yaml
```

Run:

```bash
pnpm openapi:check
```
