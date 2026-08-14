# PowerChain Launchpad

**Runtime:** Node.js 24.x · pnpm 11.21.0™ 1.0.0

Production-oriented, PowerChain-only token-sale application for Solana Token-2022 assets.

## Full-stack applications

- `apps/frontend` — Launchpad catalog, sale detail/purchase flow, Wallet Standard/ConnectorKit wallet UX, Claims, Creator Dashboard and Creator Console.
- `apps/backend` — API v1, canonical quotes, eligibility, Token-2022 validation, transaction preparation/confirmation, RPC failover, reconciliation and audit.
- `database` — ordered Supabase/PostgreSQL migrations plus a canonical fresh-install schema.
- `packages/domain` — exact bigint economics, lifecycle, vesting and transaction-review rules.
- `packages/solana` — transaction wire/message verification helpers.
- `packages/config` — shared PowerChain network/version configuration and validated public/server runtime contracts.
- `packages/utils` — shared bigint/address helpers, typed errors, request IDs, bounded retries and idempotent HTTP policy.
- `packages/integrations` — server-safe Helius RPC/DAS and Birdeye market-data clients.
- `packages/program-client` — typed PDA derivation, instruction codec, operation builders and on-chain state decoders for the PowerChain Launchpad program.
- `programs/launchpad` — native Rust Solana program for sale state, purchases, claims, creator operations and Token-2022 vault custody.

## Production guarantees implemented

- Fixed **2.5% PowerChain service fee** using integer arithmetic.
- Per-mint Token-2022 decimal validation.
- Public/private/trusted/allowlist eligibility enforcement.
- Atomic purchase settlement with sale row locking and oversell prevention.
- Atomic claim settlement and duplicate-claim protection.
- Exact reviewed Solana transaction-message binding before state mutation.
- Signed creator activation/cancel/complete lifecycle actions.
- Restricted sales activate as `private`, public sales as `public`.
- Stale unsigned creator drafts expire and are reconciled.
- PostgreSQL-backed distributed rate limiting.
- Server-side RPC primary/fallback handling.
- Supabase tables protected with RLS and browser-role privilege revocation.
- Same-origin mutation protection for the production API.
- Health/readiness probes, audit trail and protected reconciliation.
- PowerChain/PWRC branding only; release version remains exactly `1.0.0`.

## User purchase path

`/sales` lists canonical database-backed sales. `/sales/[saleId]` loads live pricing/allocation data, requests a server-owned quote, prepares the exact transaction, shows the mandatory instruction/recipient/fee review, signs through the connected Solana wallet, and confirms the exact reviewed transaction before atomic settlement.

## Wallet Center + checkout

- `/wallet` — live SOL/PWRC balances, configured Token-2022 account data, PWRC↔SOL market estimates and reviewed non-custodial wallet transfers.
- `/checkout/[saleId]` — focused mobile-friendly sale checkout with quote expiry, estimated SOL conversion, exact fee/recipient review and wallet signing.
- SOL and PWRC wallet-to-wallet transfers charge **0% PowerChain service fee**. The sender still pays normal Solana network fees and any required recipient token-account rent.
- PWRC transfers require a real configured Token-2022 PWRC mint; no mainnet mint is fabricated in source.

## Creator + claim paths

- `/create` — Token-2022 validation → pricing → timing → eligibility → vesting → exact activation transaction review.
- `/dashboard` — creator-scoped sales, live metrics, on-chain program state and reviewed pause/resume/cancel/complete controls.
- `/claims` — vesting schedule, claimed/vested/available amounts and reviewed claim signing.

## Local development

```bash
corepack prepare pnpm@11.21.0 --activate

# If upgrading from the earlier devEngines.runtime build, remove the stale
# npm-distributed Node runtime before reinstalling. Your nvm Node remains intact.
rm -rf node_modules
pnpm install
pnpm doctor:runtime
pnpm dev:all
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:3001`

## Validation and builds

```bash
pnpm validate
pnpm typecheck
pnpm build:frontend
pnpm build:backend
```

## Production deployment

```bash
cp .env.example .env
node scripts/check-production-env.mjs
docker compose build
docker compose up -d
```

