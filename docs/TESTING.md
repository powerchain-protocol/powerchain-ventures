# Testing

PowerChain uses layered validation instead of treating a single build command as sufficient.

## 1. Source-only checks

These should work before dependency-backed app builds:

```bash
node scripts/check-workspace.mjs
node scripts/check-pnpm-policy.mjs
node scripts/check-vercel-config.mjs
node scripts/check-env-example.mjs
node scripts/check-app-env-files.mjs
node scripts/check-mobile-env-example.mjs
node scripts/check-mobile-native.mjs
```

## 2. Shared contract tests

The `packages/token-data/tests` suite covers:

- canonical token/public data
- runtime schema compatibility
- resilience and circuit breakers
- API contracts
- security policy
- request fingerprinting
- idempotency
- mutation orchestration
- atomic reservations
- mutation recovery
- settlement transitions/finality

## 3. Repository regression tests

`tests/` contains repository-level checks for organization, routes, package filters, environment boundaries, migrations, and production invariants.

## 4. Dependency-backed validation

After installation:

```bash
pnpm typecheck
pnpm test
pnpm build
```

## 5. Production-specific gates

Run relevant gates when changing critical subsystems:

```bash
pnpm production:security:check
pnpm production:runtime:check
pnpm production:persistent-runtime:check
pnpm production:atomic-mutation:check
pnpm production:mutation-recovery:check
pnpm production:settlement:check
```

## Test rules

- Tests must not require real private credentials.
- Tests must not submit mainnet transactions.
- Use deterministic fixtures.
- Avoid locale-dependent number formatting.
- Avoid `Math.random()` for identifiers or financial fingerprints.
- Financial amounts should use canonical integer/base-unit strings.
