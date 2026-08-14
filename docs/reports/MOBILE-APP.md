# Mobile App Report

PowerChain Launchpad 1.0.0 now includes `apps/mobile` for iOS and Android.

- Expo SDK 57 / React Native 0.86 / React 19.2
- Expo Router Stack + Tabs
- Light-first PowerChain design with dark-mode support
- Four-screen onboarding
- Supabase email/password authentication with SecureStore session storage
- Public launch catalog and native launch details
- Wallet data screen and safe signing-adapter boundary
- Checkout context, claims, activity and transaction receipts
- Swift iOS entrypoint and Android Kotlin entrypoints
- EAS configuration and native environment template
- Official PowerChain/PWRC artwork and generated app assets

Mobile wallet signing remains intentionally fail-closed until a reviewed native Solana wallet adapter is selected and integrated. This prevents a placeholder or unsafe signing implementation from weakening the Launchpad transaction model.


## Validation notes

The existing repository regression suite is extended with native-mobile tests. Native iOS/Android project metadata is generated from `app.config.ts`; after dependency installation run `pnpm mobile:prebuild` to refresh native projects before Xcode/Gradle release builds.

The artifact runtime could not refresh `pnpm-lock.yaml` because DNS access to `registry.npmjs.org` is unavailable. CI already uses `pnpm install --no-frozen-lockfile`, so the first connected install will resolve and write the Expo SDK 57 mobile dependency graph. Commit that regenerated lockfile before a production release.
