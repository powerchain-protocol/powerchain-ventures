import {error,json} from "../../../../../lib/http";
import {isSolanaAddress} from "../../../../../lib/policy";
import {databaseConfigured,rpc,select} from "../../../../../lib/supabase-rest";

type SaleRow={id:string;slug:string;name:string;mint:string;symbol?:string;decimals?:number;phase:string;starts_at:string;ends_at:string;claim_starts_at:string;price_usd_micros:string;allocation_base_units:string;creator_wallet:string;created_at:string;sale_pda:string|null;vault_authority_pda:string|null;launchpad_program_id:string|null;onchain_status:string|null};
type PurchaseRow={sale_id:string;usd_micros:string;token_base_units:string;status:string;wallet:string};
type ClaimRow={sale_id:string;amount_base_units:string};

export async function GET(req:Request){
 try{
  if(!databaseConfigured())return error("CONFIGURATION_ERROR","Supabase is not configured",503);
  const u=new URL(req.url);const wallet=u.searchParams.get("creatorWallet")?.trim();
  if(!isSolanaAddress(wallet))return error("BAD_REQUEST","A valid creatorWallet is required",400);
  await rpc("launchpad_refresh_sale_phases",{});
  const sales=await select<SaleRow>("launchpad_sales",`select=id,slug,name,mint,symbol,decimals,phase,starts_at,ends_at,claim_starts_at,price_usd_micros,allocation_base_units,creator_wallet,created_at,sale_pda,vault_authority_pda,launchpad_program_id,onchain_status&creator_wallet=eq.${encodeURIComponent(wallet)}&phase=neq.draft&order=created_at.desc&limit=100`);
  if(!sales.length)return json({sales:[],summary:{raisedUsdMicros:"0",participants:0,saleCount:0,activeSales:0}});
  const ids=sales.map(s=>s.id).join(",");
  const purchases=await select<PurchaseRow>("launchpad_purchases",`select=sale_id,usd_micros,token_base_units,status,wallet&sale_id=in.(${ids})&status=eq.confirmed&limit=10000`);
  const claims=await select<ClaimRow>("launchpad_claims",`select=sale_id,amount_base_units&sale_id=in.(${ids})&limit=10000`);
  const bySale=new Map<string,{raised:bigint;allocated:bigint;claimed:bigint;wallets:Set<string>}>();
  for(const s of sales)bySale.set(s.id,{raised:0n,allocated:0n,claimed:0n,wallets:new Set()});
  for(const p of purchases){const v=bySale.get(p.sale_id);if(!v)continue;v.raised+=BigInt(p.usd_micros);v.allocated+=BigInt(p.token_base_units);v.wallets.add(p.wallet)}
  for(const c of claims){const v=bySale.get(c.sale_id);if(v)v.claimed+=BigInt(c.amount_base_units)}
  const enriched=sales.map(s=>{const v=bySale.get(s.id)!;return {...s,metrics:{raisedUsdMicros:v.raised.toString(),soldBaseUnits:v.allocated.toString(),claimedBaseUnits:v.claimed.toString(),participants:v.wallets.size}}});
  const uniqueParticipants=new Set(purchases.map(p=>p.wallet));
  const raisedUsdMicros=enriched.reduce((sum,s)=>sum+BigInt(s.metrics.raisedUsdMicros),0n).toString();
  const activeSales=sales.filter(s=>["scheduled","private","public","ended","claimable"].includes(s.phase)).length;
  const summary={raisedUsdMicros,participants:uniqueParticipants.size,saleCount:sales.length,activeSales};
  return json({sales:enriched,summary});
 }catch(e){return error("INTERNAL_ERROR",e instanceof Error?e.message:"Unable to load creator sales",500)}
}
