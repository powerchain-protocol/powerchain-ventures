# PowerChain Launchpad mainnet-beta production

PowerChain Launchpad 1.0.0 is fail-closed for production Solana mainnet-beta. A production deployment requires two dedicated/private HTTPS RPC endpoints, the expected mainnet genesis prefix, a valid PowerChain treasury wallet, Supabase service-role access, and the transaction-builder service.

## Network identity

`/api/v1/launchpad/network` verifies `getGenesisHash`, `getSlot`, `getBlockHeight`, and `getVersion`. Production sale creation performs the same identity verification before Token-2022 mint/vault validation and persists the sale's `cluster`, `genesis_hash`, and Token-2022 program id.

## Required mainnet values

- `NEXT_PUBLIC_SOLANA_CLUSTER=mainnet-beta`
- `SOLANA_RPC_URL` and at least one fallback using dedicated/private endpoints
- `SOLANA_EXPECTED_GENESIS_PREFIX=5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`
- `POWERCHAIN_TREASURY_WALLET`
- canonical presale mint, funded Token-2022 vault, and vault authority

Do not put private provider credentials into `NEXT_PUBLIC_SOLANA_RPC_URL`. The browser RPC may be a restricted browser-safe endpoint; all authoritative validation/settlement uses the server RPC pool.

## Signing and settlement

Wallets sign only the serialized transaction shown in the final review. Backend confirmation checks the confirmed signature, exact transaction message, payment settlement, PowerChain fee, and token delivery before the database records settlement.
