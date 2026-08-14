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

Use `apps/mobile/.env.example` as the template and `apps/mobile/.env.local` for local development. Configure only `EXPO_PUBLIC_*` values plus `IOS_BUNDLE_IDENTIFIER` and `ANDROID_PACKAGE_NAME`. Server secrets stay in the backend environment.

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


For local development the included `.env.local` targets the local frontend/backend
and Solana devnet. Android emulators may need `10.0.2.2` instead of `localhost`
for host-machine services.
