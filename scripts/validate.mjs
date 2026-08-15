import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const root=path.resolve(new URL('..',import.meta.url).pathname); const errors=[];
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const files=walk(root).filter(f=>!f.includes('/node_modules/'));
for(const f of files.filter(f=>path.basename(f)==='package.json')){const j=JSON.parse(fs.readFileSync(f));if(j.version!=="1.0.0")errors.push(`version mismatch ${path.relative(root,f)}: ${j.version}`)}
const forbidden=['jar'+'vis','JAR'+'VIS']; for(const banned of forbidden) for(const f of files.filter(f=>/\.(ts|tsx|js|mjs|md|json|css|sql)$/.test(f) && !f.endsWith('/scripts/validate.mjs'))){if(fs.readFileSync(f,'utf8').includes(banned))errors.push(`banned branding ${banned}: ${path.relative(root,f)}`)}
for(const req of ['apps/frontend/public/assets/brand/powerchain-mark-dark.png','apps/frontend/public/assets/pwrc/pwrc.jpeg','database/migrations/001_launchpad.sql','database/migrations/006_purchase_settlement_reconciliation.sql','apps/backend/app/api/v1/launchpad/purchase/prepare/route.ts','apps/backend/app/api/v1/launchpad/purchase/confirm/route.ts','database/migrations/008_sale_phase_creator_dashboard.sql','apps/backend/app/api/v1/launchpad/sales/route.ts','apps/frontend/components/launchpad/creator-dashboard.tsx','database/migrations/009_signed_creator_lifecycle_actions.sql','database/migrations/010_transaction_message_binding.sql','database/migrations/011_distributed_rate_limits_and_runtime_guards.sql','apps/backend/lib/rate-limit.ts','apps/backend/lib/rate-limit-response.ts','apps/backend/lib/solana-transaction-integrity.ts','apps/backend/app/api/v1/launchpad/sales/action/prepare/route.ts','apps/backend/app/api/v1/launchpad/sales/action/confirm/route.ts','apps/backend/app/api/v1/launchpad/catalog/route.ts','apps/checkout/components/purchase-flow.tsx','apps/frontend/components/launchpad/sale-catalog.tsx','apps/frontend/app/sales/[saleId]/page.tsx','deploy/Dockerfile.frontend','deploy/Dockerfile.backend','compose.yaml','database/migrations/012_fullstack_catalog_runtime.sql','database/migrations/013_activation_and_draft_hardening.sql','database/migrations/014_database_access_hardening.sql','apps/backend/proxy.ts','database/migrations/015_presale_delivery_and_vesting_entitlements.sql','database/migrations/016_vault_authority_and_recovery.sql','apps/backend/lib/token-delivery.ts','apps/frontend/components/ui/counter.tsx','apps/frontend/components/ui/countdown.tsx','database/migrations/018_confirmation_recovery_state.sql','apps/backend/lib/confirmation-state.ts','apps/backend/app/api/v1/launchpad/transaction/status/route.ts','vercel.json','apps/frontend/vercel.json','apps/backend/vercel.json','packages/utils/src/helpers.ts','packages/utils/src/utils/errors.ts','apps/backend/lib/cdp-sql.ts','apps/backend/app/api/v1/launchpad/analytics/mint/route.ts','apps/backend/app/api/v1/launchpad/analytics/wallet/route.ts','apps/backend/app/api/v1/launchpad/analytics/instructions/route.ts','database/migrations/019_claim_transaction_fee_evidence.sql','database/migrations/020_monotonic_settlement_and_purchase_review_guard.sql','apps/backend/lib/fee-policy.ts','apps/backend/app/api/v1/launchpad/fees/route.ts','apps/backend/app/api/v1/launchpad/transactions/route.ts','apps/backend/lib/transaction-receipt.ts','apps/frontend/app/transactions/page.tsx','apps/frontend/components/launchpad/transaction-history.tsx','apps/frontend/app/analytics/page.tsx','apps/frontend/components/launchpad/analytics-explorer.tsx','apps/frontend/lib/helpers.ts','apps/frontend/lib/utils/errors.ts','apps/backend/lib/helpers.ts','apps/backend/lib/utils/errors.ts','apps/backend/lib/validate.ts','apps/backend/lib/safe-actions.ts','apps/backend/app/api/v1/cors/route.ts','apps/backend/app/api/v1/tokens/route.ts','apps/backend/app/api/v1/transactions/route.ts','apps/backend/app/api/v1/checkout/route.ts','apps/frontend/components/wallet/wallet-connect-modal.tsx','apps/frontend/lib/embedded-wallets.ts','apps/frontend/lib/embedded-walllets.ts','apps/frontend/lib/validate.ts','apps/frontend/lib/safe-actions.ts','docs/API-V1-WALLET-CHECKOUT.md','apps/backend/lib/solana-network.ts','apps/backend/app/api/v1/launchpad/network/route.ts','apps/frontend/components/launchpad/network-status.tsx','database/migrations/022_mainnet_sale_binding.sql','docs/MAINNET.md','database/migrations/023_integrations_fee_market_data.sql','packages/integrations/src/index.ts','apps/backend/app/api/v1/integrations/health/route.ts','apps/backend/app/api/v1/integrations/pwrc/route.ts','apps/backend/app/api/v1/tokens/[mint]/market/route.ts','database/prisma/schema.prisma','prisma.config.ts','apps/backend/api/openapi/openapi.yaml','docs/INTEGRATIONS.md','apps/frontend/app/integration/page.tsx','apps/frontend/components/integrations/integration-overview.tsx','apps/backend/app/api/v1/openapi/route.ts','apps/backend/api/openapi/swagger.config.json','scripts/sync-openapi.mjs','database/README.md','database/prisma/README.md','database/supabase/README.md','programs/Cargo.toml','programs/launchpad/Cargo.toml','programs/launchpad/src/processor.rs','programs/launchpad/src/instruction.rs','programs/launchpad/src/state.rs','programs/launchpad/idl/powerchain-launchpad.json','programs/README.md','packages/program-client/src/index.ts','packages/program-client/src/instructions.ts','packages/program-client/src/pda.ts','packages/program-client/src/review.ts','apps/backend/lib/program/handlers.ts','apps/backend/lib/program/accounts.ts','apps/backend/lib/program/status.ts','apps/backend/lib/token-2022-account.ts','apps/backend/app/api/v1/launchpad/program/status/route.ts','apps/backend/app/api/v1/launchpad/program/operations/route.ts','apps/backend/app/api/v1/launchpad/program/operations/prepare/route.ts','apps/backend/app/api/v1/launchpad/program/operations/confirm/route.ts','database/migrations/024_launchpad_program_operations.sql','docs/PROGRAM-OPERATIONS.md','apps/frontend/public/assets/pwrc/pwrc.png','apps/frontend/public/assets/pwrc/pwrc.svg','apps/frontend/components/pwrc-coin.tsx','apps/frontend/app/wallet/page.tsx','apps/frontend/components/wallet/wallet-center.tsx','apps/backend/app/api/v1/wallets/[wallet]/route.ts','apps/backend/app/api/v1/transfers/prepare/route.ts','apps/backend/app/api/v1/transfers/confirm/route.ts','apps/backend/lib/wallet-assets.ts','apps/backend/lib/wallet-transfer.ts','database/migrations/025_wallet_transfers_checkout_assets.sql','apps/checkout/app/checkout/[saleId]/page.tsx','docs/WALLET-CHECKOUT.md','apps/frontend/app/onboarding/page.tsx','apps/frontend/app/auth/sign-in/page.tsx','apps/frontend/app/auth/sign-up/page.tsx','apps/frontend/context/auth-context.tsx','apps/backend/lib/auth.ts','apps/backend/app/api/v1/auth/session/route.ts','database/migrations/027_account_auth_profiles.sql','docs/AUTH-ONBOARDING.md','apps/checkout/package.json','apps/checkout/next.config.ts','apps/checkout/app/checkout/[saleId]/page.tsx','apps/checkout/components/purchase-flow.tsx','apps/backend/lib/purchase-transaction-builder.ts','packages/integrations/src/pyth.ts','packages/integrations/src/birdeye.ts','packages/integrations/src/coinmarketcap.ts','packages/integrations/src/prices.ts','packages/integrations/src/rates.ts','packages/integrations/src/amount.ts','packages/ui/package.json','scripts/check-monorepo-layout.mjs','deploy/Dockerfile.checkout']) if(!fs.existsSync(path.join(root,req)))errors.push(`missing ${req}`);
const phaseMigration=fs.readFileSync(path.join(root,'database/migrations/008_sale_phase_creator_dashboard.sql'),'utf8');for(const guard of ['launchpad_refresh_sale_phases','claimable','scheduled','private','public','creator_wallet'])if(!phaseMigration.includes(guard))errors.push(`phase guard missing: ${guard}`);

