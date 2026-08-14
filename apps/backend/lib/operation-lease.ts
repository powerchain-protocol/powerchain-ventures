import {randomUUID} from "node:crypto";
import {rpc} from "./supabase-rest";

export async function acquireOperationLease(name:string,ttlSeconds=240){
 const holder=randomUUID();
 const acquired=await rpc<boolean>("launchpad_acquire_operation_lease",{p_name:name,p_holder:holder,p_ttl_seconds:ttlSeconds});
 return {acquired:Boolean(acquired),holder};
}
export async function releaseOperationLease(name:string,holder:string){
 try{return Boolean(await rpc<boolean>("launchpad_release_operation_lease",{p_name:name,p_holder:holder}))}catch{return false}
}
