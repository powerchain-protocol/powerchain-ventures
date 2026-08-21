# PowerChain Ventures v1.7.0

PowerChain Ventures is a modular **Tokenized Capital Launch OS** for creating, validating, launching, monitoring, settling and reporting wallet-controlled real-world capital launches on Solana.

> **Launch with intelligence. Execute with control. Settle on-chain.**

AI may analyze, prepare and coordinate. PowerChain may validate, simulate and orchestrate. **Only an authorized wallet can sign and execute consequential on-chain actions.**

## v1.7.0 UI/UX upgrade

PowerChain Ventures v1.7.0 focuses on product clarity and operator efficiency:

- refined marketing header with network/trust announcement and dedicated Create Launch action
- stronger globe hero with proof points, execution boundaries and live context cards
- new 11-stage Launch Lifecycle rail from Discover through Report
- improved project cards, hierarchy, spacing, responsive behavior and light/dark surfaces
- dedicated application-style Launchpad dashboard shell with sidebar navigation, selected-launch context, command search, notifications, account menu, theme and wallet controls
- improved mobile dashboard drawer and compact top bar
- marketplace hero upgraded with search, trust indicators and lifecycle metrics
- improved marketplace launch-card hover/focus feedback
- consistent wallet-controlled execution language across public and operator surfaces


## Workspace

```text
powerchain-ventures/
├── apps/
│   ├── frontend/              Next.js website + Launch OS + auth + wallets
│   ├── marketplace/           independent public discovery surface
│   └── api/                   Express API v1 + Better Auth + Prisma + RPC/data adapters
├── packages/
│   ├── components/            shared brand + shadcn/Radix UI primitives
│   ├── types/                 domain, RPC, market, launch-ops and realtime contracts
│   ├── config/                browser-safe shared configuration
│   └── api-client/            typed HTTP client
├── programs/                  Solana launch lifecycle program scaffold
├── schemas/                   portable JSON Schema contracts
├── env/                       environment profiles
├── ARCHITECTURE.md
├── SECURITY.md
├── DATABASE.md
├── SOLANA.md
└── CLOUDFLARE.md
```

## What v1.6 adds

- canonical `apps/api/` backend with `/api/v1/` HTTP contracts and `/api/v1/ws`
- launch control-plane endpoints for readiness, health, treasury, authorities and lifecycle timeline
- a launch-specific operator dashboard at `/dashboard/launch/[id]`
- market price normalization through Pyth, Birdeye and CoinGecko with ordered fallback
- batch market-price endpoint for dashboard/ticker use
- primary/fallback Solana RPC routing with an in-process circuit breaker and sanitized diagnostics
- Helius RPC/DAS/history support with server-only credentials
- protected realtime `launch:<id>` WebSocket channels and public `market:<SYMBOL>` channels
- embedded Solana wallets through Privy plus external Phantom/Solflare flows
- Better Auth + Prisma sessions, optional Cloudflare Turnstile, profile and settings surfaces
- campaign flow: configure → validate → prepare → simulate → wallet approval → chain verification → LIVE
- hardened Solana program instruction parsing and lifecycle transition tests
- request IDs in successful and error API envelopes

## Stack

Node 24.x, pnpm 11.22, Next.js 16, React 19, Tailwind CSS 4, Radix UI, shadcn-compatible primitives, Express 5, Better Auth, Prisma/PostgreSQL, Supabase optional integrations, `@solana/web3.js`, Helius, Pyth, Birdeye, CoinGecko, Privy embedded wallets, WebSockets and Cloudflare Workers/OpenNext for the two Next.js surfaces.

## Local development

```bash
corepack enable
corepack prepare pnpm@11.22.0 --activate
pnpm install
pnpm env:setup
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Local defaults:

```text
Frontend     http://localhost:3000
Marketplace  http://localhost:3001
API          http://localhost:4000
Auth         http://localhost:4000/api/auth/*
API v1       http://localhost:4000/api/v1
WebSocket    ws://localhost:4000/api/v1/ws
```

For a production Better Auth secret:

```bash
openssl rand -base64 48
```

## Validation

```bash
pnpm typecheck
pnpm build
pnpm program:check
pnpm program:test
```

The Rust program is intentionally separated from JavaScript workspace packages. Set `POWERCHAIN_LAUNCHPAD_PROGRAM_ID` only after deploying the intended program to the selected cluster.

## Production boundaries

The API may read chain state and construct/simulate unsigned transactions. It must never receive seed phrases or private keys. Helius, Birdeye, CoinGecko, database, Better Auth, Turnstile and Cloudflare secrets are server-only. Browser wallet RPC variables must not contain raw provider API keys.

Read [ARCHITECTURE.md](./ARCHITECTURE.md), [SECURITY.md](./SECURITY.md), [DATABASE.md](./DATABASE.md), [SOLANA.md](./SOLANA.md) and [CLOUDFLARE.md](./CLOUDFLARE.md) before enabling production writes.
