import {solanaRpc} from "./solana-rpc";
type SignatureStatus={confirmationStatus?:"processed"|"confirmed"|"finalized";err:unknown;slot:number};
export async function verifySignature(signature:string){
 const {result,endpoint,latencyMs}=await solanaRpc<{value:Array<SignatureStatus|null>}>("getSignatureStatuses",[[signature],{searchTransactionHistory:true}]);
 const status=result.value[0];if(!status)return {ok:false as const,status:"not_found" as const,endpoint,latencyMs};
 if(status.err)return {ok:false as const,status:"failed" as const,slot:status.slot,error:status.err,endpoint,latencyMs};
 if(status.confirmationStatus!=="confirmed"&&status.confirmationStatus!=="finalized")return {ok:false as const,status:"processing" as const,slot:status.slot,endpoint,latencyMs};
 return {ok:true as const,status:status.confirmationStatus,slot:status.slot,endpoint,latencyMs};
}
