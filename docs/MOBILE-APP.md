# PowerChain Launchpad Mobile App

## Product classification

The repository now has three product surfaces:

1. **Marketing/public discovery** — the web landing page, public launch catalog, docs and legal information.
2. **Authenticated application** — creator console/account features and protected operational views.
3. **Native mobile application** — `apps/mobile`, optimized for discovery, account access, wallet data, checkout context, claims and transaction receipts.

The native app intentionally reuses the existing backend contracts instead of embedding server-only Helius, Birdeye, CDP, Prisma, Supabase service-role or transaction-builder credentials.

## Screen and flow survey

### First run
`Splash → Onboarding (4) → Home`

Onboarding copy focuses on launches, self-custody, exact transaction verification, and the distinction between account authentication and wallet authorization.

### Account
`Account → Sign in / Sign up → Email confirmation → Account`

Recovery:
`Sign in → Forgot password → powerchain://update-password → PKCE exchange → Update password`

Supabase Auth is used on-device with the public publishable key and SecureStore-backed session persistence. The backend accepts the Supabase bearer token for authenticated creator/API routes.

### Primary navigation
Native tab bar:
`Home · Launches · Wallet · Activity · Account`

Native stack/modal flows:
- Launch detail
- Checkout
- Claims
- Transaction receipt
- Creator companion
- Authentication and recovery

### Launch flow
`Launches → Launch detail → Checkout → quote → review/signing adapter → transaction receipt`

The current native checkout deliberately fails closed at wallet signing until an approved native Solana wallet adapter is configured. It does not downgrade the web security model or accept raw private keys.

## Navigation mapping

| Web concept | Native primitive |
|---|---|
| Header navigation | Bottom `Tabs` |
| Sale page | Native `Stack` detail |
| Checkout panel | Modal/stack checkout screen |
| Wallet dropdown | Wallet tab + native sheet/dialog |
| Transaction table | Activity list + receipt detail |
| Creator console | Protected stack |
| Sign-in pages | Auth stack |

Stable Expo Router Stack/Tabs are used. Alpha native-tabs and split-view APIs are intentionally not required for production.

## Theme extraction

Light theme is the persisted default. Users can switch to dark or system-following mode from Account:
- Background `#F7F9F7`
- Surface `#FFFFFF`
- Muted surface `#EFF3F0`
- Text `#0D1E18`
- Muted text `#68766F`
- Border `#DFE6E1`
- PowerChain green `#075F3B`
- Pressed green `#064C31`

Dark theme:
- Background `#0B1210`
- Surface `#111B17`
- Text `#F5F8F6`
- PowerChain green `#38A675`

Touch targets are at least 52px for primary actions. Cards use 14–20px radii with restrained borders and no neon/glass effects.

## Backend and external-service map

The mobile app calls only the PowerChain backend for Launchpad business/settlement data. Server-only integrations remain behind the backend:
- Helius RPC/DAS
- Birdeye market data
- Coinbase CDP SQL analytics
- Coinbase Onramp session creation/status
- Prisma/PostgreSQL
- Supabase service role
- Transaction-builder / quote authority

Supabase Auth is the sole deliberate direct mobile integration and uses only the public project URL + publishable key with RLS/account policies.

## Native assets

`apps/mobile/assets/` contains the official supplied PowerChain logo variants and PWRC coin art plus generated opaque app/splash/adaptive-icon assets.

## Native folders

`apps/mobile/ios/` and `apps/mobile/android/` contain native entrypoints/configuration. `app.config.ts` remains canonical; run `expo prebuild --clean` after changing config/plugins so native projects do not drift.


## Native API origin handling

Browser CORS enforcement remains origin-based. Native HTTP clients commonly omit the browser `Origin` header, so production API mutation requests are not rejected solely for an absent Origin. A present but unapproved browser Origin is still rejected; transaction/auth/idempotency/wallet-signature validation remains authoritative.

## Device UX resilience

The native UI uses keyboard-aware pages, pull-to-refresh on network-backed screens, haptic feedback for primary actions, safe-area-aware tab navigation, explicit empty/error states, and a bounded mobile API timeout. Safe GET requests may retry once after transient network/429/5xx failures; mutation requests are never automatically replayed by the generic mobile client.

Light remains the first-run default. Dark and system modes are user-selectable from Account.
