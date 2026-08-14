import {error,json} from "../../../../../lib/http";
import {databaseConfigured,rpc,select} from "../../../../../lib/supabase-rest";
import {rpcHealth} from "../../../../../lib/solana-rpc";
import {audit} from "../../../../../lib/audit";
import {reconciliationAuthorized,reconciliationSecret} from "../../../../../lib/reconciliation-auth";
import {acquireOperationLease,releaseOperationLease} from "../../../../../lib/operation-lease";

async function run(req:Request){
 if(!reconciliationSecret())return error("CONFIGURATION_ERROR","Reconciliation is not configured",503);
 if(!reconciliationAuthorized(req))return error("UNAUTHORIZED","Unauthorized",401);
 if(!databaseConfigured())return error("CONFIGURATION_ERROR","Supabase is not configured",503);
 const lease=await acquireOperationLease("launchpad-reconciliation",240);
 if(!lease.acquired)return error("BAD_REQUEST","Reconciliation is already running",409);
 try{
  const phases=await rpc<Array<{updated_count:number}>|number>("launchpad_refresh_sale_phases",{});
  const expired=await rpc<number>("launchpad_expire_stale_reviews",{});
  const rateLimitRowsDeleted=await rpc<number>("launchpad_cleanup_rate_limits",{p_older_than_seconds:7200});
  const staleDraftsDeleted=await rpc<number>("launchpad_cleanup_stale_drafts",{p_older_than_seconds:86400});
  const pending=await select<{kind:string;status:string;settlement_stage:string;confirmation_attempts:number;next_confirmation_check_at:string|null}>("launchpad_transaction_reviews","select=kind,status,settlement_stage,confirmation_attempts,next_confirmation_check_at&status=in.(prepared,submitted)&limit=1000");
  const counts=pending.reduce<Record<string,number>>((acc,row)=>{const key=`${row.kind}:${row.status}`;acc[key]=(acc[key]??0)+1;return acc},{});
  const stages=pending.reduce<Record<string,number>>((acc,row)=>{const key=row.settlement_stage||row.status;acc[key]=(acc[key]??0)+1;return acc},{});
  const now=Date.now();
  const dueForRetry=pending.filter(row=>row.status==="submitted"&&(!row.next_confirmation_check_at||Date.parse(row.next_confirmation_check_at)<=now)).length;
  const maxAttempts=pending.reduce((m,row)=>Math.max(m,Number(row.confirmation_attempts||0)),0);
  const chain=await rpcHealth();
  const phaseUpdates=Array.isArray(phases)?Number(phases[0]?.updated_count??0):Number(phases??0);
  await audit("system","reconciliation.run","system",null,{phaseUpdates,expiredReviews:expired,rateLimitRowsDeleted,staleDraftsDeleted,pending:counts,settlementStages:stages,dueForRetry,maxConfirmationAttempts:maxAttempts,rpcHealthy:chain.ok});
  return json({ok:chain.ok,phaseUpdates,expiredReviews:expired,rateLimitRowsDeleted,staleDraftsDeleted,pending:counts,settlementStages:stages,dueForRetry,maxConfirmationAttempts:maxAttempts,rpc:{healthy:chain.ok,latencyMs:"latencyMs" in chain?chain.latencyMs:null},at:new Date().toISOString()},{status:chain.ok?200:503});
 }catch(e){return error("INTERNAL_ERROR",e instanceof Error?e.message:"Reconciliation failed",500)}
 finally{await releaseOperationLease("launchpad-reconciliation",lease.holder)}
}
export const GET=run;
export const POST=run;
