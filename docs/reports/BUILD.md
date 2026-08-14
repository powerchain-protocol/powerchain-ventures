# PowerChain Launchpad 1.0.0 — Mobile Onboarding & Auth Build Report

## Implemented

- Four-screen mobile onboarding and first-run routing.
- PowerChain light-theme account UI with white/light-gray surfaces, black type and dark-green actions.
- Email/password sign-in and sign-up via Supabase Auth backend broker.
- Email confirmation callback supporting token-hash and implicit token return paths.
- Password recovery and authenticated password update.
- HttpOnly/SameSite session cookies with refresh-token rotation.
- Auth context, account menu and account/profile screen.
- Creator route gating for `/dashboard`, `/create` and `/account`.
- Public sales remain public and wallet connection remains non-custodial.
- RLS-protected `launchpad_profiles` metadata table (migration 027).
- OpenAPI Auth endpoints and `docs/AUTH-ONBOARDING.md`.
- Supabase publishable-key support with legacy anon-key fallback.

## Validation

- Regression tests: 79/79 PASS.
- Repository guard: PASS.
- Environment contract: PASS (47 documented / 44 referenced variables).
- OpenAPI generated copies: synchronized.
- Relative TypeScript import graph: PASS.
- TS/TSX syntax transpilation: 211/211 implementation files PASS.
- Version: 1.0.0.
- Branding: PowerChain-only.

## External deployment gate

A complete dependency-backed `pnpm install && pnpm typecheck && pnpm build` must still run in the deployment/local checkout with the workspace dependency graph installed. Configure Supabase Auth redirect URLs before enabling production sign-up/recovery email flows.


## Native mobile application

- Added `apps/mobile` using Expo SDK 57 / React Native 0.86.2 / React 19.2.
- Added native Swift iOS and Kotlin Android shells, EAS config and generated app icon asset sets.
- Added onboarding, auth/PKCE recovery, tabs, launch catalog/detail, wallet data, checkout, claims, activity, account/theme and creator companion flows.
- Added SecureStore-backed Supabase Auth sessions and backend Bearer-token support for native clients.
- Native Solana signing remains fail-closed until a reviewed platform signing adapter is configured.
- Lockfile refresh was not executed in this runtime because npm registry DNS is unavailable.

## Native mobile polish validation

- `node scripts/check-mobile-native.mjs`: PASS
- iOS AppIcon set: 18 icons, PASS
- iOS `Info.plist`: PASS
- Android `AndroidManifest.xml`: PASS
- Mobile environment contract: PASS
- Repository regression tests: 85/85 PASS
- OpenAPI synchronization: PASS

Expo dependency installation / Xcode / Gradle/EAS compilation remains a machine-specific release gate and should be run after installing the workspace dependencies.

## Expo SDK 57 native tooling validation

- Obsolete `newArchEnabled`: removed
- Android `powerchain://` scheme: present
- iOS `powerchain://` scheme: present
- Expo TypeScript base contract: retained
- Native artifact validator: PASS
- Regression suite: 92/92 PASS
- Dependency-backed Expo CLI/typecheck requires a connected local `pnpm install` after adding `expo-dev-client`.

## Mobile TypeScript / shared UI hardening

- Explicit `jsx: react-jsx` and `moduleResolution: Bundler` in `apps/mobile/tsconfig.json`.
- Preserves `expo/tsconfig.base` while avoiding inherited-JSX editor failures.
- Added `src/shared/ui/` canonical native primitives with `@/components/ui` compatibility exports.
- Added centralized mobile `src/constants/` and `src/config/` barrels.
- Added explicit mobile `@types/node` for `app.config.ts`/tooling types.
- Added VS Code workspace TypeScript/editor exclusions for native generated folders.

## Monorepo stabilization pass

- Workspace contract doctor: PASS (9 workspace projects)
- Root environment contract: PASS (mobile-only Expo keys isolated)
- Mobile environment contract: PASS
- pnpm strict dependency-build policy: PASS
- Vercel configuration: PASS
- OpenAPI generated-copy drift check: PASS
- Native mobile artifacts: PASS (18 iOS app icons)
- Repository structural validation: PASS
- Regression tests: 98/98 PASS
- Shared TypeScript source checks available in this runtime passed for config/domain/solana/utils/integrations. Program-client/app dependency-backed checks require installed workspace node_modules.

The dependency-backed `pnpm typecheck` / `pnpm build` remain local/CI gates because this artifact runtime does not contain the installed Expo/Next/Node type dependency graph.

## Expo / React Native dependency-resolution stabilization

- Mobile TypeScript is self-contained for JSX, Bundler module resolution, React Native conditions, and `@/* -> src/*` aliases, preventing VS Code from falling back to a non-JSX inferred project when Expo is not yet linked.
- `expo`, `expo-router`, `expo-constants`, `react`, and `react-native` are direct dependencies of `@powerchain/launchpad-mobile`.
- Metro uses the Expo SDK 52+ automatic monorepo resolver instead of legacy `watchFolders` / `nodeModulesPaths` overrides.
- Added `mobile:bootstrap`, `mobile:check:install`, and `mobile:clean`.
- Added `docs/MOBILE-INSTALL-TROUBLESHOOTING.md`.
- Full regression suite: **101/101 passing**.


## Frontend module-resolution stabilization

Fixed the Next.js 16/Turbopack module-not-found failures for PowerChain workspace packages and ConnectorKit.

- `@solana/connector` pinned to `0.2.6`.
- PowerChain private package runtime exports now target compiled `dist/*.js`; type exports target `dist/*.d.ts`.
- Frontend `predev` and `prebuild` compile shared packages before Next.js starts.
- Frontend/backend Next configs set `turbopack.root` to the monorepo root.
- pnpm workspace linking is explicit (`linkWorkspacePackages`, `preferWorkspacePackages`, shared lockfile).
- Added `pnpm doctor:frontend` and `pnpm repair:workspace`.
- Added regression coverage for ConnectorKit subpaths, dist exports, and Turbopack root.

Validation: 104/104 regression tests passed; repository, environment, Vercel, OpenAPI, pnpm policy and native-mobile checks passed; 258 TS/TSX implementation files passed syntax transpilation.
