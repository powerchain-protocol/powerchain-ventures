import {solanaRpc} from "../solana-rpc";
import {programRuntimePolicy} from "./config";

export async function getLaunchpadProgramStatus(){const policy=programRuntimePolicy();if(!policy.programId)return {...policy,configured:false,deployed:false,executable:false};try{const {result,endpoint,latencyMs}=await solanaRpc<{value:{executable:boolean;owner:string;lamports:number}|null}>("getAccountInfo",[policy.programId,{encoding:"base64",commitment:"confirmed"}]);return {...policy,configured:true,deployed:Boolean(result?.value),executable:Boolean(result?.value?.executable),loaderOwner:result?.value?.owner??null,rpcEndpoint:endpoint,rpcLatencyMs:latencyMs}}catch(e){return {...policy,configured:true,deployed:false,executable:false,error:e instanceof Error?e.message:"program_status_unavailable"}}}
