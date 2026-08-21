# Changelog

## 1.7.0 — 2026-08-20

### Added
- launch operations service and authenticated control-plane endpoints
- `/dashboard/launch/[id]` readiness/health/treasury/authority/timeline workspace
- batch market price endpoint for Pyth, Birdeye and CoinGecko normalization
- Solana primary/fallback RPC circuit breaker and sanitized circuit diagnostics
- `/api/v1/system/realtime` WebSocket runtime status
- authenticated `launch:<id>` WebSocket subscriptions with launch-management checks
- request IDs on successful API envelopes
- Rust instruction/lifecycle tests and strict trailing-byte rejection

### Changed
- canonical backend path is now `apps/api/`; stale `backend/` compatibility folder removed
- Pyth provider health no longer incorrectly requires an API key when Hermes is otherwise configured
- lifecycle API client methods now retain pagination metadata
- API client includes launch operations, batch market and realtime methods
- docs, environment templates and OpenAPI contract updated for v1.6

### Security
- protected launch WebSocket channels require both a session and launch management authorization
- repeated RPC failures enter a bounded cooldown rather than repeatedly stalling the primary endpoint
- launch operator views never replace wallet authorization for signing

## 1.5.0 — 2026-08-20

- introduced `apps/api/v1`, campaign creation/launch review, Pyth/Birdeye/CoinGecko providers, WebSockets, Privy embedded wallets, dashboard profile/settings and the Solana program scaffold

## 1.4.0 — 2026-08-20

- added Better Auth, Prisma sessions, Cloudflare/OpenNext deployment, Helius and primary/fallback Solana RPC infrastructure

## 1.3.0 — 2026-08-20

- added shared typed packages, Turborepo orchestration and the initial Launch OS dashboard
