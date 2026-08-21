# Cloudflare Deployment

PowerChain Ventures deploys both Next.js surfaces to **Cloudflare Workers** through OpenNext. The Express/Prisma backend remains a Node service and should be exposed through a protected Cloudflare-proxied API hostname rather than pretending the Node server is a Workers runtime.

## Next.js Workers

Both apps contain:

- `wrangler.jsonc`
- `open-next.config.ts`
- `@opennextjs/cloudflare`
- Wrangler
- preview/deploy/type-generation scripts

```bash
pnpm --filter @powerchain/frontend preview
pnpm --filter @powerchain/frontend deploy
pnpm --filter @powerchain/marketplace preview
pnpm --filter @powerchain/marketplace deploy
```

Wrangler configs use `nodejs_compat`, `.open-next/worker.js`, `.open-next/assets`, and Workers observability.

## Environment variables

Public `NEXT_PUBLIC_*` values required during the Next build must be configured in the Cloudflare Workers build environment. Runtime/backend secrets belong in the backend deployment environment, not in the Next.js Worker bundle.

Never commit:

- `CLOUDFLARE_API_TOKEN`
- `BETTER_AUTH_SECRET`
- `TURNSTILE_SECRET_KEY`
- `HELIUS_API_KEY`
- database credentials

## Turnstile

Configure a Turnstile widget for the frontend hostname:

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<public-site-key>
TURNSTILE_SECRET_KEY=<backend-only-secret>
```

The client renders the widget; Better Auth performs server verification for email sign-up/sign-in. Leave both values empty to disable Turnstile locally.

## API proxy model

Recommended production DNS:

```text
powerchain.ventures       → Cloudflare Worker (frontend)
market.powerchain.ventures→ Cloudflare Worker (marketplace)
api.powerchain.ventures   → Cloudflare proxy/WAF → Node backend origin
```

Set production values such as:

```env
BETTER_AUTH_URL=https://api.powerchain.ventures
NEXT_PUBLIC_AUTH_URL=https://api.powerchain.ventures
CORS_ORIGIN=https://powerchain.ventures,https://market.powerchain.ventures
AUTH_TRUSTED_ORIGINS=https://powerchain.ventures,https://market.powerchain.ventures
TRUST_CLOUDFLARE_PROXY=true
```

When trusting `CF-Connecting-IP`, prevent direct public access to the origin so clients cannot forge proxy headers. The backend only enables Express proxy trust and Better Auth IP tracking when `TRUST_CLOUDFLARE_PROXY=true`; otherwise forwarding headers are not treated as a trusted client identity.


## Production edge checklist

- proxy `api.powerchain.ventures` through Cloudflare and restrict the origin to trusted ingress
- configure WAF/rate-limit rules for `/api/auth/*` and Helius-backed `/api/v1/solana/*` reads
- keep `CLOUDFLARE_API_TOKEN` in CI/developer secret storage only
- configure `NEXT_PUBLIC_*` values as Workers build variables; never place backend secrets in the Worker build environment unless the Worker itself needs them
- test with `pnpm ... preview` because Cloudflare production runs in `workerd`, not the local Next.js Node dev runtime