const creatorActions=fs.readFileSync(path.join(root,'database/migrations/009_signed_creator_lifecycle_actions.sql'),'utf8');for(const guard of ['launchpad_apply_sale_action','for update','sale_has_confirmed_purchases','unclaimed_tokens_remain','cancelled_at','completed_at'])if(!creatorActions.includes(guard))errors.push(`creator action guard missing: ${guard}`);
const settlement=fs.readFileSync(path.join(root,'database/migrations/006_purchase_settlement_reconciliation.sql'),'utf8');for(const guard of ['for update','purchase_token_amount_mismatch','purchase_service_fee_mismatch','wallet_not_eligible','sale_allocation_exceeded','wallet_purchase_limit_exceeded'])if(!settlement.includes(guard))errors.push(`settlement guard missing: ${guard}`);

const txBinding=fs.readFileSync(path.join(root,'apps/backend/lib/solana-transaction-integrity.ts'),'utf8');for(const guard of ['getTransaction','encoding:"base64"','transactionMessageHash','transaction_message_mismatch','maxSupportedTransactionVersion:0'])if(!txBinding.includes(guard))errors.push(`transaction binding guard missing: ${guard}`);
const txBindingMigration=fs.readFileSync(path.join(root,'database/migrations/010_transaction_message_binding.sql'),'utf8');for(const guard of ['confirmed_message_hash','confirmed_rpc_endpoint','confirmed_at'])if(!txBindingMigration.includes(guard))errors.push(`transaction binding migration guard missing: ${guard}`);
for(const route of ['claim/confirm/route.ts','purchase/confirm/route.ts','sales/confirm/route.ts','sales/action/confirm/route.ts']){const f=path.join(root,'apps/backend/app/api/v1/launchpad',route);const c=fs.readFileSync(f,'utf8');if(!c.includes('verifyTransactionMatchesPrepared'))errors.push(`exact transaction verification missing: ${route}`)}

