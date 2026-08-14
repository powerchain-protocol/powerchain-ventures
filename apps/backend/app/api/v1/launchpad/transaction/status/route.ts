import {error,json} from "../../../../../../lib/http";
import {isSolanaAddress} from "../../../../../../lib/policy";
import {select} from "../../../../../../lib/supabase-rest";
export async function GET(req:Request){
 const u=new URL(req.url),reviewId=u.searchParams.get("reviewId")??"",wallet=u.searchParams.get("wallet")??"";
 if(!/^[0-9a-f-]{36}$/i.test(reviewId)||!isSolanaAddress(wallet))return error("BAD_REQUEST","Invalid transaction status request");
 const rows=await select<Record<string,unknown>>("launchpad_transaction_reviews",`id=eq.${encodeURIComponent(reviewId)}&wallet=eq.${encodeURIComponent(wallet)}&select=id,kind,status,settlement_stage,submitted_signature,confirmation_attempts,last_confirmation_check_at,next_confirmation_check_at,last_confirmation_error,confirmed_slot,confirmed_at,expires_at&limit=1`);
 const row=rows[0];if(!row)return error("BAD_REQUEST","Transaction review not found",404);
 return json({review:row});
}
