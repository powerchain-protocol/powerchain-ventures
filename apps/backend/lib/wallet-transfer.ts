import {Buffer} from "node:buffer";
import {PublicKey,SystemProgram,Transaction} from "@solana/web3.js";
import {createAssociatedTokenAccountIdempotentInstruction,createTransferCheckedInstruction,getAssociatedTokenAddressSync,TOKEN_2022_PROGRAM_ID} from "@solana/spl-token";
import {POWERCHAIN_PWRC_DECIMALS} from "@powerchain/launchpad-config";
import {solanaRpc} from "./solana-rpc";
import {configuredPwrcMint} from "./wallet-assets";
import type {BuilderPlan} from "./transaction-builder";

export type TransferAsset="SOL"|"PWRC";
export type WalletTransferContract={asset:TransferAsset;wallet:string;recipient:string;amountBaseUnits:string;mint?:string;sourceTokenAccount?:string;destinationTokenAccount?:string;decimals:number};
const ADDRESS=/^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
function ixAccounts(keys:Array<{pubkey:PublicKey;isSigner:boolean;isWritable:boolean}>,labels:string[]){return keys.map((k,i)=>({address:k.pubkey.toBase58(),signer:k.isSigner,writable:k.isWritable,label:labels[i]??`Account ${i+1}`}))}
async function accountExists(address:string){const {result}=await solanaRpc<{value:unknown|null}>("getAccountInfo",[address,{encoding:"base64",commitment:"confirmed"}]);return result.value!==null}
async function feeFor(tx:Transaction){const message=Buffer.from(tx.compileMessage().serialize()).toString("base64");const {result}=await solanaRpc<{value:number|null}>("getFeeForMessage",[message,{commitment:"confirmed"}]);return BigInt(result.value??5000)}
async function simulate(serialized:string){try{const {result}=await solanaRpc<{value:{err:unknown;unitsConsumed?:number}}>("simulateTransaction",[serialized,{encoding:"base64",sigVerify:false,commitment:"processed"}]);return {ok:result.value.err==null,unitsConsumed:result.value.unitsConsumed,error:result.value.err?JSON.stringify(result.value.err):undefined}}catch(e){return {ok:false,error:e instanceof Error?e.message:"simulation_failed"}}}

