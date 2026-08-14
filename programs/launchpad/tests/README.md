# Launchpad Program Tests

Rust integration/regression tests for the native PowerChain Launchpad program.

Current coverage includes protocol constants and Borsh instruction round-trip stability. Add on-chain processor/state tests here as the deployed program interface expands.

```bash
pnpm program:test
```

The command requires a local Rust toolchain. SBF compilation is a separate `pnpm program:build` gate.