const limiterMigration=fs.readFileSync(path.join(root,'database/migrations/011_distributed_rate_limits_and_runtime_guards.sql'),'utf8');for(const guard of ['launchpad_consume_rate_limit','security definer','service_fee_bps = 250','launchpad_cleanup_rate_limits'])if(!limiterMigration.includes(guard))errors.push(`rate-limit guard missing: ${guard}`);
for(const route of ['quote/route.ts','purchase/prepare/route.ts','claim/prepare/route.ts','sales/draft/route.ts','sales/action/prepare/route.ts','token-2022/validate/route.ts','claim/confirm/route.ts','purchase/confirm/route.ts','sales/confirm/route.ts','sales/action/confirm/route.ts']){const f=path.join(root,'apps/backend/app/api/v1/launchpad',route);const c=fs.readFileSync(f,'utf8');if(!c.includes('enforceRateLimit'))errors.push(`distributed rate limit missing: ${route}`)}
const quoteRoute=fs.readFileSync(path.join(root,'apps/backend/app/api/v1/launchpad/quote/route.ts'),'utf8');for(const guard of ['loadSale','sale.price_usd_micros','sale.decimals','assertEligible','serviceFeeBps:250'])if(!quoteRoute.includes(guard))errors.push(`canonical quote guard missing: ${guard}`);

