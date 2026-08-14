# PowerChain Solana Programs

On-chain programs for PowerChain Launchpad™ `1.0.0` live here.

```text
programs/
├── Cargo.toml                 # Rust workspace
└── launchpad/
    ├── Cargo.toml
    ├── README.md
    ├── idl/
    ├── src/
    └── tests/
```

The Launchpad program has no fabricated deployment ID. The verified deployment address belongs in `POWERCHAIN_LAUNCHPAD_PROGRAM_ID` after SBF deployment.

See [`launchpad/README.md`](launchpad/README.md) for protocol invariants and test/build commands, and [`../docs/PROGRAM-OPERATIONS.md`](../docs/PROGRAM-OPERATIONS.md) for backend/PDA/transaction-builder integration.
