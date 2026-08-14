# Coinbase-hosted Onramp

PowerChain uses Coinbase-hosted Onramp as an optional wallet-funding rail. It does **not** purchase PWRC directly: Coinbase sends SOL to the connected Solana wallet, then the user returns to PowerChain and signs the normal reviewed Launchpad purchase transaction.

## Security

- CDP Secret API Key stays backend-only.
- Onramp sessions are created server-side and are single-use.
- PowerChain applies its existing CORS, rate-limit and idempotency boundaries.
- Redirect URLs must be added to the CDP Portal domain allowlist in production.
- PowerChain does not collect Coinbase credentials or card data.
- Coinbase-hosted Guest Checkout was deprecated on June 30, 2026. Apple Pay/Google Pay/debit-card guest experiences should use Coinbase Headless Onramp instead.

## Environment

```env
CDP_API_KEY_ID=
CDP_API_KEY_SECRET=
CDP_ONRAMP_ENABLED=false
CDP_ONRAMP_REDIRECT_URL=https://launchpad.example.com/checkout/onramp-return
```

## Flow

1. Connect the destination Solana wallet.
2. Choose Coinbase in Checkout and select a USD amount.
3. Backend creates a single-use Coinbase Onramp session for `SOL` on `solana`.
4. Coinbase-hosted checkout funds the connected wallet.
5. User returns to PowerChain, refreshes funding status/balance, and completes the normal PWRC purchase.

Coinbase quote/fees are provider-side and are not the PowerChain 2.5% Launchpad fee. The PowerChain fee is applied only to the later PWRC sale transaction.
