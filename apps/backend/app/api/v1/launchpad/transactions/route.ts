import {error,json} from "../../../../../lib/http";
import {isSolanaAddress} from "../../../../../lib/policy";
import {select} from "../../../../../lib/supabase-rest";
import {explorerTransactionUrl,safeReceiptPlan} from "../../../../../lib/transaction-receipt";
const kinds=new Set(["purchase","claim","sale-activation","sale-cancel","sale-complete","program-pause","program-resume","program-update-timing","wallet-transfer"]);
const stages=new Set(["prepared","submitted","chain-confirmed","payment-verified","delivery-verified","settled","failed","expired"]);
export async function GET(req:Request){
 const u=new URL(req.url),wallet=u.searchParams.get("wallet")??"";if(!isSolanaAddress(wallet))return error("BAD_REQUEST","Invalid wallet");
 const kind=u.searchParams.get("kind")??"",stage=u.searchParams.get("stage")??"";const limit=Math.max(1,Math.min(100,Number(u.searchParams.get("limit")??50)||50));
 if(kind&&!kinds.has(kind))return error("BAD_REQUEST","Invalid transaction kind");if(stage&&!stages.has(stage))return error("BAD_REQUEST","Invalid settlement stage");
 let q=`wallet=eq.${encodeURIComponent(wallet)}&select=id,sale_id,kind,status,settlement_stage,submitted_signature,confirmation_attempts,last_confirmation_error,confirmed_slot,confirmed_at,expires_at,created_at,confirmed_message_hash,confirmed_rpc_endpoint,plan&order=created_at.desc&limit=${limit}`;
 if(kind)q+=`&kind=eq.${encodeURIComponent(kind)}`;if(stage)q+=`&settlement_stage=eq.${encodeURIComponent(stage)}`;
 const rows=await select<Record<string,unknown>>("launchpad_transaction_reviews",q);
 return json({transactions:rows.map(r=>{const plan=safeReceiptPlan(r.plan),signature=String(r.submitted_signature??"");return {id:r.id,saleId:r.sale_id,kind:r.kind,status:r.status,settlementStage:r.settlement_stage,signature:signature||undefined,explorerUrl:signature?explorerTransactionUrl(signature,plan.cluster):undefined,confirmationAttempts:r.confirmation_attempts,lastError:r.last_confirmation_error,confirmedSlot:r.confirmed_slot,confirmedAt:r.confirmed_at,expiresAt:r.expires_at,createdAt:r.created_at,confirmedMessageHash:r.confirmed_message_hash,confirmedRpcEndpoint:r.confirmed_rpc_endpoint,...plan}}),filters:{kind:kind||null,stage:stage||null,limit}});
}
