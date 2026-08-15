# @powerchain/solana

Shared Solana protocol utilities for PowerChain Launchpad 1.0.0.

Exports:

```text
@powerchain/solana
@powerchain/solana/tokens
@powerchain/solana/pay
@powerchain/solana/settlement
@powerchain/solana/websocket
```

The package uses `@solana/web3.js` and `@solana/spl-token` for SPL Token/Token-2022 address handling and ATA derivation. `pay` implements the Solana Pay transfer/transaction-request wire format used by Checkout. `settlement` provides shared Solana signature-state normalization; durable PowerChain financial completion remains backend-owned and requires `reconciled`.
