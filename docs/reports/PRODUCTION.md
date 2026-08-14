# PowerChain Launchpad™ Production Report

**Version:** 1.0.0  
**Network target:** Solana mainnet-beta  
**Token standard:** SPL Token-2022

## PWRC wallet, checkout and transfer upgrade

The supplied PWRC coin artwork is now the canonical frontend token visual under `apps/frontend/public/assets/pwrc/`. It is reused by `components/pwrc-coin.tsx`, Wallet Center, sale catalog/detail, checkout, application favicon, Apple touch icon and PWA icons.

`/wallet` now loads confirmed native SOL and configured PWRC Token-2022 balances from Solana RPC, derives the wallet's PWRC associated token account, and optionally adds server-side Birdeye PWRC↔SOL market estimates. Market conversion data is informational; it never replaces the reviewed Solana transaction.

Wallet-to-wallet transfers are non-custodial. SOL uses a reviewed System Program transfer. PWRC uses Token-2022 `transferChecked`, derives source/destination token accounts, creates the recipient associated token account idempotently when required, checks the sender balance, simulates the unsigned transaction, displays every instruction/recipient/fee, and verifies the exact confirmed transaction and actual recipient delivery before the transfer receipt is marked settled. PowerChain charges **0% service fee** on these wallet transfers.

`/checkout/[saleId]` is now a focused purchase surface. The checkout bootstrap provides a Birdeye-derived estimated SOL conversion for the canonical USD sale amount, while the purchase pipeline continues to use server-owned quote/economics, exact 2.5% fee policy, mandatory transaction review, wallet signature, exact transaction-message binding, payment verification and token/entitlement settlement. Checkout also rejects stale start/end windows and fee-policy drift.

Migration `025_wallet_transfers_checkout_assets.sql` extends transaction-review policy for wallet transfers, and OpenAPI is reorganized around Wallets, Checkout, Launchpad and Transactions.

## Native Launchpad program and operation layer

The repository now contains a native Rust Solana program at `programs/launchpad` and a typed TypeScript client at `packages/program-client`. No program address is compiled into the source; `POWERCHAIN_LAUNCHPAD_PROGRAM_ID` remains a deployment-owned value.

The program manages deterministic sale, vault-authority and participant PDAs and implements initialize, vault-authority adoption, purchase, claim, pause/resume, timing update, cancel and complete operations. Purchases require both the buyer and `POWERCHAIN_QUOTE_AUTHORITY_WALLET` to sign. This preserves server-owned USD pricing/eligibility while still enforcing allocation, timing, nonce, fee routing and Token-2022 delivery on chain.

`delivery_on_claim` and `vesting_enabled` are independent. A sale can deliver immediately, make the full purchased entitlement claimable later, or apply cliff/linear vesting.

Migration `024_launchpad_program_operations.sql` persists sale/participant PDA binding, on-chain status, quote authority and program-operation confirmation evidence. Creator pause/resume is exposed through the same exact-review/sign/confirm pipeline as the other sensitive actions.

## Current integration upgrade

The purchase fee is now protocol configuration rather than a deployment placeholder. All purchase preparation and payment-settlement checks require the exact fee recipient:

`FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy`

The service-fee rate remains exactly **250 bps (2.5%)**. Claims and creator lifecycle transactions continue to charge **0% PowerChain service fee**; Solana network/rent costs remain separate.

### Helius

- Server-only `HELIUS_API_KEY`.
- `SOLANA_RPC_URL` remains the primary RPC; configured Helius can satisfy the second dedicated mainnet redundancy slot.
- Helius URLs are redacted before they are returned in health/audit evidence.
- DAS `getAsset` enriches validated Solana mints with token/metadata information.
- Helius is not a browser secret or a substitute for exact transaction/message/payment verification.

### Birdeye

- Server-only `BIRDEYE_API_KEY` with Solana chain headers.
- Price, liquidity and token-overview observations are available through safe fixed backend APIs.
- Provider-backed public routes are rate-limited.
- Market data is informational and is never settlement truth.

### Database

Migration `023_integrations_fee_market_data.sql` adds the canonical fee wallet/program binding fields and `launchpad_token_market_snapshots`. RLS is enabled; direct browser roles are revoked; server service-role access is retained.