Apply `database/migrations/*.sql` in order before starting production. For a new empty database, `database/schemas/launchpad.sql` is the canonical combined schema. Require `/api/v1/ready` to return HTTP 200 before routing traffic.

See `docs/FULLSTACK.md`, `docs/DEPLOYMENT.md`, `docs/SECURITY.md`, `docs/SETTLEMENT.md`, `docs/OPERATIONS.md`, `docs/RUNTIME.md`, `docs/PROGRAM-OPERATIONS.md`, `docs/WALLET-CHECKOUT.md`, and `apps/backend/openapi/powerchain-launchpad.openapi.yaml`.

## On-chain Launchpad program and transaction builder boundary

PowerChain now includes a native Rust Launchpad program under `programs/launchpad` plus a typed client under `packages/program-client`. The program ID is intentionally **not** fabricated in source: deploy the program, then configure the verified address through `POWERCHAIN_LAUNCHPAD_PROGRAM_ID`.

The external transaction builder remains the signing/composition boundary for production wallet transactions. It must build the exact typed PowerChain program instruction, simulate the complete transaction and return the serialized transaction used by the mandatory review screen. Purchase instructions require both the buyer and the configured `POWERCHAIN_QUOTE_AUTHORITY_WALLET` as signers, so direct program calls cannot choose arbitrary off-chain quote amounts without the server quote authority co-signature. The quote-authority private key belongs only in the external builder/signing service.

Supported program operations are initialize sale, adopt Token-2022 vault authority, purchase, claim, pause/resume, update timing, cancel and complete. PDA/state/handler details are documented in `docs/PROGRAM-OPERATIONS.md`.

Program verification commands:

```bash
pnpm program:check
pnpm program:test
pnpm program:build
```

`program:build` requires a local Solana SBF toolchain.

## Configurable PowerChain presale
The default presale allocation is **5,000,000,000 tokens**. Production purchases also require `POWERCHAIN_QUOTE_AUTHORITY_WALLET`, the public key of the server-side quote signer. Change allocation, sale start/end, claim start and pricing through the `POWERCHAIN_PRESALE_*` variables in `.env.example`. Creator sales also require a Token-2022 source vault token account and a sale-proceeds wallet. Vesting purchases create claim entitlements atomically; non-vesting sales deliver to the buyer's Token-2022 associated token account during purchase settlement.

## Production settlement guarantees

PowerChain Launchpad 1.0.0 verifies both sides of a confirmed purchase. For immediate-delivery sales, the buyer's exact Token-2022 receive amount is verified on-chain. For every purchase, the exact reviewed native-SOL sale proceeds and exact 2.5% PowerChain service fee must also be observed at their configured recipient addresses before settlement is finalized. Transaction message binding, signature confirmation, payment evidence, token-delivery evidence, and PostgreSQL settlement checks are all required; any missing evidence fails closed.

## Coinbase CDP Solana analytics

The optional server-only Coinbase Developer Platform SQL API integration adds recent Solana Mainnet transfer/instruction analytics without adding a custom indexer. It is used for analytics and reconciliation visibility only; transaction confirmation and settlement remain verified directly against Solana RPC.

Open **Analytics** in the Launchpad UI to query a mint, owner wallet, or decoded Token-2022 instructions. Configure `CDP_API_KEY_ID` and `CDP_API_KEY_SECRET` on the backend. See `docs/OPERATIONS.md` for the production contract and beta limitations.


## Mainnet configuration

Deployment-owned PWRC mint/vault/treasury/RPC values are centralized and fail closed; they are never invented in source. See `docs/CONFIGURATION.md` and `.env.example`.

## TypeScript / Next.js dependency setup

If the editor reports `Cannot find module node:path`, `Cannot find name process`, or `Cannot find module next`, install the workspace from the repository root:

```bash
corepack enable
pnpm install
pnpm doctor:types
pnpm typecheck
```

The frontend/backend TypeScript projects explicitly include Node typings because `next.config.ts` and server code use `node:*` modules and `process.env`. The local Solana workspace package is canonically named `@powerchain/solana`, matching the backend dependency and Next.js `transpilePackages` configuration.


