import {PublicKey} from "@solana/web3.js";
import {enforceRateLimit} from "../../../../../../lib/rate-limit-response";
import {isSolanaAddress} from "../../../../../../lib/policy";
import {json,error,readJson} from "../../../../../../lib/http";
import {solanaRpc} from "../../../../../../lib/solana-rpc";
const TOKEN_2022="TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
type RpcAccount={value:null|{owner:string;data:[string,string];executable:boolean;lamports:number}};
async function account(address:string){return solanaRpc<RpcAccount>("getAccountInfo",[address,{encoding:"base64",commitment:"confirmed"}])}
export async function POST(req:Request){
 try{
  const limited=await enforceRateLimit(req,"token2022.validate",20);if(limited)return limited;
  const body=await readJson<{mint?:unknown;vaultTokenAccount?:unknown;vaultAuthority?:unknown;requiredBaseUnits?:unknown}>(req);
  if(!isSolanaAddress(body.mint))return error("BAD_REQUEST","Invalid Solana mint address");
  const rpc=await account(body.mint);const a=rpc.result;if(!a.value)return error("BAD_REQUEST","Mint account does not exist",404);
  if(a.value.owner!==TOKEN_2022)return error("BAD_REQUEST","Mint is not owned by the Token-2022 program");
  if(a.value.executable)return error("BAD_REQUEST","Mint address points to an executable account");
  const raw=Buffer.from(a.value.data[0],"base64");if(raw.length<82)return error("BAD_REQUEST","Token-2022 mint account data is too short");
  const decimals=raw[44];const initialized=raw[45]===1;if(decimals===undefined||!initialized)return error("BAD_REQUEST","Token-2022 mint is not initialized");
  const supply=raw.readBigUInt64LE(36).toString();
  let vault:null|{address:string;mint:string;owner:string;amountBaseUnits:string;initialized:boolean;sufficientForRequiredAmount:boolean}=null;
  if(body.vaultTokenAccount!==undefined){
   if(!isSolanaAddress(body.vaultTokenAccount))return error("BAD_REQUEST","Invalid presale vault token account");
   const vrpc=await account(body.vaultTokenAccount);const v=vrpc.result;if(!v.value)return error("BAD_REQUEST","Presale vault token account does not exist",404);
   if(v.value.owner!==TOKEN_2022)return error("BAD_REQUEST","Presale vault must be owned by Token-2022");
   const data=Buffer.from(v.value.data[0],"base64");if(data.length<165)return error("BAD_REQUEST","Presale vault token account data is too short");
   const vaultMint=new PublicKey(data.subarray(0,32)).toBase58();const owner=new PublicKey(data.subarray(32,64)).toBase58();const amount=data.readBigUInt64LE(64);const state=data[108];
   if(vaultMint!==body.mint)return error("BAD_REQUEST","Presale vault token account belongs to a different mint");
   if(state===0)return error("BAD_REQUEST","Presale vault token account is not initialized");
   if(body.vaultAuthority!==undefined){if(!isSolanaAddress(body.vaultAuthority))return error("BAD_REQUEST","Invalid presale vault authority");if(owner!==body.vaultAuthority)return error("BAD_REQUEST","Presale vault authority does not match the token account owner");}
   const required=typeof body.requiredBaseUnits==="string"&&/^\d+$/.test(body.requiredBaseUnits)?BigInt(body.requiredBaseUnits):0n;
   vault={address:body.vaultTokenAccount,mint:vaultMint,owner,amountBaseUnits:amount.toString(),initialized:true,sufficientForRequiredAmount:required===0n||amount>=required};
   if(required>0n&&amount<required)return error("BAD_REQUEST","Presale vault does not hold enough tokens for the configured allocation");
  }
  return json({valid:true,mint:body.mint,owner:a.value.owner,decimals,supplyBaseUnits:supply,initialized:true,program:"token-2022",vault,rpc:{endpoint:rpc.endpoint,latencyMs:rpc.latencyMs},warnings:[]});
 }catch(e){return error("CONFIGURATION_ERROR",e instanceof Error?e.message:"Mint validation failed",503)}
}
