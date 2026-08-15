
- Simplified the header wallet control to a wallet icon plus `Connect Wallet`/`Wallet`; compact screens show only the wallet icon.
- Added explicit `shortAddress` frontend export to prevent Turbopack static-export failures.
- Replaced the raw frontend API rewrite with a catchable same-origin API route proxy that returns structured 503 responses when the backend is offline.
- Added Docs, Eligibility, Vesting, Settings, Security and Legal pages.
- Made onboarding mobile-only and restored the desktop root landing page as public.
# Changelog

## Environment ownership and Next config fix — 2026-08-14

- Added `.env.example` and non-secret `.env.local` files at the repository root and for frontend, backend, and mobile apps.
- Removed `@next/env` imports and dependencies from frontend/backend; Next.js now loads each app's environment files natively from that app root.
- Added `validate:app-envs` to verify required env files and prevent server-secret keys from entering the frontend env template.
- Updated root and app READMEs with environment ownership, copy commands, local ports, and security boundaries.


- Fixed pnpm Node-runtime bootstrap: removed `devEngines.runtime`, which caused pnpm 11.21.0 to install the `node` npm package and fail under `strictDepBuilds`; Node 24 is now enforced with `engines`, `.nvmrc`, `.node-version`, and the dev preflight.
- Hardened Next startup by passing `apps/frontend` / `apps/backend` explicitly to the Next CLI from a monorepo-root wrapper, and removed the unnecessary custom `turbopack.root` override.

- Earlier startup hardening introduced monorepo-root `@next/env` loading; this is superseded by the 2026-08-14 app-local environment ownership fix above, which removes the extra dependency while preserving Node/port preflight and direct Next/cache diagnostics.

### Runtime toolchain

- Standardized the monorepo on Node.js 24.x (`>=24 <25`).
- Updated Corepack/package-manager pinning to pnpm 11.21.0.
- Updated Docker images from Node 22 Alpine to Node 24 Alpine.
- Updated `@types/node` to the Node 24 type line.
- Added `.nvmrc` and `.node-version` with Node 24.


## 1.0.0

### Monorepo, program and local-builder hardening

- Enforced app/package workspace boundaries and continued removal of any `payload/` application layer.
- Added program/client/IDL parity validation and expanded the deployment-neutral program IDL.
- Hardened Token-2022 vault/destination ownership and stored fee/token-program identities on-chain.
- Added Rust invariant tests and overflow-checked optimized release profile.
- Added atomic PostgreSQL settlement + outbox registration.
- Added read-only runtime health probes and manual-review operator actions.
- Migrated claims and creator program/lifecycle transaction preparation to local reviewed/simulated builders.
- Added local creator-controlled sale activation; external builder configuration is now optional and scoped to delegated vault activation.
- Rejected vesting configurations where the cliff exceeds the vesting duration.


### Durable runtime persistence and reconciled purchase completion

- Added production-fail-closed runtime persistence mode and Prisma 7 PostgreSQL adapter bootstrap.
- Added runtime schema preflight for settlement/outbox migrations and migration 035 outbox diagnostics.
- Added outbox lease recovery, error diagnostics and backlog statistics.
- Added a minutely protected settlement reconciliation worker endpoint.
- Purchase confirmation now creates and returns a durable settlement ID.
- Checkout now treats a purchase as successful only after Solana finalization reaches `reconciled`.
- Pending signed purchase recovery never automatically resubmits a financial transaction.
- Readiness now includes runtime persistence and settlement-outbox operational health.


### Dedicated Checkout, real SOL purchase and market pricing

- Moved token-purchase/payment ownership into the standalone `apps/checkout` Next.js app on local port 3002.
- Removed duplicate checkout routes/components and purchase forms from `apps/frontend`.
- Added `@powerchain/ui` for shared web primitives used by Launchpad and Checkout.
- Added a shared resilient backend proxy used by both web applications.
- Added Pyth, Birdeye and CoinMarketCap server-side pricing modules plus rate/amount conversion helpers.
- Added bounded price freshness, provider divergence checks and a short server-side price cache.
- Added `/api/v1/market/prices` and `/api/v1/market/rates`.
- Replaced the remote-builder requirement for purchases with an in-process Solana Launchpad purchase transaction builder.
- Purchase preparation now derives the buyer Token-2022 ATA, calculates exact SOL principal plus the canonical 250 bps fee, builds the Launchpad instruction, partially signs with the quote authority and simulates before buyer review.
- Purchase preparation now requires caller idempotency and signed-purchase recovery never automatically resubmits a financial transaction.
- Purchase confirmation binds the first submitted signature and allows that same submitted transaction to finish confirmation after review expiry.
- Moved Coinbase Onramp return handling into `apps/checkout`; Onramp remains wallet funding rather than purchase settlement.
- Added a monorepo-layout doctor that rejects root `payload/`, `apps/payload/`, and duplicated frontend checkout ownership.
- Updated root/app/program READMEs, environment examples, routing inventory, OpenAPI, Docker/Compose and Vercel configuration for the dedicated Checkout application.


