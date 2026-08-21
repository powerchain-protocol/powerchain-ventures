# PowerChain Ventures — Security Model v1.7.0

## Core trust rule

PowerChain does not request, store, reconstruct or transmit wallet seed phrases or private keys. AI and backend services may prepare or simulate, but only an authorized wallet may sign.

## Authentication

Better Auth is the canonical application-account layer and uses Prisma/PostgreSQL. Email/password registration enforces a 12-character minimum. Production cookies are HTTP-only and Secure, trusted origins must be exact HTTPS origins, and the Better Auth secret must be high entropy. Optional Cloudflare Turnstile protection is validated server-side.

Wallet connection remains a separate capability. Application authentication never grants chain signing permission, and wallet connection alone does not grant access to creator-only API resources.

## API protections

The API uses explicit CORS origins, Helmet headers, request IDs, bounded JSON bodies, Zod validation, write/general/market rate limits, centralized error mapping and recursive secret-material rejection. Sensitive launch lifecycle endpoints verify both session state and launch management authority.

All successful and error envelopes carry the request ID so frontend actions can be correlated with server logs without exposing internal stack traces.

## WebSocket protections

The realtime server validates browser origins, limits connections per IP, caps subscriptions, limits frame size, disables compression and terminates dead clients. `market:*` channels are public; `launch:*` channels require an authenticated Better Auth session and launch management permission.

## Cloudflare proxy trust

Only enable `TRUST_CLOUDFLARE_PROXY=true` when the API origin is protected from direct untrusted ingress. When enabled, client IP handling may use `CF-Connecting-IP`; otherwise forwarded headers are not treated as trusted identity data.

## Helius and RPC credentials

`HELIUS_API_KEY`, keyed Helius URLs, Birdeye/CoinGecko keys, database credentials, Better Auth secrets, Supabase service-role keys and Cloudflare API tokens are server-only. Browser RPC configuration rejects URLs containing `?api-key=` and falls back to public cluster RPC endpoints.

The Solana backend exposes sanitized provider metadata without query strings. A primary/fallback circuit breaker reduces repeated requests to failing RPC providers. Transaction simulation disables signature verification and never signs or submits a transaction.

## Transaction review

Prepared transactions are tied to a persisted review ID, expected launch, authority, expiry and simulation status. Confirmation verifies the expected wallet signature and the resulting on-chain launch state before persisting `LIVE`. UI confirmation is not authoritative by itself.

## Solana program boundary

The program requires the configured authority to sign lifecycle transitions, verifies account ownership, rejects reinitialization, checks the launch PDA seed, rejects trailing instruction bytes and allows only explicit state transitions.

## Production checklist

Use exact HTTPS CORS/auth origins, protect the API origin behind Cloudflare/WAF, rotate secrets outside source control, deploy migrations before enabling auth, configure a dedicated production RPC plus fallback, set the deployed launchpad program ID, test transaction simulation against the target cluster, and verify that no browser bundle contains server credentials.
