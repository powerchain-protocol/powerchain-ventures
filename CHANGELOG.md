# Changelog

- Fixed pnpm Node-runtime bootstrap: removed `devEngines.runtime`, which caused pnpm 11.21.0 to install the `node` npm package and fail under `strictDepBuilds`; Node 24 is now enforced with `engines`, `.nvmrc`, `.node-version`, and the dev preflight.
- Hardened Next startup by passing `apps/frontend` / `apps/backend` explicitly to the Next CLI from a monorepo-root wrapper, and removed the unnecessary custom `turbopack.root` override.

- Hardened local Next.js startup: frontend/backend configs now load canonical monorepo-root `.env*` files through `@next/env`, derive the root from the config file path rather than `process.cwd()`, preflight Node 24 and ports 3000/3001, and provide direct Next/cache diagnostic commands.

### Runtime toolchain

- Standardized the monorepo on Node.js 24.x (`>=24 <25`).
- Updated Corepack/package-manager pinning to pnpm 11.21.0.
- Updated Docker images from Node 22 Alpine to Node 24 Alpine.
- Updated `@types/node` to the Node 24 type line.
- Added `.nvmrc` and `.node-version` with Node 24.


## 1.0.0 — Mobile Expo dependency-resolution hardening

- Pin mobile `react-native-screens` to exactly `4.26.0` for Expo SDK 57 / React Native 0.86 navigation compatibility.

- Fixed Expo/React Native editor cascades when the mobile workspace is not yet linked.
- Made the mobile TypeScript config self-contained for JSX, Bundler resolution, React Native conditions, and `@/*` aliases.
- Added explicit `expo-constants` dependency for the Expo Router SDK 57 stack.
- Removed obsolete manual Metro monorepo resolver overrides; Expo SDK 52+ handles pnpm workspaces automatically.
- Added `mobile:bootstrap`, `mobile:check:install`, and `mobile:clean` workflows with actionable diagnostics.
- Added mobile install troubleshooting documentation.


All notable changes to PowerChain Launchpad™ are documented here. The release/package version remains **1.0.0**.

## 1.0.0

### Checkout UI/UX redesign

- Added modular `checkout.tsx`, `payment-form.tsx`, `payment-methods.tsx`, `credit-card.tsx`, and `onramp.tsx` components.
- Reworked checkout into a light-first PowerChain enterprise payment shell using white/light-gray surfaces, black typography, dark-green actions/icons, and framed white secondary actions.
- Kept the Solana wallet flow as the fully wired production purchase method. Card/onramp options remain fail-closed until a real PCI/tokenization/onramp provider is configured.
- Improved responsive behavior for tablet and mobile checkout layouts.


### PWRC wallet, transfers and checkout UX

- Integrated the supplied PWRC coin artwork under `apps/frontend/public/assets/pwrc/` and generated favicon, Apple touch, 192px and 512px PWA icons from the official transparent PNG.
- Added reusable `components/pwrc-coin.tsx` and applied it to sale cards, sale details, wallet balances and checkout surfaces.
- Added `/wallet` Wallet Center with live confirmed SOL/PWRC balances, Token-2022 account data, Birdeye PWRC↔SOL market estimates and reviewed wallet-to-wallet transfers.
- Added non-custodial SOL transfer preparation and Token-2022 `transferChecked` PWRC transfers with recipient ATA creation when required, exact transaction review, wallet signing, exact-message confirmation and on-chain delivery verification.
- Wallet-to-wallet transfers charge **0% PowerChain service fee**; Solana network fees and required token-account rent remain explicit.
- Added `/checkout/[saleId]` and enhanced checkout bootstrap with SOL market estimates while preserving server-owned sale quotes and exact reviewed SOL settlement as authoritative.
- Checkout now rejects stale sale windows and fee-policy drift before returning a checkout session.
- Added wallet transfer receipts/history and retry support to the Transaction Center.
- Added migration `025_wallet_transfers_checkout_assets.sql` and synchronized the consolidated Supabase schema.
- Reorganized the canonical OpenAPI document with Wallets, Checkout and Transactions sections plus wallet/transfer endpoints.

### Launchpad program, operations and mobile UX

- Added `programs/launchpad`, a native Rust Solana program with sale/participant PDAs, Token-2022 vault authority, purchases, claims, pause/resume, timing updates, cancellation and completion.
- Added `@powerchain/launchpad-program-client` with instruction codecs, PDA derivation, operation builders, review labels and on-chain state decoding.
- Added a required `POWERCHAIN_QUOTE_AUTHORITY_WALLET` signer for purchase instructions so off-chain USD quotes cannot be bypassed with direct self-priced program calls.
- Separated `delivery_on_claim` from `vesting_enabled`, supporting immediate delivery, claim-later without vesting and cliff/linear vesting.
- Added backend program status/operation prepare/confirm handlers with exact transaction-message, program instruction, PDA and on-chain state verification.
- Added migration `024_launchpad_program_operations.sql` and Prisma/Supabase program-operation evidence fields/table.
- Added reviewed creator pause/resume actions, program-state badges, labeled program accounts in transaction review and mobile bottom navigation/touch-target improvements.
- Kept the real deployed program ID and quote-authority private key out of source; production remains fail-closed until verified deployment configuration is supplied.