### Account security and wallet capability hardening

- Added centralized account/wallet session resolution and route guards.
- Added linked-wallet listing and unlink controls for authenticated accounts.
- Added account security page and linked-wallet management UI.
- Added explicit Solana/Sui network capability matrix.
- Added reusable loading, empty and error state primitives.
- Added send/receive wallet action components for SOL, PWRC and USDC while preserving the existing reviewed transaction path.
- Added dependency doctor for Better Auth, Web3 Icons and Mysten packages.


### RC.1 top bar and cluster UI

- Added configurable RC.1 release top bar with environment-level enable/disable control.
- Added reusable information and alarm UI primitives.
- Added typed Solana/Sui network configuration.
- Added reusable cluster icon, badge, card and selector components.


### Better Auth, wallet identity and asset integrations

- Added Better Auth 1.6.x web authentication with PostgreSQL persistence.
- Added configuration-driven Google, GitHub, Discord and Apple social login.
- Added same-origin `/api/auth` routing for OAuth cookies and callbacks.
- Added cryptographically signed Solana wallet login with nonce, deployment and expiry binding.
- Added linked wallet identities and wallet-auth sessions.
- Added account types and `use-users.ts`.
- Added wallet provider context and embedded-wallet adapter contract.
- Added `@web3icons/react` token/network/wallet icons.
- Added canonical PWRC/SOL/USDC/SUI asset registry.
- Added shared chart types, lightweight SVG chart, invoice component and receive-PWRC flow.
- Added SOL/USDC payment asset integrations; SUI settlement remains fail-closed until its adapter is configured.


### API transport, WebSockets and UI primitives

- Added a centralized `/api/v1` endpoint registry.
- Added API transport, endpoint-discovery and Solana WebSocket status routes.
- Added safe frontend-to-backend origin fallbacks.
- Mutation backend failover now requires an idempotency key.
- Added resilient Solana WebSocket endpoint rotation, reconnect/backoff and resubscription.
- Added optional browser-safe realtime WebSockets with HTTP polling fallback.
- Added reusable `forms.tsx`, `dropdown.tsx`, `badge.tsx` and `select.tsx`.
- Added shared deterministic `formats.ts`.
- Added shared `payments.ts` fee/payment contracts.
- Refactored navigation, network status, contact, auth and checkout to shared primitives.


### Frontend architecture, checkout, auth and mail

- Added reusable button, card, tabs and form-field primitives.
- Added typed frontend services, actions, hooks and UI/checkout contexts.
- Refactored authentication API access into a dedicated service layer.
- Improved sign-in UX and responsive form controls.
- Refactored checkout payment selection to reusable accessible tabs.
- Added responsive checkout layout improvements.
- Added a full-stack Contact route with rate limiting and honeypot protection.
- Added `@powerchain/mail` with reusable React email templates and deterministic rendering.
- Added backend-only Resend-compatible mail delivery configuration.
- Added Next.js image optimization, package import optimization and Turbopack filesystem caching.


### Mainnet/RPC environment configuration

- Added mainnet-beta-first local and production environment profiles.
- Added Helius RPC/API server-only configuration.
- Added custom RPC primary/fallback configuration.
- Added provider selection with `auto`, `helius`, `custom`, and `solana`.
- Added browser-safe backend Solana JSON-RPC proxy.
- Centralized CORS origin parsing and exposed-header policy.
- Added `/env/` profiles plus local and production app environment examples.



### Runtime resolution fixes

- Removed Next/Turbopack aliases that mapped executable workspace imports to `.d.ts` files.
- Fixed `fetchJsonWithPolicy` becoming undefined at runtime.
- Fixed `safePost` to use the supported two-argument HTTP policy API.
- Updated backend OpenAPI output-file tracing to the canonical backend API contract.
- Made Prisma client generation load safely without a configured production database URL.
- Updated the type dependency doctor to verify pnpm workspace links before package build output exists.
- Added runtime module-resolution regression checks.

 — Mobile Expo dependency-resolution hardening

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
- Reorganized the canonical OpenAPI 3.1 specification under `apps/backend/api/openapi/`, added `/api/v1/openapi`, generated Swagger/OpenAPI compatibility copies, and sync/check scripts.

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
