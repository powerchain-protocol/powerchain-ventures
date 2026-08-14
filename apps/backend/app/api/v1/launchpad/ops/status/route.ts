import {error,json} from "../../../../../../lib/http";
import {databaseConfigured,select} from "../../../../../../lib/supabase-rest";
import {rpcHealth} from "../../../../../../lib/solana-rpc";
import {reconciliationAuthorized,reconciliationSecret} from "../../../../../../lib/reconciliation-auth";

export async function GET(req:Request){
 if(!reconciliationSecret())return error("CONFIGURATION_ERROR","Operations status is not configured",503);
 if(!reconciliationAuthorized(req))return error("UNAUTHORIZED","Unauthorized",401);
 if(!databaseConfigured())return error("CONFIGURATION_ERROR","Supabase is not configured",503);
 try{
  const [chain,reviews,sales,leases,audits]=await Promise.all([
   rpcHealth(),
   select<{status:string;settlement_stage:string;kind:string;confirmation_attempts:number;next_confirmation_check_at:string|null}>("launchpad_transaction_reviews","select=status,settlement_stage,kind,confirmation_attempts,next_confirmation_check_at&status=in.(prepared,submitted)&limit=2000"),
   select<{phase:string}>("launchpad_sales","select=phase&limit=2000"),
   select<{name:string;holder:string;expires_at:string}>("launchpad_operation_leases","select=name,holder,expires_at&expires_at=gt.now()&limit=20"),
   select<{action:string;created_at:string}>("launchpad_audit","select=action,created_at&action=eq.reconciliation.run&order=created_at.desc&limit=1")
  ]);
  const byStage=reviews.reduce<Record<string,number>>((a,r)=>{const k=r.settlement_stage||r.status;a[k]=(a[k]??0)+1;return a},{});
  const byKind=reviews.reduce<Record<string,number>>((a,r)=>{a[r.kind]=(a[r.kind]??0)+1;return a},{});
  const byPhase=sales.reduce<Record<string,number>>((a,r)=>{a[r.phase]=(a[r.phase]??0)+1;return a},{});
  const now=Date.now();const retriesDue=reviews.filter(r=>r.status==="submitted"&&(!r.next_confirmation_check_at||Date.parse(r.next_confirmation_check_at)<=now)).length;
  return json({ok:chain.ok,rpc:chain,pending:{total:reviews.length,byStage,byKind,retriesDue},sales:{total:sales.length,byPhase},leases:leases.map(l=>({name:l.name,expiresAt:l.expires_at})),lastReconciliationAt:audits[0]?.created_at??null,at:new Date().toISOString()},{status:chain.ok?200:503});
 }catch(e){return error("INTERNAL_ERROR",e instanceof Error?e.message:"Unable to load operations status",500)}
}
