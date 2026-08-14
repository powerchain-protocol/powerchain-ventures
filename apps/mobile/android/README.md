# Android native project

The canonical native configuration is `app.config.ts`. Regenerate Gradle project metadata after config/dependency changes with Expo prebuild.

For native Solana signing, integrate only a reviewed wallet adapter and preserve the backend's exact-transaction review/verification pipeline. No private keys belong in this repository.

## Launcher assets

Launcher/adaptive icon resources are checked into `app/src/main/res/mipmap-*` and are generated from the official PowerChain artwork. Expo `app.config.ts` remains canonical for future prebuild regeneration.
