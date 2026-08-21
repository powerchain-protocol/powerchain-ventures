# PowerChain Portable Schemas v1.6.0

Portable JSON Schema contracts for integrations that do not consume the TypeScript workspace.

- `launch.schema.json` — base launch configuration
- `campaign.schema.json` — creator campaign + first sale phase configuration
- `readiness.schema.json` — launch-readiness result
- `transaction-simulation.schema.json` — non-signing simulation request
- `market-price.schema.json` — normalized Pyth/Birdeye/CoinGecko result
- `websocket-message.schema.json` — realtime subscribe/unsubscribe/ping input

Runtime validation lives in `apps/api/src/schemas/`. The TypeScript source of truth for shared response contracts is `packages/types/`.
