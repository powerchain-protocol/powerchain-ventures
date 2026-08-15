# Security and Configuration

PowerChain Launchpad separates public runtime configuration from server-only deployment configuration.

## Server-only

Examples:

- `SOLANA_RPC_URL`
- `SOLANA_RPC_FALLBACK_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `HELIUS_API_KEY`
- `BIRDEYE_API_KEY`
- `CDP_API_KEY_SECRET`
- quote-authority signing material

These values must never appear in frontend or native bundles.

## Public web/mobile configuration

Only browser/native-safe values should use `NEXT_PUBLIC_*` or `EXPO_PUBLIC_*`.

## Server environment validation

`apps/backend/lib/env.ts` validates required configuration and requires an HTTPS Solana RPC URL in production.

No placeholder mint or Launchpad program ID is invented by this layer.
