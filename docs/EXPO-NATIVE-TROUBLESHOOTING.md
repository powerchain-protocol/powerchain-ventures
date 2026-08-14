# Expo / Native troubleshooting

## SDK 57 New Architecture

Expo SDK 55+ always uses React Native New Architecture. Do not set `newArchEnabled` in `app.config.ts` and do not rely on toggling it in native properties.

## `expo/tsconfig.base` not found

Run installs from the repository root, then verify the mobile package boundary:

```bash
corepack enable
pnpm install
pnpm mobile:doctor
pnpm mobile:typecheck
```

The mobile `tsconfig.json` intentionally extends `expo/tsconfig.base`. The doctor verifies the installed Expo package actually contains this base config.

## Android/iOS URI scheme

The canonical scheme is `powerchain`. It is configured in `app.config.ts`, AndroidManifest.xml and Info.plist. `expo start --dev-client` is also launched with `--scheme powerchain`.

After changing native linking config, regenerate the development build:

```bash
pnpm --filter @powerchain/launchpad-mobile prebuild:clean
pnpm mobile:ios
# or
pnpm mobile:android
```

## `xcrun simctl` fails on macOS

Verify that full Xcode, not only Command Line Tools, is selected:

```bash
xcode-select -p
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
xcrun simctl help
pnpm mobile:doctor:ios
```

If Xcode is installed somewhere else, use that Xcode application's `Contents/Developer` path instead.
