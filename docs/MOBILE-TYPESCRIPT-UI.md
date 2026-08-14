# Mobile TypeScript & Shared UI

PowerChain mobile uses Expo SDK 57 with an explicit JSX compiler setting so VS Code, `tsc`, Expo Router, and Metro agree on TSX handling.

## TypeScript

`apps/mobile/tsconfig.json` carries the required Expo/React Native compiler options explicitly so editor JSX behavior does not depend on package-base resolution. It sets:

- `jsx: react-jsx`
- `moduleResolution: Bundler`
- `noEmit: true`
- strict/no-unchecked/exact-optional checks
- `@/* -> ./src/*`

If VS Code still shows `--jsx is not set`, run **TypeScript: Restart TS Server** and ensure **Use Workspace Version** is selected.

## Shared UI

Canonical native UI primitives live under:

`apps/mobile/src/shared/ui/`

Use:

```ts
import { Button, Card, Field, Notice } from "@/shared/ui";
```

`@/components/ui` remains as a compatibility re-export.

## Configuration

Mobile-safe runtime config lives in `src/config/`. Product constants live in `src/constants/`. Do not add server secrets to Expo public environment variables.
