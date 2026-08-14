import {insert} from "./supabase-rest";
export async function audit(actor:string|null,action:string,entityType:string,entityId:string|null,payload:Record<string,unknown>={}){
 try{await insert("launchpad_audit_log",{actor,action,entity_type:entityType,entity_id:entityId,payload})}catch(e){console.error(JSON.stringify({level:"error",event:"audit_write_failed",action,entityType,entityId,error:e instanceof Error?e.message:String(e)}))}
}
