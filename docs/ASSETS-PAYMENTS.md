# Assets and Payments

Canonical frontend asset metadata lives in:

```text
apps/frontend/data/assets.ts
```

Current asset presentation:

- PWRC — Solana Token-2022
- SOL — Solana native
- USDC — Solana token
- SUI — Sui native

SOL and USDC are eligible payment-asset integrations on the Solana payment
layer. SUI is represented with its real network/token icon but remains disabled
for settlement until a reviewed Sui settlement adapter is configured.

This prevents the UI from implying cross-chain settlement before backend
verification/finality logic exists.

Web3 icons are rendered with `@web3icons/react`; PWRC continues to use the
canonical PowerChain brand mark.
