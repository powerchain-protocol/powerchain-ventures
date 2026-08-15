# Integration Inventory

PowerChain integrations are implemented in canonical workspace packages and apps rather than a second `payload/` application tree.

```text
packages/solana/
  SPL Token / Token-2022
  web3.js helpers
  Solana Pay URL codec
  settlement normalization
  WebSocket helpers

packages/integrations/
  Helius
  Pyth
  Birdeye
  CoinMarketCap
  Circle CCTP V2
  ZK Compression capability metadata

apps/backend/
  API v1
  transaction construction
  Solana Pay transaction requests
  settlement verification/reconciliation
  provider secrets

apps/checkout/
  SOL → PWRC default purchase
  Solana Pay QR
  optional hosted funding methods
```

See `docs/SOLANA-PAY.md`, `docs/PAYMENTS.md`, and `docs/PROTOCOLS.md`.
