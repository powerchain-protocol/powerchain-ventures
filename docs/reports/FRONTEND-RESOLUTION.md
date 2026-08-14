# PowerChain Frontend Resolution Report

Version: 1.0.0

This release hardens Next.js 16 / Turbopack resolution for local PowerChain workspace packages and ConnectorKit.

## Fixed error classes

- `Can't resolve '@powerchain/launchpad-config'`
- `Can't resolve '@powerchain/utils/helpers'`
- `Can't resolve '@powerchain/utils/http'`
- `Can't resolve '@solana/connector/react'`
- `Can't resolve '@solana/connector/headless'`

## Resolution policy

1. PowerChain packages remain declared using `workspace:*`.
2. Frontend/backend tsconfigs have explicit source aliases for local package source.
3. Next.js Turbopack root is the monorepo root.
4. pnpm explicitly links/prefer local workspace packages.
5. ConnectorKit is pinned to 0.2.6 and its official React/headless exports are checked before dev/build.

## Local repair

```bash
corepack enable
pnpm install --force --no-frozen-lockfile
pnpm doctor:workspace
pnpm doctor:types
pnpm doctor:frontend
pnpm typecheck
pnpm build
```

## Turbopack-safe package output

PowerChain workspace runtime exports now point to generated `dist/*.js` and type exports to `dist/*.d.ts`. This avoids relying on Turbopack resolving a `.js` specifier to a TypeScript source file. `predev` and `prebuild` generate those package artifacts before Next.js starts.
