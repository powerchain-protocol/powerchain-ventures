# @powerchain/launchpad-checkout

Dedicated Next.js 16 payment and token-purchase application for PowerChain Launchpad™ `1.0.0`.

## Ownership

Checkout owns payment presentation and buyer transaction signing:

```text
Launchpad sale
   ↓
apps/checkout
   ↓
server quote
   ↓
server-built exact Solana transaction
   ↓
buyer review
   ↓
wallet signature
   ↓
backend confirmation / reconciliation
```

It does **not** own authoritative sale prices, eligibility, service-fee policy, signing secrets, database settlement, or Solana verification. Those remain in `apps/backend`.

There is no `payload/` or `apps/payload/` application layer.

## Routes

```text
/checkout/[saleId]    purchase flow
/onramp-return        return from hosted wallet funding
/api/v1/[...path]     same-origin proxy to apps/backend
```

Local port: `3002`.

## Payment methods

- **SOL → PWRC:** enabled and the default purchase method.
- **Solana Pay QR:** enabled by default as an alternate presentation of the exact prepared SOL → PWRC transaction.
- **Coinbase Onramp:** disabled by default; optional wallet-funding rail. Funding SOL is not itself a token purchase.
- **Stripe hosted funding:** disabled by default; no raw PAN/CVV/expiry fields exist in Checkout.
- **USDC / CCTP / SUI / ZK compressed rails:** disabled by default and fail closed until their dedicated settlement adapters are intentionally enabled.

## Market data

`/api/v1/market/prices` and `/api/v1/market/rates` are backend-owned. The checkout can display an informational SOL/USD snapshot, but the backend takes the payment conversion snapshot again while constructing the exact purchase transaction.

Provider credentials never belong in `apps/checkout/.env*`.

## Local development

```bash
pnpm dev:backend
pnpm dev:frontend
pnpm dev:checkout
```

Then open `http://localhost:3002`.

## Production build

```bash
pnpm build:packages
pnpm --filter @powerchain/launchpad-checkout typecheck
pnpm --filter @powerchain/launchpad-checkout build
```


## Finality completion

Checkout persists the non-secret signed-purchase recovery tuple and polls the durable settlement returned by the backend. The success screen is shown only when the settlement reaches `reconciled` after Solana finalization.

Recovery retries confirmation/finality reads only; it never automatically resubmits the financial transaction.


## Solana Pay QR

After the buyer prepares the exact purchase, Checkout can render a Solana Pay transaction-request QR. A wallet fetching that QR receives the same prepared serialized transaction, and the backend searches for a matching signed message without resubmitting anything.

The QR path converges back into the normal PowerChain purchase confirmation and `reconciled` settlement boundary.
