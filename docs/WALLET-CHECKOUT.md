# PowerChain Wallet Center and Checkout

**Version:** 1.0.0

## Wallet Center

`/wallet` is a non-custodial PWRC/SOL account view. The backend reads confirmed SOL balance and, when a real `POWERCHAIN_PRESALE_MINT` is configured, derives the wallet's Token-2022 associated token account and reads its PWRC balance. Birdeye conversion values are display-only market estimates.

### Transfers

`POST /api/v1/transfers/prepare` creates an unsigned reviewed transaction for the connected wallet. SOL uses the System Program. PWRC uses Token-2022 `transferChecked`; the recipient Token-2022 associated token account is created idempotently when missing. The transfer plan always uses a **0 bps PowerChain service fee**.

`POST /api/v1/transfers/confirm` verifies the submitted signature, binds it to the exact prepared transaction message and verifies the actual recipient SOL balance delta or PWRC Token-2022 delivery before storing a settled receipt.

The application never accepts a private key, seed phrase or mnemonic.

## Checkout

`/checkout/[saleId]` reuses the canonical PowerChain purchase pipeline. `/api/v1/checkout` is a bootstrap/market-context endpoint, not a settlement shortcut. It validates wallet, idempotency, sale phase, exact start/end window, purchase bounds and the canonical 250 bps fee policy.

Birdeye supplies the displayed PWRC↔SOL/SOL-USD estimate when available. Exact payment amounts come from the subsequent PowerChain quote/preparation transaction and must pass the final transaction review and on-chain settlement verification.

## PWRC assets

Canonical frontend assets are under `apps/frontend/public/assets/pwrc/`. `apps/frontend/components/pwrc-coin.tsx` is the reusable token-art component. App icons are generated from the supplied transparent PWRC PNG.

## Mainnet configuration

A real deployed PWRC Token-2022 mint remains required. Source code does not invent one. Wallet PWRC balances/transfers fail closed until the deployment mint is configured and validated.
