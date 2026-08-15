# Production Data Readiness

The backend exposes a reusable `checkPublicDataReadiness()` helper.

A public-data readiness failure is appropriate when canonical data is internally invalid. A `configuration-ready` token without a verified mint is valid and should not by itself make the application unhealthy.

When PWRC is marked `verified`, a mint address becomes mandatory.

Recommended release sequence:

```bash
pnpm token:data:check
pnpm public:data:validate
pnpm public:data:sync:check
pnpm doctor:workspace
pnpm doctor:types
pnpm typecheck
pnpm build
```
