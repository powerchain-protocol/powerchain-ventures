# Production Wiring Upgrade

This upgrade makes PWRC public protocol data a first-class shared workspace contract.

## Wired surfaces

- `@powerchain/token-data`
- backend `GET /api/v1/token`
- frontend token-data module, hook, token card, `/token` page
- mobile token-data module, service, hook
- generated frontend/mobile JSON snapshots
- validation, sync, drift and regression gates
- token/data/API documentation

## Fail-closed deployment behavior

The token is configuration-ready until a verified mint is supplied. No deployment address is synthesized by source code. Purchase settlement continues to require server-side quote and Solana verification; informational token data does not become settlement authority.

## Production verification

Run the normal repository gates after applying this upgrade:

```bash
pnpm install --no-frozen-lockfile
pnpm token:data:validate
pnpm token:data:sync:check
pnpm token:data:test
pnpm doctor:workspace
pnpm doctor:types
pnpm typecheck
pnpm build
```
