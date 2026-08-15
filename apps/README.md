# Applications

PowerChain Launchpad applications:

- `frontend` — Next.js Launchpad, wallet/account, creator and documentation UI
- `backend` — Next.js API v1, pricing, transaction construction, verification and settlement
- `checkout` — Next.js dedicated payment and token-purchase application
- `mobile` — Expo/React Native companion

Applications consume shared workspace packages instead of duplicating public/runtime contracts.

Server-only code must remain in `apps/backend` or explicit server-only packages.


Applications must not reach into another app through relative imports. Shared code belongs in `packages/*`; cross-application runtime communication goes through API boundaries. `pnpm doctor:workspace-boundaries` enforces this rule.

There is no `payload/` or `apps/payload/` application layer.
