# PowerChain Launchpad — Next.js Configuration Report

Version: 1.0.0

## Frontend
- Next.js 16 typed routes enabled.
- `x-powered-by` disabled.
- Browser production source maps disabled.
- Production `BACKEND_ORIGIN` is required, must be absolute HTTPS, and cannot point to localhost.
- `/api/v1/*` is rewritten to the separately deployable backend.
- Workspace packages are transpiled explicitly.
- Monorepo `outputFileTracingRoot` is configured for standalone builds.
- Vercel uses native Next.js output; Docker/self-hosted builds use `output: "standalone"`.
- Security headers and long-lived immutable asset caching retained.

## Backend
- Next.js 16 typed routes enabled.
- `x-powered-by` disabled.
- Browser production source maps disabled.
- API responses remain `no-store` by default.
- Workspace packages are transpiled explicitly.
- Monorepo `outputFileTracingRoot` is configured for standalone builds.
- Vercel uses native Next.js output; Docker/self-hosted builds use `output: "standalone"`.

## Validation
- Repository guard: PASS
- Existing regression suite: PASS
- Next config syntax transpilation: PASS
- Vercel JSON parsing: PASS
