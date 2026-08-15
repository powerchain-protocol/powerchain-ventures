# Production Convergence

This release layer combines dependency, API, data, and provenance checks into one production gate.

## Dependency guard

`node scripts/check-production-dependencies.mjs`

Critical checks include:

- PowerChain release stays `1.0.0`
- mobile `react-native-screens` is exactly `4.26.0`
- ConnectorKit is `0.2.6`
- apps use `@powerchain/token-data` through `workspace:*`
- pnpm strict dependency-build policy remains enabled
- global build-script bypass remains disabled

Some framework/library version checks are warnings rather than failures so a deliberate future upgrade does not become impossible.

## Public route policy

`node scripts/check-public-route-policy.mjs`

The checker ensures the public v1 metadata routes exist, expose GET handlers, and do not directly reference secret-like environment variables or auth/cookie response logic.

## Provenance

`node scripts/generate-production-provenance.mjs`

The generated report records SHA-256 and byte length for canonical public data, release manifests, snapshot manifests, and OpenAPI data.

Generate before release:

```bash
node scripts/generate-production-provenance.mjs
```

Verify without mutation:

```bash
node scripts/generate-production-provenance.mjs --check
```

## Final release gate

```bash
pnpm production:release:check
pnpm typecheck
pnpm build
```
