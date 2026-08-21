# PowerChain Ventures — Architecture v1.7.0

PowerChain Ventures keeps presentation, authentication, market/RPC providers, transaction preparation and wallet signing in explicit boundaries.

```text
                         CLOUDFLARE
                ┌────────────────────────┐
                │ CDN / WAF / Workers    │
                │ Turnstile (optional)   │
                └───────────┬────────────┘
                            │
           ┌────────────────┴────────────────┐
           ▼                                 ▼
   apps/frontend                      apps/marketplace
 Website + Launch OS                  Public discovery
 Next.js / OpenNext                   Next.js / OpenNext
           │
           │ credentialed HTTPS / WS
           ▼
                         apps/api
        Express + Better Auth + Prisma + API v1
           │            │                │
     ┌─────┴─────┐      │       ┌────────┴────────┐
     ▼           ▼      ▼       ▼                 ▼
 PostgreSQL   Supabase  Helius  Pyth/Birdeye   Solana RPC
 canonical    optional          /CoinGecko       primary
 persistence  services                           + fallback
     │                                              │
     └────────────────┬─────────────────────────────┘
                      ▼
             exact transaction review
                      │
            validate + simulate only
                      │
                      ▼
           authorized browser/embedded wallet
                      │
                      ▼
                    Solana
                      │
                      ▼
              programs/src lifecycle
```

## Runtime surfaces

`apps/frontend` owns marketing, Better Auth client state, Launch OS operator UX, Privy embedded wallets, external wallet connections and transaction review. `apps/marketplace` is independently deployable and reads public launch data. `apps/api` owns sessions, persistence, API validation, market/RPC provider fallbacks, Helius access, WebSockets and non-signing transaction preparation. `programs/` contains the wallet-authorized launch lifecycle program scaffold.

## API v1

The canonical prefix is `/api/v1`. Main groups are `health`, `account`, `launches`, `campaigns`, `eligibility`, `transactions`, `solana`, `market`, `lifecycle` and `system`.

Launch operator endpoints expose dynamic readiness, sale health, treasury state, authority state and timeline data. Operational endpoints require a server-validated Better Auth session and creator/manager authorization. Public launch summaries and market prices remain readable without a management session.

## Realtime

`/api/v1/ws` supports two channel classes:

```text
market:<SYMBOL>       public normalized price updates
launch:<launchId>     authenticated launch-management events
```

The server limits connections per IP, validates origins, caps subscriptions, uses ping/pong heartbeats and disables per-message compression. Realtime responses advertise REST fallbacks so UI state can degrade to polling when WebSockets are unavailable.

## Market data

```text
request
  → asset resolver
  → configured provider order
  → Pyth
  → Birdeye
  → CoinGecko
  → normalized MarketPriceResult
  → bounded TTL cache
```

A provider failure never becomes an executable action. Provider provenance remains attached to every normalized result.

## Solana RPC fallback

The backend uses a primary connection selected by `SOLANA_RPC_PROVIDER` and an optional fallback. Repeated failures open a short local circuit so the API can temporarily skip a failing endpoint instead of repeatedly stalling requests. Runtime diagnostics expose only sanitized endpoints and circuit state.

## Transaction lifecycle

```text
EDIT
  → VALIDATE
  → REVIEW CHANGES
  → BUILD UNSIGNED TRANSACTION
  → SIMULATE
  → AUTHORITY CHECK
  → WALLET APPROVAL
  → SUBMIT
  → VERIFY ON SOLANA
  → RECORD
```

A Better Auth session is not a blockchain signature. A connected wallet is not automatically an application session. Both boundaries must be satisfied for protected launch execution.