SQL migrations remain authoritative. Prisma ORM 7.9.1 is included as a typed companion schema/tooling layer with PostgreSQL pg adapter dependencies and `prisma.config.ts`.

### API organization

The canonical API contract now lives at:

`apps/backend/openapi/powerchain-launchpad.openapi.yaml`

It is served at `/api/v1/openapi`. `pnpm openapi:sync` regenerates `apps/backend/openapi/swagger.yaml` and `openapi/openapi.yaml`; `pnpm openapi:check` detects drift.

## Mainnet deployment values intentionally not invented

A real PWRC mainnet mint and a real deployed PowerChain Launchpad program address were not supplied in this request. Therefore:

- `POWERCHAIN_PWRC_MINT_ADDRESS` remains `null`.
- `POWERCHAIN_LAUNCHPAD_PROGRAM_ID` remains `null`.
- production requires `POWERCHAIN_PRESALE_MINT` and `POWERCHAIN_LAUNCHPAD_PROGRAM_ID` through deployment configuration.

The app remains fail-closed until those real addresses, funded vault configuration, transaction builder, Supabase credentials and dedicated RPC credentials are supplied and verified.

## Validation

- Regression tests: **67/67 PASS**.
- Config/Domain/Solana/Utils/Integrations TypeScript packages: **PASS**.
- Program-client source syntax and repository import graph: **PASS**.
- TS/TSX source syntax: **172/172 PASS**.
- Repository/import/version/PowerChain-only guard: **PASS**.
- Environment contract and Vercel configuration: **PASS**.
- Generated OpenAPI/Swagger copies: **in sync**.
- Rust/SBF compile: **NOT RUN in this artifact runtime** because `cargo`, `rustc` and the Solana SBF CLI are not installed. `pnpm program:check`, `pnpm program:test` and `pnpm program:build` remain mandatory deployment gates.

A dependency-backed frontend/backend `pnpm typecheck && pnpm build` also needs to run in the consumer checkout with the installed workspace dependency graph and real production environment values.

## Checkout UI/UX update

The checkout now uses a PowerChain-branded light-first enterprise layout with dark-green primary actions, framed white secondary actions, modular payment method tabs, a non-sensitive card preview, secure onramp handoff state, and the existing reviewed Solana wallet purchase pipeline. Raw card number/CVV inputs are intentionally not hosted by PowerChain without a PCI/tokenization provider.

## Checkout completion improvement pass
- Added verified checkout success/receipt UI after confirmed/finalized settlement.
- Added Solana Explorer and Transaction Center actions for completed purchases.
- Added explicit Wallet/Card/Onramp readiness indicators; unconfigured providers remain fail-closed.
- Improved mobile checkout with sticky product header, snap-scrolling methods, responsive verification timeline, and one-column receipt actions.
- Regression suite: 72/72 passing.

## Coinbase-hosted Onramp
PowerChain can optionally fund the connected Solana wallet through Coinbase-hosted Onramp. The hosted session buys SOL; it does not bypass the PowerChain quote/review/sign/settlement flow and does not directly issue PWRC. CDP credentials remain backend-only and the single-use hosted URL is never persisted in the database.

## pnpm 11 + Prisma 7.9.1 install policy

PowerChain keeps pnpm 11 dependency-build protection enabled. The reviewed native/build dependencies are committed in `pnpm-workspace.yaml` under `allowBuilds`, including `prisma` and `@prisma/engines`. This prevents clean installs from failing with `ERR_PNPM_IGNORED_BUILDS` while avoiding the unsafe global `dangerouslyAllowAllBuilds` switch.

Prisma Client generation is explicit (`pnpm prisma:generate`) and is included in `pnpm setup`; it is not used to weaken install-time supply-chain controls.

## Account authentication
Mobile onboarding and Supabase Auth account sessions are implemented. Wallet signing remains a separate non-custodial authorization boundary. See `docs/AUTH-ONBOARDING.md`.


Native mobile: `apps/mobile` now contains the Expo/React Native iOS + Android companion, with a light-first PowerChain design, first-run onboarding, account auth, native navigation and generated app assets.

## Native mobile source + asset polish

