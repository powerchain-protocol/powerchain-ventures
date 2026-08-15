# Solana Programs

On-chain program source lives under `programs/`.

The Launchpad program supports the sale lifecycle and Token-2022 interactions.

## Principles

- no fake program IDs
- no hard-coded private signing material
- canonical fee wallet enforcement
- quote-authorized purchase path
- explicit claim/vesting behavior
- deterministic PDA derivation
- checked account ownership/program IDs
- Token-2022 compatibility

## Build

Use the repository-supported Rust/Solana toolchain.

Do not claim SBF/program build success unless the actual Rust build was executed.
