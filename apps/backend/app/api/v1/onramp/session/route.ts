import {createCoinbaseOnrampSession} from "../../../../../lib/cdp-onramp";
import {errorFromUnknown,json,readJson,requestId} from "../../../../../lib/http";
import {consumeRateLimit} from "../../../../../lib/rate-limit";
import {safeActionContext} from "../../../../../lib/safe-actions";
import {databaseConfigured,insert} from "../../../../../lib/supabase-rest";

function trustedClientIp(request:Request){return request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()||request.headers.get("x-real-ip")?.trim()||undefined}
function partnerRef(){return `pc-${crypto.randomUUID()}`}
export async function POST(request:Request){const rid=requestId(request);try{const body=await readJson<Record<string,unknown>>(request);const ctx=safeActionContext(request,body.wallet,{requireIdempotency:true});const limit=await consumeRateLimit(request,"onramp-session",10);if(!limit.allowed)return json({ok:false,error:{code:"RATE_LIMITED",message:"Too many Onramp session requests"}},{status:429,headers:{"retry-after":"60"}},rid);const saleId=String(body.saleId??"").trim();if(!/^[0-9a-f-]{36}$/i.test(saleId))throw new Error("saleId is required");const paymentAmount=String(body.paymentAmount??"");const result=await createCoinbaseOnrampSession({wallet:ctx.wallet,paymentAmount,partnerUserRef:partnerRef(),clientIp:trustedClientIp(request)});if(databaseConfigured())await insert("launchpad_onramp_sessions",{partner_user_ref:result.partnerUserRef,wallet:ctx.wallet,sale_id:saleId,requested_payment_amount:result.paymentAmount});return json({ok:true,provider:"coinbase-hosted",destination:{wallet:ctx.wallet,network:"solana",asset:"SOL"},...result},{status:201},rid)}catch(e){return errorFromUnknown(e,rid)}}
