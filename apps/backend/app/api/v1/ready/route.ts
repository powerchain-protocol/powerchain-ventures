import {POWERCHAIN_FEE_WALLET_ADDRESS} from "@powerchain/launchpad-config";
import {integrationStatus} from "../../../../lib/integrations/config";
import {json} from "../../../../lib/http";
import {isSolanaAddress} from "../../../../lib/policy";
import {databaseConfigured} from "../../../../lib/supabase-rest";
import {rpcEndpoints,rpcHealth} from "../../../../lib/solana-rpc";
import {cdpSqlConfigured,cdpSqlRequired} from "../../../../lib/cdp-sql";
import {mainnetInfrastructureConfigured,verifyNetworkIdentity} from "../../../../lib/solana-network";
import {getLaunchpadProgramStatus} from "../../../../lib/program/status";
import {configuredQuoteAuthorityWallet} from "../../../../lib/program/config";
import {authEnabled} from "../../../../lib/auth";
export const runtime="nodejs";
export async function GET(){
 const cluster=process.env.NEXT_PUBLIC_SOLANA_CLUSTER==="devnet"?"devnet":"mainnet-beta";
 const treasury=process.env.POWERCHAIN_TREASURY_WALLET?.trim()||POWERCHAIN_FEE_WALLET_ADDRESS;
 const rpc=rpcEndpoints();const chain=rpc.length?await rpcHealth():{ok:false,error:"not_configured",attempts:[]};
 const infra=mainnetInfrastructureConfigured();
 const dedicatedRpc=infra.dedicated;
 const rpcRedundancy=infra.redundant;
 let identity:null|Awaited<ReturnType<typeof verifyNetworkIdentity>>=null;let identityError:string|null=null;try{identity=await verifyNetworkIdentity()}catch(e){identityError=e instanceof Error?e.message:"network_identity_failed";}
 const cdpConfigured=cdpSqlConfigured();const providers=integrationStatus();const program=await getLaunchpadProgramStatus();
 const checks={solanaRpc:chain.ok,networkIdentity:Boolean(identity?.verified),dedicatedRpc,rpcRedundancy,treasury:isSolanaAddress(treasury),database:databaseConfigured(),transactionBuilder:Boolean(process.env.POWERCHAIN_TRANSACTION_BUILDER_URL),transactionBuilderKey:Boolean((process.env.POWERCHAIN_TRANSACTION_BUILDER_API_KEY??"").length>=20),reconciliationSecret:Boolean((process.env.CRON_SECRET?.trim()||process.env.RECONCILIATION_SECRET?.trim()||"").length>=32),allowedOrigins:Boolean((process.env.ALLOWED_ORIGINS??process.env.NEXT_PUBLIC_APP_URL??"").trim()),launchpadProgramId:isSolanaAddress(process.env.POWERCHAIN_LAUNCHPAD_PROGRAM_ID??""),launchpadProgramDeployed:program.deployed&&program.executable,quoteAuthority:isSolanaAddress(configuredQuoteAuthorityWallet()??""),cdpSql:!cdpSqlRequired()||cdpConfigured,accountAuth:process.env.POWERCHAIN_AUTH_ENABLED==="false"||authEnabled()};
 const ok=Object.values(checks).every(Boolean);
 return json({ok,version:"1.0.0",cluster,checks,program:{configured:program.configured,deployed:program.deployed,executable:program.executable,programId:program.programId,quoteAuthorityConfigured:Boolean(program.quoteAuthorityWallet)},integrations:providers,analytics:{provider:"coinbase-cdp-sql",configured:cdpConfigured,required:cdpSqlRequired(),network:"solana-mainnet",beta:true},networkIdentity:identity?{verified:true,genesisHash:identity.genesisHash,slot:identity.slot,blockHeight:identity.blockHeight,version:identity.version}: {verified:false,error:identityError},rpc:{configured:rpc.length,active:"endpoint" in chain?chain.endpoint:null,latencyMs:"latencyMs" in chain?chain.latencyMs:null,attempts:chain.attempts.map(a=>({index:rpc.findIndex(v=>v.url===a.url),ok:a.ok,latencyMs:a.latencyMs,error:a.error}))}},{status:ok?200:503});
}