const activationMigration=fs.readFileSync(path.join(root,'database/migrations/013_activation_and_draft_hardening.sql'),'utf8');
for(const guard of ['launchpad_apply_sale_activation','for update','eligibility_mode','private','launchpad_cleanup_stale_drafts','creator_mismatch']) if(!activationMigration.includes(guard))errors.push(`activation guard missing: ${guard}`);
const accessMigration=fs.readFileSync(path.join(root,'database/migrations/014_database_access_hardening.sql'),'utf8');
for(const guard of ['enable row level security','revoke all on table','service_role','launchpad_apply_confirmed_purchase','launchpad_apply_confirmed_claim']) if(!accessMigration.includes(guard))errors.push(`database access guard missing: ${guard}`);
const catalogRoute=fs.readFileSync(path.join(root,'apps/backend/app/api/v1/launchpad/catalog/route.ts'),'utf8');
for(const guard of ['launchpad_refresh_sale_phases','status=eq.confirmed','allocation_base_units','eligibility_mode']) if(!catalogRoute.includes(guard))errors.push(`catalog guard missing: ${guard}`);
const canonicalSchema=fs.readFileSync(path.join(root,'database/schemas/launchpad.sql'),'utf8');
for(const guard of ['014_database_access_hardening.sql','launchpad_apply_sale_activation','launchpad_consume_rate_limit']) if(!canonicalSchema.includes(guard))errors.push(`canonical schema guard missing: ${guard}`);


function isGeneratedPrismaImport(fromFile,specifier){
  if(!specifier.includes("generated/prisma/client"))return false;
  const prismaConfig=path.join(root,"prisma.config.ts");
  const schema=path.join(root,"database/prisma/schema.prisma");
  const pkg=JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8"));
  return fs.existsSync(prismaConfig)
    && fs.existsSync(schema)
    && String(pkg.scripts?.["prisma:generate"]??"").includes("prisma generate");
}

