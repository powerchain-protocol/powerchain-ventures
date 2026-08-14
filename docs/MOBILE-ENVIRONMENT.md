# Mobile environment

Only `EXPO_PUBLIC_*` values are compiled into the React Native bundle. They must never contain server secrets.

Required mobile public values:
- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Optional public values:
- `EXPO_PUBLIC_WEB_URL`
- `EXPO_PUBLIC_APP_SCHEME`
- `EXPO_PUBLIC_EAS_PROJECT_ID`
- `EXPO_PUBLIC_SOLANA_CLUSTER`
- `EXPO_PUBLIC_SOLANA_RPC_URL`

Never expose:
- `SUPABASE_SERVICE_ROLE_KEY`
- `HELIUS_API_KEY`
- `BIRDEYE_API_KEY`
- `CDP_API_KEY_SECRET`
- `POWERCHAIN_TRANSACTION_BUILDER_API_KEY`
- quote-authority/private wallet keys
