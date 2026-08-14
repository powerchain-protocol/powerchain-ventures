# PowerChain Launchpad Frontend

Next.js frontend for PowerChain Launchpad™ `1.0.0`.

## Responsibilities

- sale catalog and sale details
- wallet connection and wallet center
- checkout and exact transaction review
- claims and transaction receipts
- creator console/dashboard
- onboarding/auth/account UI
- analytics and integration status

The frontend never receives service-role, provider, quote-authority, or transaction-builder secrets.

## Development

```bash
pnpm --filter @powerchain/launchpad-frontend dev
pnpm --filter @powerchain/launchpad-frontend typecheck
pnpm --filter @powerchain/launchpad-frontend build
```
