# Release Resilience Checks

Recommended release order:

```bash
pnpm token:data:check
pnpm public:data:production-check
pnpm public:data:snapshots
pnpm doctor:workspace
pnpm doctor:types
pnpm typecheck
pnpm build
```

Client snapshot validation confirms manifest structure and release/schema compatibility. Full production compilation remains the final dependency-backed gate.