### Integrations and data layer

- Added canonical PowerChain purchase-fee wallet `FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy` to `packages/config/src/constants.ts` and enforced it in runtime config, transaction preparation and settlement verification.
- Added explicit fail-closed `POWERCHAIN_PWRC_MINT_ADDRESS` and `POWERCHAIN_LAUNCHPAD_PROGRAM_ID` constants. They remain `null` until real deployed mainnet addresses are supplied.
- Added `@powerchain/integrations` for bounded server-only Helius RPC/DAS and Birdeye price/token-overview requests.
- Added Helius to the Solana RPC failover pool and mainnet redundancy checks without exposing `HELIUS_API_KEY` to clients or logs.
- Added validated mint market/PWRC integration APIs and a responsive `/integration` UI.
- Added market-observation persistence through migration `023_integrations_fee_market_data.sql` with RLS and service-role-only writes.
- Added Prisma ORM **7.9.1** CLI/client/pg-adapter configuration as a typed companion to the authoritative Supabase/PostgreSQL SQL migrations.
- Reorganized the canonical OpenAPI 3.1 specification under `apps/backend/openapi/`, added `/api/v1/openapi`, generated Swagger/OpenAPI compatibility copies, and sync/check scripts.

### Existing production platform

- Production Solana Token-2022 sale, purchase, claim, vesting, transaction-review and settlement flows.
- Exact 2.5% PowerChain purchase fee and zero PowerChain service fee for claims/lifecycle actions.
- Mainnet network identity binding, dedicated RPC redundancy, exact transaction-message binding and payment/token-delivery verification.
- Creator Console, Claims, Transactions, Analytics, checkout, wallet modal and responsive UI states.
- Supabase RLS/security migrations, distributed rate limiting, reconciliation leases, Vercel/Docker configuration, Corepack/pnpm 11 policy and TypeScript workspace hardening.

### Checkout completion and mobile UX
- Added a verified PowerChain checkout completion/receipt screen after confirmed settlement.
- Added Solana Explorer and Transaction Center actions to completed purchases.
- Added explicit payment-method readiness states for Wallet, Card, and Onramp.
- Improved checkout mobile sticky header, horizontal method scrolling, responsive receipt timeline, and one-column completion actions.

### Coinbase-hosted Onramp
- Added server-created Coinbase Onramp v2 sessions for SOL funding to the connected Solana wallet.
- Added sanitized Onramp transaction-status lookup and minimal Supabase/Prisma audit state.
- Added checkout return page, provider readiness, funding presets, fee/status display, and explicit Headless Onramp guidance for Apple Pay/Google Pay guest flows.

### pnpm 11 / Prisma install policy fix

- Explicitly allow reviewed Prisma 7.9.1 install/build dependencies `prisma` and `@prisma/engines` in `pnpm-workspace.yaml`.
- Keep `strictDepBuilds: true`; do not globally enable dependency build scripts.
- Add `pnpm doctor:pnpm` to verify the committed build-script trust policy.
- `pnpm setup` now runs `prisma generate` explicitly after installation.

### Mobile onboarding & account authentication
- Added mobile-first four-step onboarding, sign-in, sign-up, password recovery/update and account screens.
- Added backend Supabase Auth session broker with HttpOnly cookie rotation and token-hash confirmation support.
- Added account-gated creator routes while keeping wallet custody and transaction authorization separate.
- Added migration 027 for non-secret account profile metadata and OpenAPI Auth endpoints.

- Added Expo SDK 57 / React Native 0.86 native mobile app with onboarding, auth, launch discovery, wallet data, checkout, claims, activity, iOS Swift and Android native shells.
- Added SecureStore-backed Supabase Auth sessions and backend bearer-token support for native clients.
- Added generated PowerChain app, adaptive and splash visual assets plus mobile environment documentation.

### Native mobile polish
- Added complete checked-in iOS `Assets.xcassets/AppIcon.appiconset` generated from official PowerChain artwork.
- Added native mobile source/screen/flow survey and navigation map.
- Added centralized mobile public environment contract and explicit mobile feature flags.
- Added native mobile artifact validation script.

## Mobile device UX improvements

