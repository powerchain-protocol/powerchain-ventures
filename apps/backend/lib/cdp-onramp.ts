import { generateJwt } from "@coinbase/cdp-sdk/auth";
import { PowerChainError } from "@powerchain/utils/utils/errors";
import { isSolanaAddress } from "./policy";

const V2_HOST = "api.cdp.coinbase.com";
const V2_SESSION_PATH = "/platform/v2/onramp/sessions";
const V2_SESSION_URL = `https://${V2_HOST}${V2_SESSION_PATH}`;
const V1_HOST = "api.developer.coinbase.com";

function env(name:string){return (process.env[name]??"").trim()}
function flag(name:string){return /^(1|true|yes)$/i.test(env(name))}

export function cdpOnrampEnabled(){
  return flag("POWERCHAIN_COINBASE_ONRAMP_ENABLED")
    && flag("CDP_ONRAMP_ENABLED");
}
export function cdpOnrampConfigured(){
  return cdpOnrampEnabled()
    && Boolean(env("CDP_API_KEY_ID")&&env("CDP_API_KEY_SECRET"));
}
export function cdpOnrampStatus(){return {enabled:cdpOnrampEnabled(),configured:cdpOnrampConfigured(),provider:"coinbase-hosted",network:"solana",asset:"SOL",guestCheckoutSupported:false,headlessRecommendedForCardAndApplePay:true}}

async function jwt(method:"GET"|"POST",host:string,path:string){
 const apiKeyId=env("CDP_API_KEY_ID"),apiKeySecret=env("CDP_API_KEY_SECRET");
 if(!apiKeyId||!apiKeySecret)throw new PowerChainError("CONFIGURATION_ERROR","Coinbase CDP Secret API Key is not configured");
 return generateJwt({apiKeyId,apiKeySecret,requestMethod:method,requestHost:host,requestPath:path,expiresIn:120});
}

function safePartnerUserRef(value:string){const v=value.trim();if(!/^[A-Za-z0-9._:-]{8,50}$/.test(v))throw new PowerChainError("BAD_REQUEST","partnerUserRef is invalid");return v}
function safeAmount(value:string){const v=value.trim();if(!/^\d+(?:\.\d{1,2})?$/.test(v))throw new PowerChainError("BAD_REQUEST","Fiat amount must have at most two decimal places");const n=Number(v);if(!Number.isFinite(n)||n<5||n>100000)throw new PowerChainError("BAD_REQUEST","Fiat amount is outside the supported PowerChain onramp range");return n.toFixed(2)}
function safeRedirect(value:string){let u:URL;try{u=new URL(value)}catch{throw new PowerChainError("CONFIGURATION_ERROR","CDP_ONRAMP_REDIRECT_URL must be an absolute URL")};if(process.env.NODE_ENV==="production"&&u.protocol!=="https:")throw new PowerChainError("CONFIGURATION_ERROR","Production Onramp redirect URL must use HTTPS");return u.toString()}

export type CreateOnrampInput={wallet:string;paymentAmount:string;partnerUserRef:string;saleId?:string;clientIp?:string};
export async function createCoinbaseOnrampSession(input:CreateOnrampInput){
 if(!cdpOnrampConfigured())throw new PowerChainError("CONFIGURATION_ERROR","Coinbase-hosted Onramp is not configured");
 if(!isSolanaAddress(input.wallet))throw new PowerChainError("BAD_REQUEST","Destination wallet must be a valid Solana address");
 const paymentAmount=safeAmount(input.paymentAmount),partnerUserRef=safePartnerUserRef(input.partnerUserRef);
 const redirectBase=safeRedirect(env("CDP_ONRAMP_REDIRECT_URL")||"http://localhost:3002/onramp-return");
 const redirect=new URL(redirectBase);
 if(input.saleId)redirect.searchParams.set("saleId",input.saleId);
 const redirectUrl=redirect.toString();
 const token=await jwt("POST",V2_HOST,V2_SESSION_PATH);
 const body={purchaseCurrency:"SOL",destinationNetwork:"solana",destinationAddress:input.wallet,paymentAmount,paymentCurrency:"USD",redirectUrl,partnerUserRef,...(input.clientIp?{clientIp:input.clientIp}:{})};
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12_000);
 try{
  const response=await fetch(V2_SESSION_URL,{method:"POST",headers:{authorization:`Bearer ${token}`,"content-type":"application/json"},body:JSON.stringify(body),cache:"no-store",signal:controller.signal});
  const result=await response.json().catch(()=>({})) as {session?:{onrampUrl?:string};quote?:unknown;message?:string;error?:unknown};
  if(!response.ok)throw new PowerChainError(response.status===429?"RATE_LIMITED":"RPC_UNAVAILABLE",result.message||`Coinbase Onramp returned HTTP ${response.status}`);
  const onrampUrl=result.session?.onrampUrl;if(!onrampUrl||!onrampUrl.startsWith("https://pay.coinbase.com/"))throw new PowerChainError("RPC_UNAVAILABLE","Coinbase Onramp returned an invalid session URL");
  return {onrampUrl,quote:result.quote??null,partnerUserRef,paymentAmount,expiresInSeconds:300};
 }finally{clearTimeout(timer)}
}

export async function getCoinbaseOnrampTransactions(partnerUserRefValue:string,pageSize=20){
 if(!cdpOnrampConfigured())throw new PowerChainError("CONFIGURATION_ERROR","Coinbase-hosted Onramp is not configured");
 const partnerUserRef=safePartnerUserRef(partnerUserRefValue);const size=Math.max(1,Math.min(100,Math.trunc(pageSize)||20));
 const path=`/onramp/v1/buy/user/${encodeURIComponent(partnerUserRef)}/transactions`;const token=await jwt("GET",V1_HOST,path);
 const response=await fetch(`https://${V1_HOST}${path}?pageSize=${size}`,{headers:{authorization:`Bearer ${token}`},cache:"no-store"});
 const result=await response.json().catch(()=>({})) as Record<string,unknown>;
 if(!response.ok)throw new PowerChainError(response.status===429?"RATE_LIMITED":"RPC_UNAVAILABLE",`Coinbase Onramp transaction status returned HTTP ${response.status}`);
 const raw=Array.isArray(result.transactions)?result.transactions:[];
 return {transactions:raw.map((item:unknown)=>{const t=(item&&typeof item==="object"?item:{}) as Record<string,unknown>;return {status:t.status??null,purchaseCurrency:t.purchase_currency??null,purchaseNetwork:t.purchase_network??null,purchaseAmount:t.purchase_amount??null,paymentTotal:t.payment_total??null,coinbaseFee:t.coinbase_fee??null,networkFee:t.network_fee??null,txHash:t.tx_hash??null,transactionId:t.transaction_id??null,createdAt:t.created_at??null,walletAddress:t.wallet_address??null}}),nextPageKey:result.next_page_key??null,totalCount:result.total_count??raw.length};
}
