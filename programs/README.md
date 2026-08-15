# PowerChain Solana Programs

PowerChain Launchpad™ `1.0.0` on-chain source lives under this Rust workspace.

```text
programs/
├── Cargo.toml
└── launchpad/
    ├── Cargo.toml
    ├── README.md
    ├── idl/
    │   └── powerchain-launchpad.json
    ├── src/
    │   ├── instruction.rs
    │   ├── lib.rs
    │   ├── processor.rs
    │   └── state.rs
    └── tests/
```

## Deployment identity

The repository deliberately does **not** compile a fabricated Launchpad Program ID. After a verified SBF deployment, provide the actual address through:

```text
POWERCHAIN_LAUNCHPAD_PROGRAM_ID
```

The client/backend validate that sale PDAs and the executable program account match that deployment.

## Purchase invariant

The `Purchase` operation requires both:

- buyer signature;
- configured quote-authority signature.

It enforces the canonical PowerChain fee wallet:

```text
FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy
```

and the fixed purchase service fee of **250 bps**.

The off-chain backend constructs the exact transaction in `apps/backend/lib/purchase-transaction-builder.ts`, partially signs it with the configured quote authority, simulates it, and hands the serialized transaction to `apps/checkout` for the buyer's wallet signature.

## Build and tests

With a Rust/Solana toolchain installed:

```bash
cd programs
cargo fmt --all -- --check
cargo check --workspace
cargo test --workspace
```

SBF deployment/build commands depend on the installed Solana toolchain and deployment environment. Do not treat a native `cargo check` as proof of a deployed or executable SBF program.
