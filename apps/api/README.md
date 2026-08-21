# PowerChain Ventures API v1.6.0

Express + TypeScript API for Better Auth, Prisma launch state, market/RPC fallbacks, Helius data, WebSockets and **non-signing** Solana transaction preparation.

```text
src/
├── api/v1/          canonical versioned routers
├── auth/            Better Auth + Prisma + optional Turnstile
├── cache/           bounded TTL/in-flight cache
├── common/          IDs, response envelopes, errors and safe utilities
├── context/         request correlation
├── env/             validated runtime configuration
├── lib/             Prisma, Supabase, Helius and Solana RPC
├── market/          Pyth/Birdeye/CoinGecko adapters
├── middleware/      auth, CORS, rate limits, security and errors
├── repositories/    persistence boundaries
├── services/        readiness, launch ops, campaigns and transactions
└── websocket/       public market + protected launch channels
```

Important operator routes include `/api/v1/launches/:id/overview`, `/health`, `/readiness`, `/timeline`, `/treasury` and `/authorities`. Market routes support both single and batch price reads. `/api/v1/system/fallbacks` reports sanitized RPC/provider/circuit state and `/api/v1/system/realtime` reports WebSocket counters.

Better Auth is mounted at `/api/auth/*` before Express JSON parsing. Launch-management reads/writes require a validated server session and creator/manager authorization.

The backend is a Node service. Deploy it behind a Cloudflare-proxied API hostname; the Next.js apps can run as Cloudflare Workers through OpenNext.
