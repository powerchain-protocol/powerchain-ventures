import {PublicKey} from "@solana/web3.js";
import {getAssociatedTokenAddressSync,TOKEN_2022_PROGRAM_ID} from "@solana/spl-token";
import {solanaRpc} from "./solana-rpc";
import type {BuilderPlan} from "./transaction-builder";

const ADDRESS=/^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export interface TokenDeliveryContract {
  wallet:string;
  mint:string;
  destinationTokenAccount:string;
  sourceVaultTokenAccount:string;
  amountBaseUnits:string;
  decimals:number;
  mode:"immediate"|"claim";
}

export function buyerTokenAccount(wallet:string,mint:string){
  return getAssociatedTokenAddressSync(new PublicKey(mint),new PublicKey(wallet),false,TOKEN_2022_PROGRAM_ID).toBase58();
}

export function buildDeliveryContract(input:{wallet:string;mint:string;sourceVaultTokenAccount:string;amountBaseUnits:string;decimals:number;mode:"immediate"|"claim"}):TokenDeliveryContract{
  if(!ADDRESS.test(input.wallet)||!ADDRESS.test(input.mint)||!ADDRESS.test(input.sourceVaultTokenAccount))throw new Error("invalid_delivery_address");
  if(!/^\d+$/.test(input.amountBaseUnits)||BigInt(input.amountBaseUnits)<=0n)throw new Error("invalid_delivery_amount");
  if(!Number.isInteger(input.decimals)||input.decimals<0||input.decimals>18)throw new Error("invalid_delivery_decimals");
  return {...input,destinationTokenAccount:buyerTokenAccount(input.wallet,input.mint)};
}

/** Builder output must explicitly expose the exact token delivery destination. */
export function assertBuilderDelivers(plan:BuilderPlan,delivery:TokenDeliveryContract){
  const recipient=plan.recipients.find(r=>r.address===delivery.destinationTokenAccount&&r.mint===delivery.mint&&r.amountBaseUnits===delivery.amountBaseUnits);
  if(!recipient)throw new Error("builder_token_delivery_mismatch");
  const hasDestination=plan.instructions.some(ix=>ix.accounts.some(a=>a.address===delivery.destinationTokenAccount&&a.writable));
  const hasMint=plan.instructions.some(ix=>ix.accounts.some(a=>a.address===delivery.mint));
  const hasVault=plan.instructions.some(ix=>ix.accounts.some(a=>a.address===delivery.sourceVaultTokenAccount&&a.writable));
  if(!hasDestination||!hasMint||!hasVault)throw new Error("builder_delivery_accounts_missing");
}

type TokenBalance={accountIndex:number;mint:string;owner?:string;uiTokenAmount:{amount:string;decimals:number}};
type JsonTx={
  slot:number;
  meta?:{err:unknown;preTokenBalances?:TokenBalance[];postTokenBalances?:TokenBalance[]}|null;
  transaction?:{message?:{accountKeys?:Array<string|{pubkey:string}>}};
};
function keyAt(tx:JsonTx,index:number){const key=tx.transaction?.message?.accountKeys?.[index];return typeof key==="string"?key:key?.pubkey;}

/**
 * Verifies that the confirmed transaction increased the buyer's Token-2022 ATA
 * by the exact amount that was shown in the reviewed delivery contract.
 */
export async function verifyConfirmedTokenDelivery(signature:string,delivery:TokenDeliveryContract){
  const {result,endpoint,latencyMs}=await solanaRpc<JsonTx|null>("getTransaction",[
    signature,{commitment:"confirmed",encoding:"jsonParsed",maxSupportedTransactionVersion:0}
  ]);
  if(!result)return {ok:false as const,status:"transaction_not_found" as const,endpoint,latencyMs};
  if(result.meta?.err)return {ok:false as const,status:"transaction_failed" as const,endpoint,latencyMs,error:result.meta.err};
  const pre=result.meta?.preTokenBalances??[],post=result.meta?.postTokenBalances??[];
  const postEntry=post.find(x=>keyAt(result,x.accountIndex)===delivery.destinationTokenAccount&&x.mint===delivery.mint);
  const preEntry=pre.find(x=>keyAt(result,x.accountIndex)===delivery.destinationTokenAccount&&x.mint===delivery.mint);
  if(!postEntry)return {ok:false as const,status:"destination_balance_missing" as const,endpoint,latencyMs};
  if(postEntry.owner&&postEntry.owner!==delivery.wallet)return {ok:false as const,status:"destination_owner_mismatch" as const,endpoint,latencyMs};
  if(postEntry.uiTokenAmount.decimals!==delivery.decimals)return {ok:false as const,status:"destination_decimals_mismatch" as const,endpoint,latencyMs};
  const before=BigInt(preEntry?.uiTokenAmount.amount??"0");
  const after=BigInt(postEntry.uiTokenAmount.amount);
  const delta=after-before;
  if(delta!==BigInt(delivery.amountBaseUnits))return {ok:false as const,status:"delivery_amount_mismatch" as const,endpoint,latencyMs,before:before.toString(),after:after.toString(),delta:delta.toString()};
  return {ok:true as const,status:"delivered" as const,endpoint,latencyMs,slot:result.slot,destinationTokenAccount:delivery.destinationTokenAccount,deliveredBaseUnits:delta.toString()};
}