- Added keyboard-aware native page layout and interactive keyboard dismissal.
- Added pull-to-refresh support for launches, wallet data, and activity.
- Added haptic feedback and stronger accessibility state to shared mobile buttons.
- Added reusable Notice, EmptyState, SectionHeader, and labeled Field primitives.
- Improved first-run onboarding with explicit progress, Back/Skip behavior, and clearer non-custodial copy.
- Improved safe-area-aware bottom tabs with active visual glyphs and keyboard hiding.
- Improved Home quick actions, wallet loading/error states, and transaction activity cards.
- Added bounded mobile API timeouts and one safe retry for GET requests only; mutations are never automatically replayed.
- Added EXPO_PUBLIC_API_TIMEOUT_MS to the mobile-safe environment contract.

### VS Code all-app debugging

- Added `.vscode/launch.json` profiles for frontend, backend, Chrome, Expo, iOS, Android, Docker, typecheck, and build.
- Added full-stack Web, Mobile, iOS, and Android compound profiles.
- Added `.vscode/tasks.json` for dependency, development, native, validation, and Docker tasks.
- Added `dev:web` and `dev:all-apps` root scripts.
- Added `docs/VS-CODE-DEBUG.md`.

### Expo SDK 57 native tooling fixes
- Removed obsolete `newArchEnabled` Expo config; SDK 57 always uses New Architecture.
- Added `expo-dev-client` and explicit `powerchain` development/deep-link scheme handling.
- Added Android custom-scheme intent filter and preserved iOS URL scheme.
- Added mobile Expo/TypeScript/Xcode toolchain doctor.
- Added Expo native troubleshooting documentation and VS Code iOS-host check.

## Mobile TypeScript / shared UI hardening

- Explicit `jsx: react-jsx` and `moduleResolution: Bundler` in `apps/mobile/tsconfig.json`.
- Preserves `expo/tsconfig.base` while avoiding inherited-JSX editor failures.
- Added `src/shared/ui/` canonical native primitives with `@/components/ui` compatibility exports.
- Added centralized mobile `src/constants/` and `src/config/` barrels.
- Added explicit mobile `@types/node` for `app.config.ts`/tooling types.
- Added VS Code workspace TypeScript/editor exclusions for native generated folders.

### Monorepo stabilization
- Added a workspace contract doctor for package names, exports, versions, workspace links, and undeclared internal imports.
- Split deterministic package/app typecheck stages and ensure Prisma Client generation precedes production Next builds.
- Extended the type dependency doctor to Expo/React Native and PowerChain mobile workspace packages.
- Normalized shared TypeScript package build configs with declarations and consistent root/out directories.
- Corrected root environment validation so mobile-only Expo variables are validated only against `apps/mobile/.env.example`.

### Frontend module-resolution hardening
- Pinned ConnectorKit to `@solana/connector@0.2.6` and validated the official `react` and `headless` subpath exports.
- Added explicit Next.js Turbopack monorepo roots for frontend/backend.
- Added TypeScript source aliases for PowerChain workspace packages so local source remains resolvable even before package `dist/` output is generated.
- Enabled deterministic pnpm workspace linking and added `pnpm doctor:frontend` / `pnpm repair:workspace`.

### Repository documentation and test organization

- Restricted root Markdown to `README.md`, `CHANGELOG.md`, and `CONTRIBUTORS.md`.
- Moved implementation/build/UI/mobile/module-resolution reports to `docs/reports/` and validation snapshots to `docs/reports/validation/`.
- Added `docs/README.md`, app/package READMEs, and dedicated Launchpad-program documentation.
- Added focused `@powerchain/utils` Node tests and Rust Launchpad instruction/protocol regression tests.
- Updated repository validation to enforce the organized documentation layout.

### Mobile toolchain/typecheck stabilization

- Fixed Expo Doctor invocation under pnpm 11 by using an explicit local `expo-doctor` binary.
- Fixed `exactOptionalPropertyTypes` errors in pull-to-refresh and Field error props.
- Fixed Expo/React Native Web Pressable style-state typing by forwarding the complete callback state.
- Aligned Expo dependency range with the installed SDK 57.0.12 patch.
- Narrowly allowlisted only the legacy transitive `uuid@7.0.3` and `uuid@8.3.2` deprecation warnings without overriding them.

- Fixed the Next.js 16/Turbopack frontend runtime crash where `getPublicRuntimeConfig` could resolve to an undefined workspace export; client runtime config is now locally parsed, immutable, and browser-only.
- Added explicit `@powerchain/launchpad-config/constants`, `/public`, `/server`, and `/runtime` exports and upgraded frontend resolution/validation guards.
- Added clean-checkout environment templates and made source validation understand generated package `dist` imports before build output exists.

## Development environment startup hardening

- Added committed non-secret `.env.development` defaults for local frontend/backend development.
- Frontend public runtime parsing now defaults to `http://localhost:3000`, Solana `devnet`, and the public Solana devnet RPC only outside production.
- Production remains fail-closed and still requires explicit public runtime environment values.
- Frontend `next.config.ts` injects the same public development defaults after loading root `.env*`, preventing undefined `NEXT_PUBLIC_*` values during Turbopack compilation.