// Resolve all relative source imports so packaging errors are caught before release.
for(const f of files.filter(f=>/\.(ts|tsx|js|mjs)$/.test(f)&&!f.includes('/dist/'))){
 const src=fs.readFileSync(f,'utf8');const re=/(?:from\s+|import\s*\()\s*["'](\.{1,2}\/[^"']+)["']/g;let match;
 while((match=re.exec(src))){
  const base=path.resolve(path.dirname(f),match[1]);
  const stripped=/\.js$/.test(base)?base.slice(0,-3):base;
  const candidates=[base,stripped,...['.ts','.tsx','.js','.mjs','.json'].map(x=>stripped+x),...['.ts','.tsx','.js','.mjs'].map(x=>path.join(stripped,'index'+x))];
  const rel=path.relative(root,base).replaceAll('\\','/');
  const distMatch=rel.match(/^(packages\/[^/]+)\/dist\/(.+?)(?:\.js)?$/);
  if(distMatch){
    const sourceBase=path.join(root,distMatch[1],'src',distMatch[2]);
    candidates.push(sourceBase,...['.ts','.tsx','.js','.mjs'].map(x=>sourceBase+x),...['.ts','.tsx','.js','.mjs'].map(x=>path.join(sourceBase,'index'+x)));
  }
  if(!candidates.some(fs.existsSync)&&!isGeneratedPrismaImport(f,match[1]))errors.push(`unresolved relative import ${path.relative(root,f)} -> ${match[1]}`);
 }
}
const deliveryMigration=fs.readFileSync(path.join(root,'database/migrations/015_presale_delivery_and_vesting_entitlements.sql'),'utf8');
for(const guard of ['source_vault_token_account','payment_receiver_wallet','delivery_mode','launchpad_vesting','vestingEntitlementCreated','for update']) if(!deliveryMigration.includes(guard))errors.push(`delivery migration guard missing: ${guard}`);
for(const route of ['purchase/prepare/route.ts','purchase/confirm/route.ts','claim/prepare/route.ts','claim/confirm/route.ts']){const f=path.join(root,'apps/backend/app/api/v1/launchpad',route);const c=fs.readFileSync(f,'utf8');if(!c.includes('delivery'))errors.push(`token delivery contract missing: ${route}`)}


const authorityMigration=fs.readFileSync(path.join(root,'database/migrations/016_vault_authority_and_recovery.sql'),'utf8');
for(const guard of ['source_vault_authority','launchpad_sales_source_vault_authority_idx']) if(!authorityMigration.includes(guard))errors.push(`vault authority guard missing: ${guard}`);
const tokenValidation=fs.readFileSync(path.join(root,'apps/backend/app/api/v1/launchpad/token-2022/validate/route.ts'),'utf8');
if(!tokenValidation.includes('vaultAuthority')||!tokenValidation.includes('does not match the token account owner'))errors.push('vault authority RPC validation missing');
const purchaseUi=fs.readFileSync(path.join(root,'apps/checkout/components/purchase-flow.tsx'),'utf8');
for(const guard of ['confirmUntilSettled','Prepared transaction does not match the reviewed quote']) if(!purchaseUi.includes(guard))errors.push(`checkout purchase guard missing: ${guard}`);
const checkoutService=fs.readFileSync(path.join(root,'apps/checkout/services/checkout-service.ts'),'utf8');
for(const guard of ['purchase/prepare','purchase/confirm','launchpad/quote']) if(!checkoutService.includes(guard))errors.push(`checkout service endpoint missing: ${guard}`);
const purchaseBuilder=fs.readFileSync(path.join(root,'apps/backend/lib/purchase-transaction-builder.ts'),'utf8');
for(const guard of ['buildPurchaseOperation','partialSign','simulateTransaction','POWERCHAIN_QUOTE_AUTHORITY_KEYPAIR_JSON','solPaymentAmounts']) if(!purchaseBuilder.includes(guard))errors.push(`local purchase builder guard missing: ${guard}`);
if(fs.existsSync(path.join(root,'apps/frontend/app/checkout')))errors.push('frontend must not own checkout routes');


const paymentMigration=fs.readFileSync(path.join(root,'database/migrations/017_payment_settlement_evidence.sql'),'utf8');
for(const guard of ['payment_amount_base_units','service_fee_payment_base_units','payment_verified_at','payment_rpc_endpoint']) if(!paymentMigration.includes(guard))errors.push(`payment settlement migration guard missing: ${guard}`);
const paymentSettlement=fs.readFileSync(path.join(root,'apps/backend/lib/payment-settlement.ts'),'utf8');
for(const guard of ['builder_service_fee_payment_mismatch','builder_exact_payment_recipient_missing','verifyConfirmedNativeSolPayment','payment_amount_mismatch','service_fee_amount_mismatch']) if(!paymentSettlement.includes(guard))errors.push(`payment settlement guard missing: ${guard}`);
for(const route of ['purchase/prepare/route.ts','purchase/confirm/route.ts']){const f=path.join(root,'apps/backend/app/api/v1/launchpad',route);const c=fs.readFileSync(f,'utf8');if(!c.includes('paymentSettlement')&&!c.includes('paymentVerified'))errors.push(`payment settlement flow missing: ${route}`)}
const readyRoute=fs.readFileSync(path.join(root,'apps/backend/app/api/v1/ready/route.ts'),'utf8');for(const guard of ['dedicatedRpc','rpcRedundancy','delegatedVaultActivation'])if(!readyRoute.includes(guard))errors.push(`readiness production guard missing: ${guard}`);

const recoveryMigration=fs.readFileSync(path.join(root,'database/migrations/018_confirmation_recovery_state.sql'),'utf8');
for(const guard of ['settlement_stage','confirmation_attempts','next_confirmation_check_at','launchpad_mark_confirmation_attempt','security definer']) if(!recoveryMigration.includes(guard))errors.push(`confirmation recovery guard missing: ${guard}`);
const claimRecovery=fs.readFileSync(path.join(root,'apps/frontend/components/launchpad/claim-center.tsx'),'utf8');
for(const guard of ['pending-claim.v1','confirmPending','localStorage','Recovering claim confirmation']) if(!claimRecovery.includes(guard))errors.push(`claim recovery guard missing: ${guard}`);


const frontendNext=fs.readFileSync(path.join(root,'apps/frontend/next.config.ts'),'utf8');
for(const guard of ['output: "standalone" as const','transpilePackages','@powerchain/utils','poweredByHeader: false','BACKEND_ORIGIN','POWERCHAIN_STRICT_BUILD_ENV']) if(!frontendNext.includes(guard))errors.push(`frontend next config guard missing: ${guard}`);
const backendNext=fs.readFileSync(path.join(root,'apps/backend/next.config.ts'),'utf8');
for(const guard of ['output: "standalone" as const','transpilePackages','@powerchain/utils','poweredByHeader: false','Cache-Control']) if(!backendNext.includes(guard))errors.push(`backend next config guard missing: ${guard}`);
const vercelConfig=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));
if(vercelConfig.framework!=='nextjs'||!String(vercelConfig.buildCommand||'').includes('@powerchain/launchpad-frontend'))errors.push('root Vercel frontend config invalid');
const sharedHelpers=fs.readFileSync(path.join(root,'packages/utils/src/helpers.ts'),'utf8');
for(const guard of ['isSolanaAddress','asPositiveUint','formatBaseUnits','withTimeout','sleep']) if(!sharedHelpers.includes(guard))errors.push(`shared helper missing: ${guard}`);
const sharedErrors=fs.readFileSync(path.join(root,'packages/utils/src/utils/errors.ts'),'utf8');
for(const guard of ['PowerChainError','parseApiError','RATE_LIMITED','TRANSACTION_FAILED','normalizeError']) if(!sharedErrors.includes(guard))errors.push(`shared error helper missing: ${guard}`);


