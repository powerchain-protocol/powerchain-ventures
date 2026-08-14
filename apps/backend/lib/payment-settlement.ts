import {POWERCHAIN_FEE_WALLET_ADDRESS,POWERCHAIN_SERVICE_FEE_BPS} from "@powerchain/launchpad-config";
import {solanaRpc} from "./solana-rpc";
import type {BuilderPlan} from "./transaction-builder";
import {isSolanaAddress} from "./policy";

export type NativeSolPaymentSettlement={
  assetKind:"native-sol";
  paymentAmountBaseUnits:string;
  serviceFeeBaseUnits:string;
  paymentReceiverWallet:string;
  powerchainTreasuryWallet:string;
};

function positiveUint(value:string,name:string){if(!/^\d+$/.test(value)||BigInt(value)<=0n)throw new Error(`invalid_${name}`);return BigInt(value)}

/**
 * Requires the transaction builder to expose the exact SOL settlement amounts.
 * The PowerChain fee must be exactly 2.5% of the purchase proceeds, rounded up.
 */
export function assertNativeSolPaymentSettlement(plan:BuilderPlan,input:{paymentReceiverWallet:string;powerchainTreasuryWallet:string}){
  const settlement=plan.paymentSettlement;
  if(!settlement||settlement.assetKind!=="native-sol")throw new Error("builder_payment_settlement_missing");
  if(!isSolanaAddress(settlement.paymentReceiverWallet)||!isSolanaAddress(settlement.powerchainTreasuryWallet))throw new Error("builder_payment_address_invalid");
  if(settlement.paymentReceiverWallet!==input.paymentReceiverWallet)throw new Error("builder_payment_receiver_mismatch");
  if(settlement.powerchainTreasuryWallet!==input.powerchainTreasuryWallet)throw new Error("builder_treasury_receiver_mismatch");
  if(settlement.powerchainTreasuryWallet!==POWERCHAIN_FEE_WALLET_ADDRESS)throw new Error("builder_fee_wallet_mismatch");
  if(settlement.paymentReceiverWallet===settlement.powerchainTreasuryWallet)throw new Error("payment_and_fee_receivers_must_be_distinct");
  const payment=positiveUint(settlement.paymentAmountBaseUnits,"payment_amount");
  const serviceFee=positiveUint(settlement.serviceFeeBaseUnits,"service_fee_amount");
  const expected=(payment*BigInt(POWERCHAIN_SERVICE_FEE_BPS)+9999n)/10000n;
  if(serviceFee!==expected)throw new Error("builder_service_fee_payment_mismatch");
  const proceedsRecipient=plan.recipients.find(r=>r.address===settlement.paymentReceiverWallet&&r.amountBaseUnits===payment.toString()&&!r.mint);
  const feeRecipient=plan.recipients.find(r=>r.address===settlement.powerchainTreasuryWallet&&r.amountBaseUnits===serviceFee.toString()&&!r.mint);
  if(!proceedsRecipient)throw new Error("builder_exact_payment_recipient_missing");
  if(!feeRecipient)throw new Error("builder_exact_fee_recipient_missing");
  return settlement;
}

type JsonTx={slot:number;meta?:{err:unknown;preBalances?:number[];postBalances?:number[]}|null;transaction?:{message?:{accountKeys?:Array<string|{pubkey:string}>}}};
function addressAt(tx:JsonTx,index:number){const v=tx.transaction?.message?.accountKeys?.[index];return typeof v==="string"?v:v?.pubkey}
function deltaFor(tx:JsonTx,address:string){const keys=tx.transaction?.message?.accountKeys??[];const index=keys.findIndex((_,i)=>addressAt(tx,i)===address);if(index<0)return null;const pre=tx.meta?.preBalances?.[index],post=tx.meta?.postBalances?.[index];if(pre===undefined||post===undefined)return null;return BigInt(post)-BigInt(pre)}

/** Verify the confirmed transaction paid exact reviewed SOL proceeds + service fee. */
export async function verifyConfirmedNativeSolPayment(signature:string,settlement:NativeSolPaymentSettlement){
  const {result,endpoint,latencyMs}=await solanaRpc<JsonTx|null>("getTransaction",[signature,{commitment:"confirmed",encoding:"jsonParsed",maxSupportedTransactionVersion:0}]);
  if(!result)return {ok:false as const,status:"transaction_not_found" as const,endpoint,latencyMs};
  if(result.meta?.err)return {ok:false as const,status:"transaction_failed" as const,endpoint,latencyMs,error:result.meta.err};
  const proceedsDelta=deltaFor(result,settlement.paymentReceiverWallet),feeDelta=deltaFor(result,settlement.powerchainTreasuryWallet);
  if(proceedsDelta===null||feeDelta===null)return {ok:false as const,status:"payment_balance_evidence_missing" as const,endpoint,latencyMs};
  if(proceedsDelta!==BigInt(settlement.paymentAmountBaseUnits))return {ok:false as const,status:"payment_amount_mismatch" as const,endpoint,latencyMs,proceedsDelta:proceedsDelta.toString()};
  if(feeDelta!==BigInt(settlement.serviceFeeBaseUnits))return {ok:false as const,status:"service_fee_amount_mismatch" as const,endpoint,latencyMs,feeDelta:feeDelta.toString()};
  return {ok:true as const,status:"settled" as const,endpoint,latencyMs,slot:result.slot,paymentAmountBaseUnits:proceedsDelta.toString(),serviceFeeBaseUnits:feeDelta.toString()};
}