- Verified `apps/mobile` as a first-class Expo/React Native workspace with checked-in `ios/` and `android/` native shells.
- Added complete iOS `Assets.xcassets/AppIcon.appiconset` (18 generated icon files) from official PowerChain artwork.
- Added native mobile surface classification, screen/flow survey, navigation map, external-service map, theme extraction and asset inventory.
- Added centralized public/mobile environment contract and mobile-native artifact validation.
- Validation: 85/85 tests, repository/env/Vercel/OpenAPI/native artifact checks pass.

## Native mobile UX resilience update

The PowerChain native client now uses keyboard-aware pages, pull-to-refresh on data surfaces, haptic actions, accessibility-aware buttons, clearer empty/error states, and safe-area-aware tabs. Network reads use a bounded timeout and may retry once only for safe GET requests after transient network/429/5xx failures. Mutation requests are not generically replayed.

Validation after this pass: 89/89 repository tests pass; native artifact, root/mobile environment, pnpm policy, Vercel and OpenAPI synchronization checks pass. Version remains 1.0.0.

## VS Code all-app debugging

The workspace now provides launch/debug coverage for all runnable applications: frontend, backend, and Expo/React Native mobile, including iOS and Android native launch commands. Compound profiles are available for Web Full Stack, Mobile + Backend, iOS + Backend, and Android + Backend. Docker backend debugging and typecheck/build launch profiles are included as well.

The `uuid@7.0.3` and `uuid@8.3.2` messages observed during Expo installation are transitive deprecation warnings. They are not treated as build failures or hidden through unsafe overrides; they should be resolved by upstream dependency updates when available.

## Expo SDK 57 native tooling fix

Resolved SDK 57 native development issues reported from macOS/VS Code:

- removed obsolete `newArchEnabled` from Expo app config and Android Gradle properties;
- added `expo-dev-client` and the canonical `powerchain` URI scheme;
- persisted the custom scheme in Expo config, AndroidManifest.xml, and Info.plist;
- Expo start/dev scripts now pass `--scheme powerchain`;
- added `scripts/check-mobile-toolchain.mjs` to verify Expo, `expo/tsconfig.base`, dev-client, native schemes, TypeScript, and optional Xcode/simctl host state;
- added `pnpm mobile:doctor:ios`, `pnpm mobile:config`, and native scheme test commands;
- added `docs/EXPO-NATIVE-TROUBLESHOOTING.md`;
- added regression coverage for Expo SDK 57 config and native deep linking.

The `xcrun simctl` failure is a local Xcode toolchain selection issue and is diagnosed by the new host doctor rather than hidden by project configuration.

## Mobile TypeScript / shared UI hardening

- Explicit `jsx: react-jsx` and `moduleResolution: Bundler` in `apps/mobile/tsconfig.json`.
- Preserves `expo/tsconfig.base` while avoiding inherited-JSX editor failures.
- Added `src/shared/ui/` canonical native primitives with `@/components/ui` compatibility exports.
- Added centralized mobile `src/constants/` and `src/config/` barrels.
- Added explicit mobile `@types/node` for `app.config.ts`/tooling types.
- Added VS Code workspace TypeScript/editor exclusions for native generated folders.

## Monorepo stabilization
The root toolchain now validates all app/package workspace contracts before release checks. Typechecking runs shared packages before the frontend, backend, and Expo mobile apps. Production builds generate Prisma Client before Next.js compilation. Mobile-only environment keys are isolated to the native environment contract rather than leaking into root/server validation.

### Final monorepo checks
The upgraded repository now has deterministic package/app typecheck stages, a workspace dependency/export doctor, Expo-aware type dependency diagnostics, Prisma-before-Next build ordering, and separate root/server versus native-mobile environment contracts. The regression suite passes 98/98.

## Expo / React Native dependency-resolution stabilization

- Mobile TypeScript is self-contained for JSX, Bundler module resolution, React Native conditions, and `@/* -> src/*` aliases, preventing VS Code from falling back to a non-JSX inferred project when Expo is not yet linked.
- `expo`, `expo-router`, `expo-constants`, `react`, and `react-native` are direct dependencies of `@powerchain/launchpad-mobile`.
- Metro uses the Expo SDK 52+ automatic monorepo resolver instead of legacy `watchFolders` / `nodeModulesPaths` overrides.
- Added `mobile:bootstrap`, `mobile:check:install`, and `mobile:clean`.
- Added `docs/MOBILE-INSTALL-TROUBLESHOOTING.md`.
- Full regression suite: **101/101 passing**.

