# @powerchain/launchpad-frontend

Next.js 16 App Router frontend for PowerChain Launchpad™ `1.0.0`.

## Responsibilities

- launchpad discovery and sale details
- wallet center and non-purchase transaction review
- sale discovery and secure-checkout redirect
- claims and receipts
- creator dashboard and sale creation
- account/authentication UX
- API/developer documentation
- responsive PWA shell

## Branding

Application branding uses:

```text
public/assets/brand/powerchain-mark-dark.png
components/logo.tsx
```

The header, favicon, PWA icons and Apple touch icon all derive from this brand source. PWRC token artwork stays under token-specific assets.

## Header

`components/app-shell.tsx` owns the application header/footer shell.

Primary navigation is deliberately compact. Secondary destinations live in the accessible `More` menu, while wallet/account actions remain separate controls.

## Environment

Use `.env.example` / `.env.local` for local browser-safe configuration.

Never expose Helius keys, service-role keys, transaction-builder credentials or private signing material in frontend variables.

## Commands

```bash
pnpm dev:frontend
pnpm build:frontend
pnpm doctor:frontend
pnpm doctor:runtime-resolution
```


## Checkout boundary

`apps/frontend` does not own payment or token-purchase forms. Sale detail pages redirect to `NEXT_PUBLIC_CHECKOUT_URL`.

Purchase/payment UI belongs to `apps/checkout`; authoritative quote, pricing, transaction construction and settlement belong to `apps/backend`.