const runtimeConfig=fs.readFileSync(path.join(root,'packages/config/src/runtime.ts'),'utf8');
for(const guard of ['getPublicRuntimeConfig','getServerRuntimeConfig','mainnet-beta production requires at least two server-side RPC endpoints']) if(!runtimeConfig.includes(guard))errors.push(`runtime config guard missing: ${guard}`);
const frontendRuntime=fs.readFileSync(path.join(root,'apps/frontend/lib/config.ts'),'utf8');
if(frontendRuntime.includes('getPublicRuntimeConfig')||frontendRuntime.includes('from "@powerchain/launchpad-config"')||frontendRuntime.includes("from '@powerchain/launchpad-config'"))errors.push('frontend runtime config must not import the shared package root');
for(const guard of ['parseClientRuntimeConfig','const clientConfig','NEXT_PUBLIC_SOLANA_RPC_URL'])if(!frontendRuntime.includes(guard))errors.push(`frontend runtime config guard missing: ${guard}`);
const frontendPublicEnv=fs.readFileSync(path.join(root,'apps/frontend/lib/env/public.ts'),'utf8');
for(const banned of ['DATABASE_URL','SUPABASE_SERVICE_ROLE_KEY','WEBHOOK_SIGNING_SECRET'])if(frontendPublicEnv.includes(banned))errors.push(`frontend public env leaks server-only token: ${banned}`);
if(/(?:import|from)\s*(?:[^\n]*?)['\"](?:server-only|node:)/.test(frontendPublicEnv))errors.push('frontend public env imports a server-only or Node module');
const configPackage=JSON.parse(fs.readFileSync(path.join(root,'packages/config/package.json'),'utf8'));
for(const subpath of ['./constants','./public','./server'])if(!configPackage.exports?.[subpath])errors.push(`config package export missing: ${subpath}`);
for(const file of files.filter(f=>/\.(ts|tsx)$/.test(f)&&f.includes('/apps/frontend/'))){
 const source=fs.readFileSync(file,'utf8');
 if(/^\s*["']use client["'];?/m.test(source)&&source.includes('@powerchain/launchpad-config/server'))errors.push(`client module imports server config: ${path.relative(root,file)}`);
}
const httpPolicy=fs.readFileSync(path.join(root,'packages/utils/src/http.ts'),'utf8');
for(const guard of ['x-request-id','idempotency-key','parseRetryAfterMs','fetchJsonWithPolicy','canRetry']) if(!httpPolicy.includes(guard))errors.push(`HTTP policy guard missing: ${guard}`);
for(const req of ['docs/RUNTIME.md','scripts/check-vercel-config.mjs','.env.development.example','packages/config/src/runtime.ts','packages/utils/src/http.ts']) if(!fs.existsSync(path.join(root,req)))errors.push(`runtime improvement missing: ${req}`);
const cdpSql=fs.readFileSync(path.join(root,'apps/backend/lib/cdp-sql.ts'),'utf8');
for(const guard of ['@coinbase/cdp-sdk/auth','solana.transfers','solana.instructions','action = 1','TOKEN_2022_PROGRAM_ID','generateJwt']) if(!cdpSql.includes(guard))errors.push(`CDP SQL guard missing: ${guard}`);

const monotonicMigration=fs.readFileSync(path.join(root,'database/migrations/020_monotonic_settlement_and_purchase_review_guard.sql'),'utf8');
for(const guard of ['launchpad_advance_review_stage','for update','v_next_rank < v_current_rank','launchpad_reviews_one_live_purchase_per_wallet_sale']) if(!monotonicMigration.includes(guard))errors.push(`monotonic settlement guard missing: ${guard}`);
const confirmationState=fs.readFileSync(path.join(root,'apps/backend/lib/confirmation-state.ts'),'utf8');if(!confirmationState.includes('launchpad_advance_review_stage'))errors.push('confirmation state must use DB-enforced stage advancement');
const transactionHistory=fs.readFileSync(path.join(root,'apps/frontend/components/launchpad/transaction-history.tsx'),'utf8');if(!transactionHistory.includes('Retry verification'))errors.push('transaction retry UI missing');

const mainnetNetwork=fs.readFileSync(path.join(root,'apps/backend/lib/solana-network.ts'),'utf8');for(const guard of ['getGenesisHash','MAINNET_GENESIS_PREFIX','getSlot','getBlockHeight','getVersion'])if(!mainnetNetwork.includes(guard))errors.push(`mainnet identity guard missing: ${guard}`);
const mainnetMigration=fs.readFileSync(path.join(root,'database/migrations/022_mainnet_sale_binding.sql'),'utf8');for(const guard of ['cluster','genesis_hash','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'])if(!mainnetMigration.includes(guard))errors.push(`mainnet sale binding guard missing: ${guard}`);


for (const [pkg, expectedName] of [["config","@powerchain/launchpad-config"],["solana","@powerchain/solana"],["utils","@powerchain/utils"],["domain","@powerchain/launchpad-domain"],["integrations","@powerchain/integrations"],["program-client","@powerchain/launchpad-program-client"]]) {
 const file=path.join(root,"packages",pkg,"package.json"); const json=JSON.parse(fs.readFileSync(file,"utf8"));
 if(json.name!==expectedName) errors.push(`workspace package name mismatch: ${pkg}`);
 if(!json.exports || !json.exports["."]) errors.push(`workspace package source export missing: ${pkg}`);
}

const allowedRootMarkdown = new Set(["README.md", "CHANGELOG.md", "CONTRIBUTORS.md"]);
for (const rootDoc of allowedRootMarkdown) if (!fs.existsSync(path.join(root, rootDoc))) errors.push(`missing root document: ${rootDoc}`);
for (const rootFile of fs.readdirSync(root)) if (rootFile.endsWith(".md") && !allowedRootMarkdown.has(rootFile)) errors.push(`unexpected root markdown; move it under docs/: ${rootFile}`);
for (const requiredDoc of ["docs/README.md","docs/reports/README.md","apps/README.md","apps/frontend/README.md","apps/backend/README.md","apps/mobile/README.md","packages/README.md","packages/utils/README.md","programs/launchpad/README.md","packages/utils/tests/helpers.test.mjs","packages/utils/tests/http.test.mjs","packages/utils/tests/errors.test.mjs","programs/launchpad/tests/instruction_codec.rs","programs/launchpad/tests/README.md","tests/README.md"]) if(!fs.existsSync(path.join(root, requiredDoc))) errors.push(`missing organized documentation/test artifact: ${requiredDoc}`);

const workspaceYaml=fs.readFileSync(path.join(root,"pnpm-workspace.yaml"),"utf8");
for(const dep of ["@prisma/engines","bigint-buffer","bufferutil","prisma","sharp","utf-8-validate"]) { const bare=`${dep}: true`; const quoted=`"${dep}": true`; if(!workspaceYaml.includes(bare) && !workspaceYaml.includes(quoted)) errors.push(`pnpm allowBuilds missing: ${dep}`); }


const integrationMigration=fs.readFileSync(path.join(root,'database/migrations/023_integrations_fee_market_data.sql'),'utf8');
for(const guard of ['FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy','launchpad_token_market_snapshots','enable row level security'])if(!integrationMigration.includes(guard))errors.push(`integration migration guard missing: ${guard}`);
const heliusIntegration=fs.readFileSync(path.join(root,'packages/integrations/src/helius.ts'),'utf8');
const birdeyeIntegration=fs.readFileSync(path.join(root,'packages/integrations/src/birdeye.ts'),'utf8');
const pythIntegration=fs.readFileSync(path.join(root,'packages/integrations/src/pyth.ts'),'utf8');
const cmcIntegration=fs.readFileSync(path.join(root,'packages/integrations/src/coinmarketcap.ts'),'utf8');
for(const [guard,source] of [['mainnet.helius-rpc.com',heliusIntegration],['public-api.birdeye.so',birdeyeIntegration],['X-API-KEY',birdeyeIntegration],['x-chain',birdeyeIntegration],['v2/updates/price/latest',pythIntegration],['v3/cryptocurrency/quotes/latest',cmcIntegration]])if(!source.includes(guard))errors.push(`provider integration guard missing: ${guard}`);

const canonicalOpenApi=fs.readFileSync(path.join(root,'apps/backend/api/openapi/openapi.yaml'),'utf8');
if(!canonicalOpenApi.includes('openapi: 3.1.0')) errors.push('canonical backend OpenAPI must use 3.1.0');
if(fs.existsSync(path.join(root,'openapi'))) errors.push('root openapi/ must not exist');
if(fs.existsSync(path.join(root,'apps/backend/openapi'))) errors.push('legacy apps/backend/openapi must not exist');


const programLib=fs.readFileSync(path.join(root,'programs/launchpad/src/lib.rs'),'utf8');
for(const guard of ['SERVICE_FEE_BPS: u64 = 250','FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy'])if(!programLib.includes(guard))errors.push(`program protocol guard missing: ${guard}`);
if(/declare_id!|POWERCHAIN_LAUNCHPAD_PROGRAM_ID\s*=\s*["'][1-9A-HJ-NP-Za-km-z]{32,44}/.test(programLib))errors.push('program must not compile a fabricated deployment ID');
const programState=fs.readFileSync(path.join(root,'programs/launchpad/src/state.rs'),'utf8');
for(const guard of ['quote_authority','vesting_enabled','delivery_on_claim','purchase_nonce'])if(!programState.includes(guard))errors.push(`program state guard missing: ${guard}`);
const programProcessor=fs.readFileSync(path.join(root,'programs/launchpad/src/processor.rs'),'utf8');
for(const guard of ['require_signer(quote_authority)','InvalidServiceFee','PARTICIPANT_SEED','AdoptVaultAuthority','delivery_on_claim','transfer_from_vault'])if(!programProcessor.includes(guard))errors.push(`program processor guard missing: ${guard}`);
const programMigration=fs.readFileSync(path.join(root,'database/migrations/024_launchpad_program_operations.sql'),'utf8');
for(const guard of ['quote_authority_wallet','launchpad_program_operations','participant_pda','program_purchase_nonce','delivery_mode','program-pause','program-resume'])if(!programMigration.includes(guard))errors.push(`program migration guard missing: ${guard}`);
const programOpsDoc=fs.readFileSync(path.join(root,'docs/PROGRAM-OPERATIONS.md'),'utf8');
for(const guard of ['POWERCHAIN_QUOTE_AUTHORITY_WALLET','delivery_on_claim','AdoptVaultAuthority','program:build'])if(!programOpsDoc.includes(guard))errors.push(`program operations documentation guard missing: ${guard}`);
const creatorProgramUi=fs.readFileSync(path.join(root,'apps/frontend/components/launchpad/creator-dashboard.tsx'),'utf8');
for(const guard of ['pause','resume','TransactionReview','sale_pda'])if(!creatorProgramUi.includes(guard))errors.push(`creator program UI guard missing: ${guard}`);
const mobileStyles=fs.readFileSync(path.join(root,'apps/frontend/app/styles.css'),'utf8');
for(const guard of ['mobile-bottom-nav','safe-area-inset-bottom','touch-target','program-receipt'])if(!mobileStyles.includes(guard))errors.push(`mobile program UI guard missing: ${guard}`);
const configConstants=fs.readFileSync(path.join(root,'packages/config/src/constants.ts'),'utf8');
if(!configConstants.includes('POWERCHAIN_QUOTE_AUTHORITY_WALLET'))errors.push('quote authority deployment config missing');

const digest=crypto.createHash('sha256').update(files.sort().map(f=>path.relative(root,f)+':'+crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')).join('\n')).digest('hex');
console.log(JSON.stringify({ok:errors.length===0,files:files.length,version:'1.0.0',branding:'PowerChain-only',sha256:digest,errors},null,2));if(errors.length)process.exit(1);

