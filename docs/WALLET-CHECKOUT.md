# PowerChain Wallet Center and Checkout

**Version:** `1.0.0`

## Application ownership

```text
apps/frontend   sale discovery, wallet center, claims, creator console
apps/checkout   payment UX, exact purchase review, buyer signature
apps/backend    price/quote authority, transaction construction, verification, settlement
```

There is no `payload/` application layer.

## Wallet Center

`/wallet` in `apps/frontend` is non-custodial. The backend reads confirmed SOL, PWRC Token-2022 and native Solana USDC balances.

Wallet transfers use:

```text
POST /api/v1/transfers/prepare
POST /api/v1/transfers/confirm
```

SOL uses the System Program. PWRC uses Token-2022. USDC uses the standard SPL Token program. Wallet transfers have **0 bps** PowerChain service fee and are verified against the reviewed transaction before a receipt is stored.

## Checkout

The purchase UI is exclusively:

```text
apps/checkout/app/checkout/[saleId]/page.tsx
```

The Launchpad frontend redirects to the dedicated Checkout app and does not contain a second purchase form.

Purchase sequence:

```text
GET  /api/v1/launchpad/catalog
POST /api/v1/checkout
POST /api/v1/launchpad/quote
POST /api/v1/launchpad/purchase/prepare
wallet review + signature
POST /api/v1/launchpad/purchase/confirm
settlement/finality reconciliation
```

Purchase preparation is server-owned. The backend:

1. reloads canonical sale state and eligibility;
2. validates the active sale window and wallet limits;
3. calculates token base units and the fixed **250 bps** service-fee policy;
4. obtains a bounded SOL/USD market observation;
5. derives the exact native-SOL principal and service-fee lamports;
6. creates the buyer's Token-2022 ATA idempotently when needed;
7. builds the PowerChain Launchpad `purchase` instruction;
8. partially signs the exact instruction with the configured quote authority;
9. simulates the transaction;
10. returns the serialized transaction to the connected buyer wallet for final review/signing.

The backend never exposes `POWERCHAIN_QUOTE_AUTHORITY_KEYPAIR_JSON`.

## Pending confirmation

Once a wallet returns a signature, Checkout stores only the non-secret review/signature recovery tuple locally. Reload recovery calls confirmation again; it **does not automatically resubmit the financial transaction**.

## Coinbase Onramp

Coinbase Onramp is wallet funding only. Its hosted session is created server-side and targets SOL on the connected Solana wallet. After funding, the buyer returns to `/onramp-return` and creates a separate reviewed PowerChain purchase.

## Card payments

Raw PAN, CVV or expiry fields are not rendered by PowerChain Checkout. A card rail remains disabled until a provider-owned PCI/tokenization integration is configured.
