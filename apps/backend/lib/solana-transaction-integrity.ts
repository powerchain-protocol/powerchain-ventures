import {createHash} from "node:crypto";
import {solanaRpc} from "./solana-rpc";
import {transactionMessageBytes as extractTransactionMessageBytes} from "@powerchain/solana";

export function transactionMessageBytes(serializedBase64:string){
 let bytes:Buffer;
 try{bytes=Buffer.from(serializedBase64,"base64")}catch{throw new Error("transaction_base64_invalid")}
 return extractTransactionMessageBytes(bytes);
}

export function transactionMessageHash(serializedBase64:string){
 return createHash("sha256").update(transactionMessageBytes(serializedBase64)).digest("hex");
}

type RpcTransaction={
 slot:number;
 meta?:{err:unknown}|null;
 transaction?:[string,string]|string;
};

/**
 * Binds a confirmed on-chain signature to the exact Solana message that was
 * persisted and shown in the PowerChain transaction review. Signatures are
 * deliberately excluded because the prepared transaction contains placeholder
 * signature bytes while the submitted transaction contains the wallet's real
 * signature. The message (accounts, blockhash and compiled instructions) must
 * be byte-for-byte identical.
 */
export async function verifyTransactionMatchesPrepared(signature:string,preparedSerializedBase64:string){
 const expected=transactionMessageHash(preparedSerializedBase64);
 const {result,endpoint,latencyMs}=await solanaRpc<RpcTransaction|null>("getTransaction",[
  signature,
  {commitment:"confirmed",encoding:"base64",maxSupportedTransactionVersion:0}
 ]);
 if(!result)return {ok:false as const,status:"transaction_not_found" as const,endpoint,latencyMs};
 if(result.meta?.err)return {ok:false as const,status:"transaction_failed" as const,endpoint,latencyMs,slot:result.slot,error:result.meta.err};
 const encoded=Array.isArray(result.transaction)?result.transaction[0]:result.transaction;
 if(typeof encoded!=="string"||encoded.length===0)return {ok:false as const,status:"transaction_encoding_missing" as const,endpoint,latencyMs,slot:result.slot};
 let actual:string;
 try{actual=transactionMessageHash(encoded)}catch{return {ok:false as const,status:"transaction_decode_failed" as const,endpoint,latencyMs,slot:result.slot}}
 if(actual!==expected)return {ok:false as const,status:"transaction_message_mismatch" as const,endpoint,latencyMs,slot:result.slot,expectedMessageHash:expected,actualMessageHash:actual};
 return {ok:true as const,status:"matched" as const,endpoint,latencyMs,slot:result.slot,messageHash:actual};
}