## UI runtime documentation

- `docs/HOOKS-AND-UI.md`
- `docs/UI-UX.md`


## TypeScript / editor troubleshooting

For missing `react`, `react-dom`, `node:*`, `process`, or `next` types, see [`docs/TYPESCRIPT-TROUBLESHOOTING.md`](docs/TYPESCRIPT-TROUBLESHOOTING.md). Install dependencies once from the repository root with `pnpm install`.


## Helius, Birdeye, Prisma and API specification

- `/integration` — provider/PWRC/fee-routing status UI without secrets.
- `HELIUS_API_KEY` + optional `HELIUS_RPC_URL` — server-only Helius RPC/DAS. Helius can serve as the redundant mainnet RPC alongside `SOLANA_RPC_URL`.
- `BIRDEYE_API_KEY` — server-only price, liquidity and token overview data; informational only.
- `database/prisma/schema.prisma` + `/prisma.config.ts` — Prisma ORM 7 companion schema; ordered SQL migrations remain authoritative.
- `apps/backend/openapi/powerchain-launchpad.openapi.yaml` — canonical OpenAPI 3.1 source. Run `pnpm openapi:sync` to regenerate `swagger.yaml` and the root compatibility copy.

Provider integration notes: `docs/INTEGRATIONS.md`.

### Coinbase-hosted Onramp
Set `CDP_ONRAMP_ENABLED=true`, `CDP_API_KEY_ID`, `CDP_API_KEY_SECRET`, and an allowlisted HTTPS `CDP_ONRAMP_REDIRECT_URL` to enable Coinbase-hosted SOL funding in Checkout. See `docs/COINBASE-ONRAMP.md`.

## pnpm 11 + Prisma installation

PowerChain keeps pnpm 11 `strictDepBuilds` enabled. Reviewed dependency build scripts are committed under `allowBuilds` in `pnpm-workspace.yaml`, including Prisma 7.9.1 (`prisma` and `@prisma/engines`).

From the repository root:

```bash
corepack enable
pnpm install
pnpm doctor:pnpm
pnpm prisma:generate
pnpm doctor:types
pnpm typecheck
pnpm build
```

If `pnpm ignored-builds` lists a package not committed in `allowBuilds`, do not globally bypass the protection. Review that dependency before changing the allowlist.


## Mobile onboarding and accounts
See `docs/AUTH-ONBOARDING.md` for onboarding, sign-in/sign-up, recovery, secure cookie sessions and creator route gating.


## Mobile app

The Expo/React Native companion lives in `apps/mobile/` with native `ios/` and `android/` folders. See `docs/MOBILE-APP.md` and `docs/MOBILE-ENVIRONMENT.md`.

```bash
pnpm mobile:start
pnpm mobile:prebuild
pnpm mobile:ios
pnpm mobile:android
```

## Documentation layout

The repository root intentionally keeps only three Markdown files: `README.md`, `CHANGELOG.md`, and `CONTRIBUTORS.md`.

- Documentation index: [`docs/README.md`](docs/README.md)
- Release/build/status reports: [`docs/reports/`](docs/reports/)
- Application READMEs: [`apps/README.md`](apps/README.md)
- Shared package READMEs: [`packages/README.md`](packages/README.md)
- Solana program README/tests: [`programs/README.md`](programs/README.md)
- Utility package tests: [`packages/utils/tests/`](packages/utils/tests/)

## Development startup diagnostics

The web apps load the canonical `.env*` files from the monorepo root. App-local
environment values, shell variables, and deployment variables keep precedence.

Before starting the frontend:

```bash
nvm use 24
corepack enable
corepack prepare pnpm@11.21.0 --activate
pnpm install
pnpm preflight:frontend
pnpm dev:frontend
```

If pnpm only reports `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL`, run Next directly so
the original error is not buried by the recursive runner:

```bash
pnpm dev:frontend:direct
```

If port 3000 is occupied:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
pnpm clean:frontend
```

`pnpm clean:frontend` only removes the frontend `.next` cache; it does not touch
source files or installed dependencies.
