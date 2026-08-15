import {enforceRateLimit} from "../../../../../../../lib/rate-limit-response";
import {error,json,readJson} from "../../../../../../../lib/http";
import {isSolanaAddress} from "../../../../../../../lib/policy";
import {databaseConfigured,insert,select} from "../../../../../../../lib/supabase-rest";
import {buildLocalCreatorTransaction} from "../../../../../../../lib/local-program-transaction-builder";
import {reviewPlanHash} from "../../../../../../../lib/review-integrity";
import {assertBuilderUsesLaunchpadProgram} from "../../../../../../../lib/program/validation";
import {configuredLaunchpadProgramId} from "../../../../../../../lib/program/config";
import {attachFeePolicy} from "../../../../../../../lib/fee-policy";

type Action="cancel"|"complete";
type Sale={id:string;creator_wallet:string;phase:string;name:string;mint:string;symbol?:string;launchpad_program_id:string|null;sale_pda:string|null};
const allowed=new Set<Action>(["cancel","complete"]);

export async function POST(req:Request){
 try{
  const limited=await enforceRateLimit(req,"sale.action.prepare",20);if(limited)return limited;
  if(!databaseConfigured())return error("CONFIGURATION_ERROR","Supabase is not configured",503);
  const b=await readJson<{creatorWallet?:unknown;saleId?:unknown;action?:unknown}>(req);
  if(!isSolanaAddress(b.creatorWallet)||typeof b.saleId!=="string"||typeof b.action!=="string"||!allowed.has(b.action as Action))return error("BAD_REQUEST","Valid creatorWallet, saleId and action are required");
  const action=b.action as Action;
  const rows=await select<Sale>("launchpad_sales",`select=id,creator_wallet,phase,name,mint,symbol,launchpad_program_id,sale_pda&id=eq.${encodeURIComponent(b.saleId)}&limit=1`);
  const sale=rows[0];if(!sale)return error("BAD_REQUEST","Sale not found",404);
  if(sale.creator_wallet!==b.creatorWallet)return error("UNAUTHORIZED","Connected wallet is not the sale creator",403);
  if(action==="cancel"&&["cancelled","completed"].includes(sale.phase))return error("BAD_REQUEST",`Sale is already ${sale.phase}`,409);
  if(action==="complete"&&!['ended','claimable','completed'].includes(sale.phase))return error("BAD_REQUEST","Sale must be ended or claimable before completion",409);
  const kind=action==="cancel"?"sale-cancel":"sale-complete";
  const live=await select<{id:string}>("launchpad_transaction_reviews",`select=id&sale_id=eq.${encodeURIComponent(sale.id)}&wallet=eq.${encodeURIComponent(b.creatorWallet)}&kind=eq.${kind}&status=in.(prepared,submitted)&limit=1`);
  if(live[0])return error("BAD_REQUEST","A creator action transaction is already pending for this sale",409);
  const programId=configuredLaunchpadProgramId();
  if(!programId||sale.launchpad_program_id!==programId||!sale.sale_pda)return error("CONFIGURATION_ERROR","Sale is not bound to the configured PowerChain Launchpad program",503);
  const plan=attachFeePolicy(await buildLocalCreatorTransaction({action,wallet:b.creatorWallet,programId,salePda:sale.sale_pda}),"creator");
  if(plan.feePayer!==b.creatorWallet)throw new Error("builder_fee_payer_mismatch");
  assertBuilderUsesLaunchpadProgram(plan,{operation:action==="cancel"?"cancel":"complete",salePda:sale.sale_pda});
  const reviewId=crypto.randomUUID();plan.id=reviewId;const planHash=reviewPlanHash(plan);
  await insert("launchpad_transaction_reviews",{id:reviewId,wallet:b.creatorWallet,kind,sale_id:sale.id,plan_hash:planHash,plan,expires_at:plan.expiresAt??null,status:"prepared",metadata:{action,programId,salePda:sale.sale_pda}});
  return json({sale:{id:sale.id,name:sale.name,phase:sale.phase},action,plan},{status:201});
 }catch(e){return error("INTERNAL_ERROR",e instanceof Error?e.message:"Unable to prepare creator action",500)}
}
