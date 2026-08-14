import {error,json,readJson} from "../../../../../lib/http";
import {enforceRateLimit} from "../../../../../lib/rate-limit-response";
import {databaseConfigured,insert,select,patch} from "../../../../../lib/supabase-rest";
import {requireSolanaAddress,requirePositiveBigInt} from "../../../../../lib/validate";
import {buildWalletTransferPlan,type TransferAsset} from "../../../../../lib/wallet-transfer";
import {reviewPlanHash} from "../../../../../lib/review-integrity";

export async function POST(request:Request){try{
  const limited=await enforceRateLimit(request,"wallet.transfer.prepare",20);if(limited)return limited;if(!databaseConfigured())return error("CONFIGURATION_ERROR","Launchpad database is not configured",503);
  const body=await readJson<Record<string,unknown>>(request);const wallet=requireSolanaAddress(body.wallet,"wallet"),recipient=requireSolanaAddress(body.recipient,"recipient");const asset=String(body.asset??"").toUpperCase() as TransferAsset;if(asset!=="SOL"&&asset!=="PWRC")return error("BAD_REQUEST","asset must be SOL or PWRC");const amount=requirePositiveBigInt(body.amountBaseUnits,"amountBaseUnits").toString();
  const live=await select<{id:string;expires_at:string|null}>("launchpad_transaction_reviews",`select=id,expires_at&wallet=eq.${encodeURIComponent(wallet)}&kind=eq.wallet-transfer&status=in.(prepared,submitted)&limit=1`);const current=live[0];if(current){if(current.expires_at&&Date.parse(current.expires_at)<=Date.now())await patch("launchpad_transaction_reviews",`id=eq.${current.id}`,{status:"expired",settlement_stage:"expired"});else return error("BAD_REQUEST","A wallet transfer is already awaiting completion",409)}
  const {plan,contract}=await buildWalletTransferPlan({asset,wallet,recipient,amountBaseUnits:amount});const reviewId=crypto.randomUUID();plan.id=reviewId;const planHash=reviewPlanHash(plan);
  await insert("launchpad_transaction_reviews",{id:reviewId,wallet,kind:"wallet-transfer",sale_id:null,plan_hash:planHash,plan,expires_at:plan.expiresAt??null,status:"prepared",metadata:{transfer:contract}});
  return json({plan,transfer:contract});
}catch(e){return error("BAD_REQUEST",e instanceof Error?e.message:"Unable to prepare transfer",400)}}
