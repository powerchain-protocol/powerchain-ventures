import {enforceRateLimit} from "../../../../../../../lib/rate-limit-response";
import {error,json,readJson} from "../../../../../../../lib/http";
import {isSolanaAddress} from "../../../../../../../lib/policy";
import {audit} from "../../../../../../../lib/audit";
import {assertStoredPlanIntegrity} from "../../../../../../../lib/review-integrity";
import {verifySignature} from "../../../../../../../lib/solana-confirmation";
import {verifyTransactionMatchesPrepared} from "../../../../../../../lib/solana-transaction-integrity";
import {databaseConfigured,patch,rpc,select,insert} from "../../../../../../../lib/supabase-rest";
import type {BuilderPlan} from "../../../../../../../lib/transaction-builder";
import {readSaleProgramState} from "../../../../../../../lib/program/accounts";

const SIG=/^[1-9A-HJ-NP-Za-km-z]{64,100}$/;
type Action="cancel"|"complete";
export async function POST(req:Request){
 try{
  const limited=await enforceRateLimit(req,"sale.action.confirm",40);if(limited)return limited;
  if(!databaseConfigured())return error("CONFIGURATION_ERROR","Supabase is not configured",503);
  const b=await readJson<{creatorWallet?:unknown;saleId?:unknown;reviewId?:unknown;signature?:unknown;action?:unknown}>(req);
  if(!isSolanaAddress(b.creatorWallet)||typeof b.saleId!=="string"||typeof b.reviewId!=="string"||typeof b.signature!=="string"||!SIG.test(b.signature)||!['cancel','complete'].includes(String(b.action)))return error("BAD_REQUEST","Invalid creator action confirmation payload");
  const action=b.action as Action,kind=action==="cancel"?"sale-cancel":"sale-complete";
  const reviews=await select<Record<string,unknown>>("launchpad_transaction_reviews",`select=id,wallet,sale_id,status,expires_at,submitted_signature,plan_hash,plan,metadata&id=eq.${encodeURIComponent(b.reviewId)}&wallet=eq.${encodeURIComponent(b.creatorWallet)}&kind=eq.${kind}&limit=1`);
  const review=reviews[0];if(!review||String(review.sale_id)!==b.saleId)return error("BAD_REQUEST","Prepared creator action review not found",404);
  if(String(review.status)==="confirmed")return json({accepted:true,status:"confirmed",signature:String(review.submitted_signature??b.signature),phase:action==="cancel"?"cancelled":"completed",idempotent:true});
  if(review.submitted_signature&&String(review.submitted_signature)!==b.signature)return error("BAD_REQUEST","Review is already bound to a different signature",409);
  if(review.expires_at&&Date.parse(String(review.expires_at))<Date.now()){await patch("launchpad_transaction_reviews",`id=eq.${encodeURIComponent(b.reviewId)}`,{status:"expired"});return error("QUOTE_EXPIRED","Prepared creator action transaction expired",409)}
  if(!review.plan||typeof review.plan!=="object")return error("INTERNAL_ERROR","Prepared transaction payload is missing",500);
  try{assertStoredPlanIntegrity(review.plan as BuilderPlan,String(review.plan_hash??""))}catch{return error("INTERNAL_ERROR","Prepared transaction integrity check failed",500)}
  const chain=await verifySignature(b.signature);if(!chain.ok){await patch("launchpad_transaction_reviews",`id=eq.${encodeURIComponent(b.reviewId)}`,{submitted_signature:b.signature,status:chain.status==="failed"?"failed":"submitted"});return json({accepted:true,status:chain.status,signature:b.signature},{status:202})}const txMatch=await verifyTransactionMatchesPrepared(b.signature,(review.plan as BuilderPlan).serializedTransactionBase64??"");if(!txMatch.ok){await patch("launchpad_transaction_reviews",`id=eq.${encodeURIComponent(b.reviewId)}`,{submitted_signature:b.signature,status:txMatch.status==="transaction_failed"?"failed":"submitted"});return error("BAD_REQUEST",`Confirmed signature does not match the reviewed transaction (${txMatch.status})`,409)}const meta=(review.metadata??{}) as Record<string,unknown>;const salePda=String(meta.salePda??""),programId=String(meta.programId??"");if(!salePda||!programId)return error("INTERNAL_ERROR","Prepared program action metadata missing",500);const onchain=await readSaleProgramState(salePda);const expectedStatus=action==="cancel"?2:3;if(!onchain.state||onchain.state.status!==expectedStatus)return error("BAD_REQUEST","Confirmed transaction did not apply the expected on-chain sale state",409);
  let phase:string;try{const result=await rpc<string|Array<Record<string,unknown>>>("launchpad_apply_sale_action",{p_sale_id:b.saleId,p_creator_wallet:b.creatorWallet,p_action:action});phase=typeof result==="string"?result:String(Array.isArray(result)?Object.values(result[0]??{})[0]??"":"")}catch(e){return error("BAD_REQUEST",e instanceof Error?e.message:"Sale action rejected by settlement policy",409)}
  await patch("launchpad_sales",`id=eq.${encodeURIComponent(b.saleId)}`,{onchain_status:phase});await patch("launchpad_transaction_reviews",`id=eq.${encodeURIComponent(b.reviewId)}`,{submitted_signature:b.signature,status:"confirmed",confirmed_slot:chain.slot,confirmed_message_hash:txMatch.messageHash,confirmed_rpc_endpoint:txMatch.endpoint,confirmed_at:new Date().toISOString()});await insert("launchpad_program_operations",{review_id:b.reviewId,sale_id:b.saleId,wallet:b.creatorWallet,operation:action,program_id:programId,sale_pda:salePda,instruction_data_base64:(review.plan as BuilderPlan).programOperation?.instructionDataBase64??null,signature:b.signature,status:"confirmed",confirmed_slot:chain.slot,confirmed_at:new Date().toISOString()});
  await audit(b.creatorWallet,action==="cancel"?"sale.cancelled":"sale.completed","sale",b.saleId,{reviewId:b.reviewId,signature:b.signature,slot:chain.slot,phase,messageHash:txMatch.messageHash,rpcEndpoint:txMatch.endpoint});
  return json({accepted:true,status:chain.status,signature:b.signature,slot:chain.slot,phase,messageHash:txMatch.messageHash,rpcEndpoint:txMatch.endpoint});
 }catch(e){return error("INTERNAL_ERROR",e instanceof Error?e.message:"Unable to confirm creator action",500)}
}
