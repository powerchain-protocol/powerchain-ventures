# @powerchain/launchpad-mobile

Expo / React Native companion for PowerChain Launchpad™ `1.0.0`.

## Branding

The native app uses the same PowerChain application mark as the web product.

```text
assets/logo-dark.png
assets/app-icon.png
assets/adaptive-icon.png
assets/splash-icon.png
assets/notification-icon.png
```

The `Brand` component switches the dark mark to a light runtime tint on dark surfaces rather than maintaining a second decorative logo source.

PWRC token artwork remains separate in `assets/pwrc.png`.

## Theme

The app supports light, dark and system theme preferences. Expo is configured with automatic system appearance.

## Dependency policy

`react-native-screens` remains pinned exactly to `4.26.0`.

## Commands

```bash
pnpm dev:mobile
pnpm mobile:typecheck
pnpm mobile:doctor
```
