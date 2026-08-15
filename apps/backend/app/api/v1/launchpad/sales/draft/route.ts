import {POWERCHAIN_FEE_WALLET_ADDRESS,SOLANA_TOKEN_2022_PROGRAM_ID} from "@powerchain/launchpad-config";
import {PublicKey} from "@solana/web3.js";
import {enforceRateLimit} from "../../../../../../lib/rate-limit-response";
import {isSolanaAddress} from "../../../../../../lib/policy";
import {json,error,readJson} from "../../../../../../lib/http";
import {databaseConfigured,insert,patch} from "../../../../../../lib/supabase-rest";
import {buildTransaction,unavailablePlan} from "../../../../../../lib/transaction-builder";
import {buildLocalSaleActivationTransaction} from "../../../../../../lib/local-program-transaction-builder";
import {reviewPlanHash} from "../../../../../../lib/review-integrity";
import {solanaRpc} from "../../../../../../lib/solana-rpc";
import {deriveSaleProgramBinding} from "../../../../../../lib/program/operations";
import {configuredQuoteAuthorityWallet} from "../../../../../../lib/program/config";
import {assertBuilderUsesLaunchpadProgram} from "../../../../../../lib/program/validation";
import {verifyNetworkIdentity} from "../../../../../../lib/solana-network";
const MODES=new Set(["public","allowlist","trusted"]);const TOKEN_2022=SOLANA_TOKEN_2022_PROGRAM_ID;
function uint(v:unknown,n:string){if(typeof v!=="string"||!/^\d+$/.test(v)||BigInt(v)<=0n)throw new Error(`${n} must be a positive integer string`);return v}
function slug(name:string){const base=name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,50)||"sale";return `${base}-${crypto.randomUUID().slice(0,8)}`}
type RpcAccount={value:null|{owner:string;data:[string,string];executable:boolean}};
async function validateMintVault(mint:string,vault:string,vaultAuthority:string,decimals:number,allocation:string){
 const m=await solanaRpc<RpcAccount>("getAccountInfo",[mint,{encoding:"base64",commitment:"confirmed"}]);if(!m.result.value||m.result.value.owner!==TOKEN_2022||m.result.value.executable)throw new Error("Token-2022 mint validation failed");
 const mr=Buffer.from(m.result.value.data[0],"base64");if(mr.length<82||mr[45]!==1||mr[44]!==decimals)throw new Error("Token-2022 mint decimals/initialization mismatch");
 const v=await solanaRpc<RpcAccount>("getAccountInfo",[vault,{encoding:"base64",commitment:"confirmed"}]);if(!v.result.value||v.result.value.owner!==TOKEN_2022)throw new Error("Presale vault must be a Token-2022 token account");
 const vr=Buffer.from(v.result.value.data[0],"base64");if(vr.length<165||vr[108]===0)throw new Error("Presale vault is not an initialized token account");
 if(new PublicKey(vr.subarray(0,32)).toBase58()!==mint)throw new Error("Presale vault belongs to a different mint");
 const vaultOwner=new PublicKey(vr.subarray(32,64)).toBase58();if(vaultOwner!==vaultAuthority)throw new Error("Presale vault authority does not match the token account owner");
 if(vr.readBigUInt64LE(64)<BigInt(allocation))throw new Error("Presale vault does not hold the configured sale allocation");
 return {vaultOwner};
}
export async function POST(req:Request){
 try{
  const limited=await enforceRateLimit(req,"sale.draft",10);if(limited)return limited;
  const b=await readJson<Record<string,unknown>>(req);
  if(!isSolanaAddress(b.creatorWallet)||!isSolanaAddress(b.mint))return error("BAD_REQUEST","Valid creator wallet and Token-2022 mint are required");
  if(!isSolanaAddress(b.sourceVaultTokenAccount))return error("BAD_REQUEST","A valid Token-2022 presale vault token account is required");
  if(!isSolanaAddress(b.sourceVaultAuthority))return error("BAD_REQUEST","A valid presale vault authority is required");
  const paymentReceiver=isSolanaAddress(b.paymentReceiverWallet)?b.paymentReceiverWallet:String(b.creatorWallet);
  const name=typeof b.name==="string"?b.name.trim():"",symbol=typeof b.symbol==="string"?b.symbol.trim().toUpperCase():"";
  if(name.length<3||name.length>100||!/^[A-Z0-9._-]{2,12}$/.test(symbol))return error("BAD_REQUEST","Invalid sale name or symbol");
  const decimals=Number(b.decimals);if(!Number.isInteger(decimals)||decimals<0||decimals>18)return error("BAD_REQUEST","Invalid token decimals");
  const price=uint(b.priceUsdMicros,"priceUsdMicros"),allocation=uint(b.allocationBaseUnits,"allocationBaseUnits"),min=uint(b.minPurchaseUsdMicros,"minPurchaseUsdMicros"),max=uint(b.maxPurchaseUsdMicros,"maxPurchaseUsdMicros");if(BigInt(max)<BigInt(min))return error("BAD_REQUEST","Maximum purchase must be at least minimum purchase");
  const starts=Date.parse(String(b.startsAt)),ends=Date.parse(String(b.endsAt)),claims=Date.parse(String(b.claimStartsAt));if(![starts,ends,claims].every(Number.isFinite)||!(starts<ends&&ends<=claims))return error("BAD_REQUEST","Invalid sale timing");if(ends-starts>180*24*60*60*1000)return error("BAD_REQUEST","Sale duration cannot exceed 180 days");
  const mode=String(b.eligibility);if(!MODES.has(mode))return error("BAD_REQUEST","Invalid eligibility mode");const wallets=[...new Set((Array.isArray(b.wallets)?b.wallets:[]).filter((w):w is string=>typeof w==="string"))];if(mode!=="public"&&wallets.length===0)return error("BAD_REQUEST","Restricted sale requires wallet entries");if(wallets.length>100_000)return error("BAD_REQUEST","Eligibility list exceeds 100,000 wallets");if(wallets.some(w=>!isSolanaAddress(w)))return error("BAD_REQUEST","Eligibility list contains an invalid wallet");
  if(!databaseConfigured())return error("CONFIGURATION_ERROR","Supabase is not configured; sale drafts are not persisted fail-open",503);
  const vest=(b.vesting??{}) as Record<string,unknown>;const vestingEnabled=Boolean(vest.enabled),cliff=Number(vest.cliffDays??0),duration=Number(vest.durationDays??0);if(!Number.isInteger(cliff)||!Number.isInteger(duration)||cliff<0||duration<0||cliff>3650||duration>3650||vestingEnabled&&(duration===0||cliff>duration))return error("BAD_REQUEST","Invalid vesting configuration");
  const network=await verifyNetworkIdentity();
  if(network.cluster!=="mainnet-beta"&&process.env.NODE_ENV==="production")return error("CONFIGURATION_ERROR","Production sale creation requires Solana mainnet-beta",503);
  await validateMintVault(String(b.mint),String(b.sourceVaultTokenAccount),String(b.sourceVaultAuthority),decimals,allocation);
  const deliveryMode: "immediate"|"claim" = vestingEnabled?"claim":String(b.deliveryMode)==="claim"?"claim":"immediate";
  const launchpadProgramId=process.env.POWERCHAIN_LAUNCHPAD_PROGRAM_ID?.trim()??"";
  const quoteAuthorityWallet=configuredQuoteAuthorityWallet();
  if(network.cluster==="mainnet-beta"&&!isSolanaAddress(launchpadProgramId))return error("CONFIGURATION_ERROR","POWERCHAIN_LAUNCHPAD_PROGRAM_ID must be configured with the real deployed Solana program before mainnet sale creation",503);
  if(network.cluster==="mainnet-beta"&&!quoteAuthorityWallet)return error("CONFIGURATION_ERROR","POWERCHAIN_QUOTE_AUTHORITY_WALLET must be configured before mainnet sale creation",503);
  const inserted=await insert<Record<string,unknown>>("launchpad_sales",{slug:slug(name),name,mint:b.mint,symbol,decimals,phase:"draft",starts_at:new Date(starts).toISOString(),ends_at:new Date(ends).toISOString(),claim_starts_at:new Date(claims).toISOString(),price_usd_micros:price,allocation_base_units:allocation,min_purchase_usd_micros:min,max_purchase_usd_micros:max,eligibility_mode:mode,creator_wallet:b.creatorWallet,vesting_enabled:vestingEnabled,vesting_cliff_days:cliff,vesting_duration_days:duration,source_vault_token_account:b.sourceVaultTokenAccount,source_vault_authority:b.sourceVaultAuthority,payment_receiver_wallet:paymentReceiver,delivery_mode:deliveryMode,cluster:network.cluster,genesis_hash:network.genesisHash,token_program:TOKEN_2022,fee_wallet:POWERCHAIN_FEE_WALLET_ADDRESS,launchpad_program_id:launchpadProgramId||null,quote_authority_wallet:quoteAuthorityWallet||null,draft_expires_at:new Date(Date.now()+24*60*60*1000).toISOString()});
  const sale=inserted[0];if(!sale?.id)return error("INTERNAL_ERROR","Database did not return sale id",500);
  const binding=deriveSaleProgramBinding({saleId:String(sale.id),creatorWallet:String(b.creatorWallet),mint:String(b.mint)});
  await patch("launchpad_sales",`id=eq.${encodeURIComponent(String(sale.id))}`,{sale_pda:binding.salePda,vault_authority_pda:binding.vaultAuthorityPda,program_state_version:binding.stateVersion,onchain_status:"pending-initialization"});
  if(mode!=="public")await insert("launchpad_wallets",wallets.map(wallet=>({sale_id:sale.id,wallet,kind:mode})));
  const startsAt=new Date(starts).toISOString(),endsAt=new Date(ends).toISOString(),claimStartsAt=new Date(claims).toISOString();
  const vestingCliffAt=new Date(claims+(vestingEnabled?cliff:0)*24*60*60*1000).toISOString();
  const vestingEndsAt=new Date(claims+(vestingEnabled?duration:0)*24*60*60*1000).toISOString();
  let plan;
  try{
    if(String(b.sourceVaultAuthority)===String(b.creatorWallet)&&launchpadProgramId&&quoteAuthorityWallet){
      plan=await buildLocalSaleActivationTransaction({programId:launchpadProgramId,saleId:String(sale.id),creatorWallet:String(b.creatorWallet),mint:String(b.mint),sourceVaultTokenAccount:String(b.sourceVaultTokenAccount),sourceVaultAuthority:String(b.sourceVaultAuthority),paymentReceiverWallet:paymentReceiver,decimals,eligibility:mode as "public"|"allowlist"|"trusted",vestingEnabled,deliveryMode,quoteAuthorityWallet,startsAt,endsAt,claimStartsAt,vestingCliffAt,vestingEndsAt,allocationBaseUnits:allocation,priceUsdMicros:price,minPurchaseUsdMicros:min,maxPurchaseUsdMicros:max});
    }else{
      plan=await buildTransaction("sale-activation",{saleId:sale.id,creatorWallet:b.creatorWallet,mint:b.mint,symbol,decimals,allocationBaseUnits:allocation,priceUsdMicros:price,minPurchaseUsdMicros:min,maxPurchaseUsdMicros:max,startsAt,endsAt,claimStartsAt,vestingEnabled,vestingCliffDays:cliff,vestingDurationDays:duration,vestingCliffAt,vestingEndsAt,eligibility:mode,sourceVaultTokenAccount:b.sourceVaultTokenAccount,sourceVaultAuthority:b.sourceVaultAuthority,paymentReceiverWallet:paymentReceiver,quoteAuthorityWallet:quoteAuthorityWallet||undefined,powerchainFeeWallet:POWERCHAIN_FEE_WALLET_ADDRESS,launchpadProgramId:launchpadProgramId||undefined,salePda:binding.salePda,vaultAuthorityPda:binding.vaultAuthorityPda,deliveryMode});
    }
    if(plan.feePayer!==b.creatorWallet)throw new Error("builder_fee_payer_mismatch");
    assertBuilderUsesLaunchpadProgram(plan,{operation:"initialize-sale",salePda:binding.salePda});
  }catch{plan=unavailablePlan("sale-activation",String(b.creatorWallet))}
  const reviewId=crypto.randomUUID();plan.id=reviewId;const planHash=reviewPlanHash(plan);await insert("launchpad_transaction_reviews",{id:reviewId,wallet:b.creatorWallet,kind:"sale-activation",sale_id:sale.id,plan_hash:planHash,plan,expires_at:plan.expiresAt??null,status:"prepared",metadata:{mint:b.mint,allocationBaseUnits:allocation,sourceVaultTokenAccount:b.sourceVaultTokenAccount,sourceVaultAuthority:b.sourceVaultAuthority,paymentReceiverWallet:paymentReceiver,quoteAuthorityWallet:quoteAuthorityWallet||undefined,powerchainFeeWallet:POWERCHAIN_FEE_WALLET_ADDRESS,launchpadProgramId:launchpadProgramId||undefined,salePda:binding.salePda,vaultAuthorityPda:binding.vaultAuthorityPda,deliveryMode}});
  return json({sale:{id:String(sale.id),status:"draft",name,mint:b.mint,deliveryMode,cluster:network.cluster,genesisHash:network.genesisHash,salePda:binding.salePda,vaultAuthorityPda:binding.vaultAuthorityPda},plan},{status:201});
 }catch(e){return error("BAD_REQUEST",e instanceof Error?e.message:"Unable to create sale draft")}
}
