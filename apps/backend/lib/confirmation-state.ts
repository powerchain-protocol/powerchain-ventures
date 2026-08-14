import {rpc} from "./supabase-rest";
export type SettlementStage="prepared"|"submitted"|"chain-confirmed"|"payment-verified"|"delivery-verified"|"settled"|"failed"|"expired";
export async function markConfirmationAttempt(reviewId:string,errorMessage:string|null=null){
 return rpc<Array<{attempts:number;next_check_at:string}>>("launchpad_mark_confirmation_attempt",{p_review_id:reviewId,p_error:errorMessage});
}
export async function markSettlementStage(reviewId:string,stage:SettlementStage,extra:Record<string,unknown>={}){
 const status=typeof extra.status==="string"?extra.status:null;
 const lastError=typeof extra.last_confirmation_error==="string"?extra.last_confirmation_error:null;
 const result=await rpc<Array<{settlement_stage:string;status:string}>>("launchpad_advance_review_stage",{p_review_id:reviewId,p_stage:stage,p_status:status,p_error:lastError});
 // The transition itself is DB-enforced. Callers that need to persist evidence fields
 // (signature, slot, hashes) continue doing so in their confirmation route.
 return result;
}
