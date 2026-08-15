# Account Security

PowerChain separates three concerns:

1. Account authentication
2. Wallet ownership proof
3. Transaction authorization

A Better Auth account does not authorize wallet transactions. A wallet-auth
session proves ownership of a Solana wallet but does not grant token-transfer
authority.

## Linked wallets

PowerChain account users can list and unlink verified wallet identities through:

```text
GET    /api/v1/account/wallets
DELETE /api/v1/account/wallets
```

Unlinking removes the account-to-wallet identity association. It does not change
the wallet itself and cannot revoke blockchain ownership.

## Route guards

`requireAccountSession()` accepts either account or wallet-auth sessions.

`requireBetterAuthAccount()` requires a Better Auth account and is used for
account-level identity management.

## Network capability matrix

Frontend capabilities are explicit. Solana sale settlement is enabled. Sui
wallet connectivity and balance presentation may be enabled independently while
Sui sale settlement remains adapter-gated.
