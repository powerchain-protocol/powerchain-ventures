import {error,json} from "../../../../../lib/http";
import {databaseConfigured,rpc,select} from "../../../../../lib/supabase-rest";

type SaleRow={
  id:string;slug:string;name:string;mint:string;symbol:string;decimals:number;phase:string;cluster:string;genesis_hash:string|null;token_program:string|null;launchpad_program_id:string|null;sale_pda:string|null;vault_authority_pda:string|null;onchain_status:string|null;
  starts_at:string;ends_at:string;claim_starts_at:string;price_usd_micros:string;
  allocation_base_units:string;sold_base_units:string;min_purchase_usd_micros:string;
  max_purchase_usd_micros:string;eligibility_mode:"public"|"allowlist"|"trusted";
  service_fee_bps:number;vesting_enabled:boolean;vesting_cliff_days:number;vesting_duration_days:number;delivery_mode:"immediate"|"claim";source_vault_token_account:string|null;payment_receiver_wallet:string|null;
};
type PurchaseRow={sale_id:string;wallet:string;usd_micros:string;token_base_units:string};
const visiblePhases=["scheduled","private","public","ended","claimable","completed"];
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(req:Request){
 try{
  if(!databaseConfigured())return error("CONFIGURATION_ERROR","Launchpad database is not configured",503);
  await rpc("launchpad_refresh_sale_phases",{});
  const u=new URL(req.url);const saleId=u.searchParams.get("saleId")?.trim();
  if(saleId&&!UUID.test(saleId))return error("BAD_REQUEST","Invalid saleId");
  const filter=saleId?`id=eq.${encodeURIComponent(saleId)}`:`phase=in.(${visiblePhases.join(",")})`;
  const sales=await select<SaleRow>("launchpad_sales",`select=id,slug,name,mint,symbol,decimals,phase,cluster,genesis_hash,token_program,launchpad_program_id,sale_pda,vault_authority_pda,onchain_status,starts_at,ends_at,claim_starts_at,price_usd_micros,allocation_base_units,sold_base_units,min_purchase_usd_micros,max_purchase_usd_micros,eligibility_mode,service_fee_bps,vesting_enabled,vesting_cliff_days,vesting_duration_days,delivery_mode,source_vault_token_account,payment_receiver_wallet&${filter}&order=starts_at.asc&limit=100`);
  if(saleId&&!sales[0])return error("BAD_REQUEST","Sale not found",404);
  const ids=sales.map(s=>s.id);let purchases:PurchaseRow[]=[];
  if(ids.length)purchases=await select<PurchaseRow>("launchpad_purchases",`select=sale_id,wallet,usd_micros,token_base_units&sale_id=in.(${ids.join(",")})&status=eq.confirmed&limit=10000`);
  const metrics=new Map<string,{raised:bigint;sold:bigint;participants:Set<string>}>();
  for(const s of sales)metrics.set(s.id,{raised:0n,sold:0n,participants:new Set()});
  for(const p of purchases){const m=metrics.get(p.sale_id);if(!m)continue;m.raised+=BigInt(p.usd_micros);m.sold+=BigInt(p.token_base_units);m.participants.add(p.wallet)}
  return json({sales:sales.map(s=>{const m=metrics.get(s.id)!;return {...s,metrics:{raisedUsdMicros:m.raised.toString(),soldBaseUnits:m.sold.toString(),participants:m.participants.size}}})});
 }catch(e){return error("INTERNAL_ERROR",e instanceof Error?e.message:"Unable to load sale catalog",500)}
}
