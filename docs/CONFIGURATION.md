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
- `POWERCHAIN_TRANSACTION_BUILDER_URL`
- `POWERCHAIN_TRANSACTION_BUILDER_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Production purchase preparation stays disabled until the real deployment configuration is present and the existing live RPC validation verifies network identity, Token-2022 mint/vault ownership, authority, and funding.

`11111111111111111111111111111111` is the Solana System Program and is explicitly rejected as a PowerChain treasury placeholder.

## Presale defaults

The configurable presale allocation remains `5,000,000,000` tokens by default. Fresh Creator Console drafts load central configuration from `/api/v1/launchpad/config`; restored local drafts are not overwritten.
