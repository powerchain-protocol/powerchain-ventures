# VS Code Debugging

PowerChain Launchpad has three runnable applications:

- `apps/frontend` — Next.js web UI on port 3000
- `apps/backend` — Next.js API/backend on port 3001
- `apps/mobile` — Expo / React Native application for iOS and Android

## Recommended launch profiles

Open **Run and Debug** in VS Code and choose one of the PowerChain compound profiles:

- **PowerChain: Web Full Stack** — backend + frontend + Chrome
- **PowerChain: Mobile + Backend** — backend + Expo development client
- **PowerChain: iOS + Backend** — backend + iOS Simulator
- **PowerChain: Android + Backend** — backend + Android Emulator

Individual profiles are also provided for frontend, backend, Chrome, Expo, iOS, Android, Docker backend, typecheck, and build.

## Terminal equivalents

```bash
pnpm dev:web
pnpm dev:all-apps
pnpm dev:frontend
pnpm dev:backend
pnpm dev:mobile
pnpm mobile:ios
pnpm mobile:android
```

`dev:all-apps` is convenient for quick smoke testing, but Expo is interactive; the VS Code compound **Mobile + Backend** profile is preferable during native development.

## Chrome attach

The attach profile expects Chrome to be started with remote debugging enabled on port `9222`. Normal web development should use **PowerChain: Web Full Stack** instead.

## Docker backend

The Docker debugger requires the VS Code Docker extension and the backend Dockerfile. The normal local backend launch profile is preferable when debugging TypeScript source directly.

## Telemetry

Next.js and Expo scripts keep telemetry disabled through `NEXT_TELEMETRY_DISABLED=1` and `EXPO_NO_TELEMETRY=1`.
