# PowerChain Launchpad Program

Native Rust/Solana program for PowerChain Launchpad™ `1.0.0`.

The crate intentionally does not compile a fabricated deployment ID. Deploy the verified SBF program and configure the resulting address through `POWERCHAIN_LAUNCHPAD_PROGRAM_ID`.

## Modules

- `instruction.rs` — Borsh instruction payloads and enum tags.
- `state.rs` — sale/participant state and PDA seed constants.
- `processor.rs` — instruction dispatch and protocol enforcement.
- `error.rs` — program errors.
- `entrypoint.rs` — Solana entrypoint.
- `idl/` — client-facing program description.
- `tests/` — deterministic protocol/codec regression tests.

## Protocol invariants

- PowerChain purchase fee is fixed at 250 bps.
- Canonical fee wallet is compiled as protocol policy.
- Quote authority co-signs purchases.
- Token-2022 mint/vault binding is validated on-chain.
- Purchase nonce is monotonic per participant.
- Sale allocation cannot be exceeded.
- Claims cannot exceed entitlement/vesting state.
- Program ID remains deployment-owned, not fabricated in source.

## Commands

```bash
pnpm program:check
pnpm program:test
pnpm program:build
```

`program:build` requires the Solana SBF toolchain.


## Checkout integration

The program is not called directly from browser-authored instructions. `apps/backend/lib/purchase-transaction-builder.ts` constructs the exact `Purchase` instruction through `@powerchain/launchpad-program-client`, applies the canonical PDAs/accounts, partially signs with the quote authority, simulates the transaction, and returns it to `apps/checkout` for buyer review and signature.

`apps/backend/app/api/v1/launchpad/purchase/confirm/route.ts` then checks:

- submitted signature matches the prepared serialized transaction;
- participant PDA and monotonic purchase nonce advanced as expected;
- native SOL sale proceeds reached the exact sale receiver;
- the exact 250 bps service fee reached the canonical PowerChain fee wallet;
- immediate Token-2022 delivery occurred when the sale is configured for immediate delivery.

A transaction signature alone is not treated as a completed purchase.
