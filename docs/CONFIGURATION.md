# PowerChain Launchpad configuration

PowerChain Launchpad 1.0.0 deliberately separates immutable protocol constants from deployment-owned mainnet values.

## Source structure

- `packages/config/src/constants.ts` — immutable protocol/network constants only.
- `packages/config/src/runtime.ts` — browser-safe and server runtime validation.
- `packages/config/src/deployment.ts` — fail-closed deployment readiness checks.
- `apps/backend/lib/config.ts` — server configuration boundary.
- `apps/frontend/lib/config.ts` — browser-safe configuration boundary.
- `apps/frontend/context/powerchain-config-context.tsx` — runtime configuration context for UI gating.
- `packages/utils/src/helpers.ts` — reusable address/secret/runtime helpers.

## Mainnet values are never invented

The following values intentionally have no production fallback in source control:

- `POWERCHAIN_PRESALE_MINT`
- `POWERCHAIN_PRESALE_VAULT_TOKEN_ACCOUNT`
- `POWERCHAIN_PRESALE_VAULT_AUTHORITY`
- `POWERCHAIN_TREASURY_WALLET`
- `SOLANA_RPC_URL`
- `SOLANA_RPC_FALLBACK_URL`
- `NEXT_PUBLIC_SOLANA_RPC_URL`
- `POWERCHAIN_QUOTE_AUTHORITY_KEYPAIR_JSON`
- `PYTH_API_KEY` + `PYTH_SOL_USD_FEED_ID` (when Pyth is the SOL/USD source)
- `BIRDEYE_API_KEY` or `COINMARKETCAP_API_KEY` as configured market fallbacks
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Production purchase preparation stays disabled until the real deployment configuration is present and the existing live RPC validation verifies network identity, Token-2022 mint/vault ownership, authority, and funding.

`11111111111111111111111111111111` is the Solana System Program and is explicitly rejected as a PowerChain treasury placeholder.

## Presale defaults

The configurable presale allocation remains `5,000,000,000` tokens by default. Fresh Creator Console drafts load central configuration from `/api/v1/launchpad/config`; restored local drafts are not overwritten.


## Purchase construction

Purchase construction is local to `apps/backend/lib/purchase-transaction-builder.ts`; it does not call `POWERCHAIN_TRANSACTION_BUILDER_URL`.

Purchase, claim, pause/resume, update-timing and lifecycle actions are constructed locally. Creator-controlled vault activation is also local.

An external transaction builder is optional and only required when delegated vault-authority activation is explicitly enabled:

```env
POWERCHAIN_DELEGATED_VAULT_ACTIVATION_ENABLED=1
POWERCHAIN_TRANSACTION_BUILDER_URL=https://...
POWERCHAIN_TRANSACTION_BUILDER_API_KEY=...
```

Purchase readiness requires the server-side quote-authority keypair and at least one configured SOL/USD source.
