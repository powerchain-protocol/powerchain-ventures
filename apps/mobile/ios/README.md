# iOS native project

The canonical native configuration is `app.config.ts`. This directory contains the PowerChain Swift entrypoint and native identifiers expected after Expo prebuild.

Regenerate Xcode project metadata after dependency/config changes:

```bash
pnpm --filter @powerchain/launchpad-mobile prebuild:clean
pnpm --filter @powerchain/launchpad-mobile ios
```

Do not store wallet private keys, quote-authority keys, Supabase service-role keys, Helius keys, Birdeye keys or CDP secrets in the iOS project.

## App icons

The checked-in `PowerChainLaunchpad/Assets.xcassets/AppIcon.appiconset` contains iPhone, iPad and App Store icon sizes generated from the official supplied PowerChain green logo on an opaque light background. `app.config.ts` remains canonical for Expo prebuilds.
