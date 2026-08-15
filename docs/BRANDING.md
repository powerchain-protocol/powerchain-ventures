# PowerChain Branding

PowerChain application branding and PWRC token artwork are separate concerns.

## Canonical application mark

```text
apps/frontend/public/assets/brand/powerchain-mark-dark.png
```

This is the canonical raster source used by the application UI.

Do not create additional green/white/dark copies of the same application mark. Light-on-dark presentation is handled by the reusable logo component at runtime.

## Web component

```text
apps/frontend/components/logo.tsx
```

Exports:

```tsx
<PowerChainLogo />
<PowerChainLogo tone="light" />
<PowerChainLogo compact />
<PowerChainMark size={32} />
```

`tone="light"` is intended for dark surfaces and reuses the canonical mark.

## Web/PWA generated assets

```text
apps/frontend/public/assets/brand/favicon-32.png
apps/frontend/public/assets/brand/favicon-64.png
apps/frontend/public/assets/brand/apple-touch-icon.png
apps/frontend/public/assets/brand/app-icon-192.png
apps/frontend/public/assets/brand/app-icon-512.png
apps/frontend/app/favicon.ico
apps/frontend/app/icon.png
apps/frontend/app/apple-icon.png
```

## Mobile generated assets

```text
apps/mobile/assets/logo-dark.png
apps/mobile/assets/app-icon.png
apps/mobile/assets/app-icon-192.png
apps/mobile/assets/app-icon-512.png
apps/mobile/assets/adaptive-icon.png
apps/mobile/assets/splash-icon.png
apps/mobile/assets/notification-icon.png
```

The mobile `Brand` component uses the same dark mark and applies a runtime tint only when a light mark is needed on a dark surface.

## PWRC token artwork

PWRC token imagery stays under token-specific asset paths and must not be used as the application header logo unless explicitly intended as token artwork.

## Asset rules

- keep one canonical application mark
- preserve transparent padding around the mark
- do not bake text into app icons
- do not expose token/application branding as interchangeable assets
- keep mobile adaptive foreground artwork inside the safe area
- keep favicon artwork recognizable at 16–32 px
