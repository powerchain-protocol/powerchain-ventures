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

- **SOL wallet purchase:** enabled. Backend builds the actual Launchpad program transaction.
- **Coinbase Onramp:** optional wallet-funding rail. Funding SOL is not itself a token purchase.
- **Card:** disabled until a provider-owned PCI/tokenization flow is configured.
- **USDC/SUI sale payment:** not presented as active settlement until dedicated purchase verification adapters exist.

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
