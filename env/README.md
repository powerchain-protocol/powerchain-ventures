# Environment profiles v1.6.0

- `env/api.example` — API, Better Auth, database, RPC fallback/circuit settings, Helius, Pyth, Birdeye and CoinGecko.
- `env/frontend.example` — browser-safe site, auth, Turnstile site key, wallet and public RPC values.
- `env/marketplace.example` — public Marketplace configuration.

Never expose Helius/Birdeye/CoinGecko secrets, database URLs, Better Auth secret, Supabase service-role key, Turnstile secret or Cloudflare API token through `NEXT_PUBLIC_*` variables.
