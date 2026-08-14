import type {BuilderPlan} from "../../../../../lib/transaction-builder";
import {error,json,readJson} from "../../../../../lib/http";
import {enforceRateLimit} from "../../../../../lib/rate-limit-response";
import {databaseConfigured,patch,select} from "../../../../../lib/supabase-rest";
import {requireSolanaAddress,requireUuid} from "../../../../../lib/validate";
import {assertStoredPlanIntegrity} from "../../../../../lib/review-integrity";
import {verifySignature} from "../../../../../lib/solana-confirmation";
import {verifyTransactionMatchesPrepared} from "../../../../../lib/solana-transaction-integrity";
import {verifyConfirmedSolTransfer,type WalletTransferContract} from "../../../../../lib/wallet-transfer";
import {verifyConfirmedTokenDelivery} from "../../../../../lib/token-delivery";

export async function POST(request:Request){try{
 const limited=await enforceRateLimit(request,"wallet.transfer.confirm",30);if(limited)return limited;if(!databaseConfigured())return error("CONFIGURATION_ERROR","Launchpad database is not configured",503);
 const body=await readJson<Record<string,unknown>>(request);const wallet=requireSolanaAddress(body.wallet,"wallet"),reviewId=requireUuid(body.reviewId,"reviewId"),signature=String(body.signature??"");if(signature.length<64||signature.length>100)return error("BAD_REQUEST","Invalid Solana signature");
 const [row]=await select<{id:string;wallet:string;plan_hash:string;plan:BuilderPlan;metadata:{transfer?:WalletTransferContract};status:string;expires_at:string|null}>("launchpad_transaction_reviews",`select=id,wallet,plan_hash,plan,metadata,status,expires_at&id=eq.${reviewId}&wallet=eq.${encodeURIComponent(wallet)}&kind=eq.wallet-transfer&limit=1`);if(!row)return error("NOT_FOUND","Transfer review not found",404);if(row.status==="confirmed")return json({status:"confirmed",signature});if(row.expires_at&&Date.parse(row.expires_at)<=Date.now())return error("QUOTE_EXPIRED","Transfer transaction expired",409);
 assertStoredPlanIntegrity(row.plan,row.plan_hash);if(!row.plan.serializedTransactionBase64)throw new Error("prepared_transaction_missing");const sig=await verifySignature(signature);if(!sig.ok)return json({status:sig.status,signature},{status:sig.status==="processing"?202:409});const exact=await verifyTransactionMatchesPrepared(signature,row.plan.serializedTransactionBase64);if(!exact.ok)throw new Error(exact.status);
 const transfer=row.metadata?.transfer;if(!transfer)throw new Error("transfer_contract_missing");let delivery;if(transfer.asset==="SOL")delivery=await verifyConfirmedSolTransfer(signature,transfer);else{if(!transfer.mint||!transfer.sourceTokenAccount||!transfer.destinationTokenAccount)throw new Error("pwrc_transfer_contract_invalid");delivery=await verifyConfirmedTokenDelivery(signature,{wallet:transfer.recipient,mint:transfer.mint,destinationTokenAccount:transfer.destinationTokenAccount,sourceVaultTokenAccount:transfer.sourceTokenAccount,amountBaseUnits:transfer.amountBaseUnits,decimals:transfer.decimals,mode:"immediate"})}if(!delivery.ok)throw new Error("transfer_delivery_verification_failed");
 await patch("launchpad_transaction_reviews",`id=eq.${reviewId}`,{submitted_signature:signature,status:"confirmed",settlement_stage:"settled",confirmed_slot:sig.slot,confirmed_at:new Date().toISOString(),confirmed_message_hash:exact.messageHash,confirmed_rpc_endpoint:exact.endpoint,metadata:{...row.metadata,transfer,delivery}});
 return json({status:"confirmed",signature,slot:sig.slot,delivery});
}catch(e){return error("BAD_REQUEST",e instanceof Error?e.message:"Unable to confirm transfer",400)}}