export async function buildWalletTransferPlan(input:{asset:TransferAsset;wallet:string;recipient:string;amountBaseUnits:string}):Promise<{plan:BuilderPlan;contract:WalletTransferContract}>{
  if(!ADDRESS.test(input.wallet)||!ADDRESS.test(input.recipient)||input.wallet===input.recipient)throw new Error("invalid_transfer_wallet");
  if(!/^\d+$/.test(input.amountBaseUnits)||BigInt(input.amountBaseUnits)<=0n)throw new Error("invalid_transfer_amount");
  const {result:block}=await solanaRpc<{blockhash:string;lastValidBlockHeight:number}>("getLatestBlockhash",[{commitment:"confirmed"}]);
  const tx=new Transaction({feePayer:new PublicKey(input.wallet),recentBlockhash:block.blockhash});
  const recipients:BuilderPlan["recipients"]=[];let rentLamports=0n;let contract:WalletTransferContract;
  if(input.asset==="SOL"){
    const amount=BigInt(input.amountBaseUnits);if(amount>BigInt(Number.MAX_SAFE_INTEGER))throw new Error("transfer_amount_too_large");
    const ix=SystemProgram.transfer({fromPubkey:new PublicKey(input.wallet),toPubkey:new PublicKey(input.recipient),lamports:Number(amount)});tx.add(ix);
    recipients.push({address:input.recipient,label:"SOL recipient",amountBaseUnits:input.amountBaseUnits});
    contract={asset:"SOL",wallet:input.wallet,recipient:input.recipient,amountBaseUnits:input.amountBaseUnits,decimals:9};
  }else{
    const mint=configuredPwrcMint();if(!mint)throw new Error("pwrc_mint_not_configured");
    const mintPk=new PublicKey(mint),ownerPk=new PublicKey(input.wallet),recipientPk=new PublicKey(input.recipient);
    const source=getAssociatedTokenAddressSync(mintPk,ownerPk,false,TOKEN_2022_PROGRAM_ID);const destination=getAssociatedTokenAddressSync(mintPk,recipientPk,false,TOKEN_2022_PROGRAM_ID);
    if(!(await accountExists(source.toBase58())))throw new Error("pwrc_token_account_not_found");
    const sourceBalance=await solanaRpc<{value:{amount:string;decimals:number}}>("getTokenAccountBalance",[source.toBase58(),{commitment:"confirmed"}]);
    const decimals=sourceBalance.result.value.decimals;if(decimals!==POWERCHAIN_PWRC_DECIMALS)throw new Error("pwrc_decimals_mismatch");if(BigInt(sourceBalance.result.value.amount)<BigInt(input.amountBaseUnits))throw new Error("insufficient_pwrc_balance");
    if(!(await accountExists(destination.toBase58()))){
      const createIx=createAssociatedTokenAccountIdempotentInstruction(ownerPk,destination,recipientPk,mintPk,TOKEN_2022_PROGRAM_ID);tx.add(createIx);
      const {result:rent}=await solanaRpc<number>("getMinimumBalanceForRentExemption",[165]);rentLamports=BigInt(rent);
    }
    tx.add(createTransferCheckedInstruction(source,mintPk,destination,ownerPk,BigInt(input.amountBaseUnits),decimals,[],TOKEN_2022_PROGRAM_ID));
    recipients.push({address:destination.toBase58(),label:"PWRC recipient token account",amountBaseUnits:input.amountBaseUnits,mint});
    contract={asset:"PWRC",wallet:input.wallet,recipient:input.recipient,amountBaseUnits:input.amountBaseUnits,mint,sourceTokenAccount:source.toBase58(),destinationTokenAccount:destination.toBase58(),decimals};
  }
  const networkFee=await feeFor(tx);if(input.asset==="SOL"){const bal=await solanaRpc<number>("getBalance",[input.wallet,{commitment:"confirmed"}]);if(BigInt(bal.result)<BigInt(input.amountBaseUnits)+networkFee+rentLamports)throw new Error("insufficient_sol_balance")}
  const serialized=Buffer.from(tx.serialize({requireAllSignatures:false,verifySignatures:false})).toString("base64");const sim=await simulate(serialized);if(!sim.ok)throw new Error(`transfer_simulation_failed:${sim.error??"unknown"}`);
  const instructions=tx.instructions.map((ix,index)=>({index,programId:ix.programId.toBase58(),programName:ix.programId.equals(SystemProgram.programId)?"System Program":ix.programId.equals(TOKEN_2022_PROGRAM_ID)?"Token-2022":"Associated Token Program",accounts:ixAccounts(ix.keys,input.asset==="SOL"?["Sender","Recipient"]:index===0&&tx.instructions.length>1?["Fee payer","Recipient token account","Recipient wallet","PWRC mint","System Program","Token program"]:["Source PWRC account","PWRC mint","Destination PWRC account","Owner"]),dataBase64:Buffer.from(ix.data).toString("base64"),summary:input.asset==="SOL"?`Send ${input.amountBaseUnits} lamports`:(index===tx.instructions.length-1?"Transfer PWRC with transferChecked":"Create recipient PWRC token account if needed")}));
  const total=networkFee+rentLamports;const plan:BuilderPlan={id:crypto.randomUUID(),cluster:process.env.NEXT_PUBLIC_SOLANA_CLUSTER==="devnet"?"devnet":"mainnet-beta",feePayer:input.wallet,recentBlockhash:block.blockhash,instructions,fees:{networkFeeLamports:networkFee.toString(),serviceFeeLamports:"0",rentLamports:rentLamports.toString(),totalLamports:total.toString()},recipients,serializedTransactionBase64:serialized,expiresAt:new Date(Date.now()+90_000).toISOString(),simulation:{ok:true,unitsConsumed:sim.unitsConsumed},feePolicy:{kind:"transfer",serviceFeeBps:0,serviceFeeCharged:false,networkFeeVariable:true,rentVariable:true}};
  return {plan,contract};
}

type JsonTx={slot:number;meta?:{err:unknown;preBalances?:number[];postBalances?:number[]}|null;transaction?:{message?:{accountKeys?:Array<string|{pubkey:string}>}}};
function keyAt(tx:JsonTx,index:number){const key=tx.transaction?.message?.accountKeys?.[index];return typeof key==="string"?key:key?.pubkey}
export async function verifyConfirmedSolTransfer(signature:string,contract:WalletTransferContract){const {result,endpoint}=await solanaRpc<JsonTx|null>("getTransaction",[signature,{commitment:"confirmed",encoding:"jsonParsed",maxSupportedTransactionVersion:0}]);if(!result||result.meta?.err)return {ok:false as const,endpoint};const keys=result.transaction?.message?.accountKeys??[];const index=keys.findIndex((_,i)=>keyAt(result,i)===contract.recipient);if(index<0)return {ok:false as const,endpoint};const before=BigInt(result.meta?.preBalances?.[index]??0),after=BigInt(result.meta?.postBalances?.[index]??0);return {ok:after-before===BigInt(contract.amountBaseUnits),endpoint,slot:result.slot,delta:(after-before).toString()}}
