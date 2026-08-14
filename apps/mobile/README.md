# PowerChain Launchpad Mobile

Expo/React Native application for PowerChain Launchpad™ `1.0.0`, with checked-in native iOS and Android projects.

## Navigation

- Home
- Launches
- Wallet
- Activity
- Account

Checkout, claims, transaction receipts, auth, onboarding, and creator tools use native stack/modal routes.

## Environment

Copy `.env.example` to a local environment file and configure only `EXPO_PUBLIC_*` values. Server secrets stay in the backend environment.

## Development

```bash
pnpm mobile:check:install
pnpm mobile:doctor
pnpm mobile:typecheck
pnpm mobile:ios
# or
pnpm mobile:android
```

See [`../../docs/MOBILE-APP.md`](../../docs/MOBILE-APP.md) and [`../../docs/MOBILE-INSTALL-TROUBLESHOOTING.md`](../../docs/MOBILE-INSTALL-TROUBLESHOOTING.md).
