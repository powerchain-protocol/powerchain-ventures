# PowerChain Launchpad Program Operations

PowerChain Launchpad 1.0.0 includes a native Solana program scaffold under `programs/launchpad` and a typed TypeScript client under `packages/program-client`.

## Trust boundaries

- The real `POWERCHAIN_LAUNCHPAD_PROGRAM_ID` is supplied only after deployment; source code does not invent one.
- The canonical 2.5% fee wallet is `FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy`.
- Token custody moves to a sale-specific vault-authority PDA during activation.
- A configured `POWERCHAIN_QUOTE_AUTHORITY_WALLET` must co-sign purchases. This prevents direct program calls with self-selected token/payment amounts while keeping the buyer wallet as a required signer.
- The quote-authority private key belongs in the external transaction-builder/signing service, never in the browser or this repository.
- Claim instructions do not require the quote authority because program state enforces purchased entitlement, claim start, cliff and vesting math.

## PDAs

- Sale: `['sale', creator, mint, sha256('powerchain:launchpad:sale:' + saleId)]`
- Vault authority: `['vault', salePda]`
- Participant: `['participant', salePda, wallet]`

## Operations

1. `InitializeSale` — creates sale PDA, persists fee/quote authority, economics, timing and delivery mode.
2. `AdoptVaultAuthority` — transfers Token-2022 account authority to the vault PDA.
3. `Purchase` — buyer + quote authority sign, principal and 2.5% fee transfer, nonce increments, immediate delivery or claim entitlement records.
4. `Claim` — transfers the claimable Token-2022 amount from the vault PDA to the participant wallet token account.
5. `SetPaused` — creator pauses/resumes purchases and claims.
6. `UpdateTiming` — creator may update timing before the sale starts and before any purchase.
7. `CancelSale` — only before any confirmed/on-chain sale quantity exists.
8. `CompleteSale` — only after sale end and, for claim-delivery sales, after all purchased units are claimed.

## Delivery modes

`delivery_on_claim` is separate from `vesting_enabled`:

- immediate: transfer purchased tokens in the purchase transaction.
- claim without vesting: make the full entitlement claimable at `claim_starts_at`.
- claim with vesting: apply cliff and linear vesting before allowing transfer.

## Backend verification

The backend never trusts a signature alone. It verifies the exact serialized transaction message, Solana confirmation, program instruction, sale/participant PDA, purchase nonce, quote-authority signer, payment/fee settlement, and Token-2022 delivery. Program-operation evidence is persisted in `launchpad_program_operations`.

## Build

```bash
pnpm program:check
pnpm program:test
pnpm program:build
```

`program:build` requires the Solana CLI/SBF toolchain. A successful TypeScript/Next.js build is not a substitute for the Rust/SBF build gate.
