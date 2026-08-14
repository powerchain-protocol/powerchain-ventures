# PowerChain Monorepo Regression Tests

These Node tests validate cross-cutting PowerChain Launchpad™ `1.0.0` contracts across apps, packages, database migrations, OpenAPI, mobile/native configuration, and transaction/security behavior.

Run all monorepo regressions:

```bash
node --test tests/*.test.mjs
```

Package-specific tests should live with the package when they do not require cross-workspace fixtures. Example: `packages/utils/tests/`.

Rust/Solana program tests live under `programs/launchpad/tests/` and run through `pnpm program:test`.
