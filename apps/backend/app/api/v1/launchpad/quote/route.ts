import {error,json,readJson} from "../../../../../lib/http";
import {databaseConfigured} from "../../../../../lib/supabase-rest";
import {assertEligible,confirmedWalletSpend,loadSale} from "../../../../../lib/sale-access";
import {fee,isSolanaAddress,parsePositiveBigInt,quote} from "../../../../../lib/policy";
import {enforceRateLimit} from "../../../../../lib/rate-limit-response";

export async function POST(req:Request){
 try{
  if(!databaseConfigured())return error("CONFIGURATION_ERROR","Supabase is not configured",503);
  const limited=await enforceRateLimit(req,"quote",60);if(limited)return limited;
  const b=await readJson<{saleId?:unknown;wallet?:unknown;usdMicros?:unknown}>(req);
  if(typeof b.saleId!=="string")return error("BAD_REQUEST","saleId is required");
  const usd=parsePositiveBigInt(b.usdMicros,"usdMicros");
  const sale=await loadSale(b.saleId);
  const now=Date.now(),start=Date.parse(sale.starts_at),end=Date.parse(sale.ends_at);
  if(![start,end].every(Number.isFinite)||now<start||now>=end||!(sale.phase==="public"||sale.phase==="private"))return error("SALE_CLOSED","Sale is not active",409);
  const min=BigInt(sale.min_purchase_usd_micros),max=BigInt(sale.max_purchase_usd_micros);
  if(usd<min||usd>max)return error("BAD_REQUEST","Requested quote is outside sale limits");
  let spent=0n;
  if(sale.eligibility_mode!=="public"){
    if(!isSolanaAddress(b.wallet))return error("NOT_ELIGIBLE","A valid eligible wallet is required for this sale",403);
    await assertEligible(sale,b.wallet);
    spent=await confirmedWalletSpend(sale.id,b.wallet);
  }else if(isSolanaAddress(b.wallet)){
    spent=await confirmedWalletSpend(sale.id,b.wallet);
  }
  if(spent+usd>max)return error("BAD_REQUEST","Wallet purchase limit would be exceeded",409);
  const q=quote(usd,BigInt(sale.price_usd_micros),sale.decimals);
  if(BigInt(sale.sold_base_units)+q.tokenBaseUnits>BigInt(sale.allocation_base_units))return error("SALE_CLOSED","Sale allocation is exhausted",409);
  const serviceFee=fee(usd,250n);
  if(q.serviceFeeUsdMicros!==serviceFee)throw new Error("powerchain_service_fee_mismatch");
  return json({
    saleId:sale.id,mint:sale.mint,symbol:sale.symbol,decimals:sale.decimals,
    priceUsdMicros:sale.price_usd_micros,usdMicros:usd.toString(),tokenBaseUnits:q.tokenBaseUnits.toString(),
    serviceFeeBps:250,serviceFeeUsdMicros:q.serviceFeeUsdMicros.toString(),totalUsdMicros:q.totalUsdMicros.toString(),
    expiresInSeconds:Number(process.env.QUOTE_TTL_SECONDS??"60")
  });
 }catch(e){
  const m=e instanceof Error?e.message:"Unable to create quote";
  if(m==="wallet_not_eligible")return error("NOT_ELIGIBLE","Wallet is not eligible",403);
  return error("BAD_REQUEST",m);
 }
}
