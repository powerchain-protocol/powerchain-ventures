import {POWERCHAIN_FEE_WALLET_ADDRESS} from "@powerchain/launchpad-config";
import {enforceRateLimit} from "../../../../../../lib/rate-limit-response";
import {error,json,readJson} from "../../../../../../lib/http";
import {databaseConfigured,insert,select,patch} from "../../../../../../lib/supabase-rest";
import {assertEligible,confirmedWalletSpend,loadSale} from "../../../../../../lib/sale-access";
import {fee,parsePositiveBigInt,quote,isSolanaAddress} from "../../../../../../lib/policy";
import {buildTransaction} from "../../../../../../lib/transaction-builder";
import {reviewPlanHash} from "../../../../../../lib/review-integrity";
import {assertBuilderDelivers,buildDeliveryContract} from "../../../../../../lib/token-delivery";
import {assertNativeSolPaymentSettlement} from "../../../../../../lib/payment-settlement";
import {attachFeePolicy} from "../../../../../../lib/fee-policy";
import {readParticipantProgramState,readSaleProgramState} from "../../../../../../lib/program/accounts";
import {assertBuilderUsesLaunchpadProgram} from "../../../../../../lib/program/validation";
import {configuredLaunchpadProgramId,configuredQuoteAuthorityWallet} from "../../../../../../lib/program/config";

export async function POST(req:Request){
 try{
  const limited=await enforceRateLimit(req,"purchase.prepare",30); if(limited)return limited;
  if(!databaseConfigured()) return error("CONFIGURATION_ERROR","Supabase is not configured",503);
  const b=await readJson<{saleId?:string;wallet?:string;usdMicros?:string}>(req);const saleId=String(b.saleId??""),wallet=String(b.wallet??"");
  if(!isSolanaAddress(wallet))return error("BAD_REQUEST","Valid Solana wallet required");
  const live=await select<{id:string;expires_at:string|null;status:string}>("launchpad_transaction_reviews",`select=id,expires_at,status&sale_id=eq.${encodeURIComponent(saleId)}&wallet=eq.${encodeURIComponent(wallet)}&kind=eq.purchase&status=in.(prepared,submitted)&limit=1`);
  const current=live[0];if(current){const expires=current.expires_at?Date.parse(current.expires_at):0;if(expires&&expires<=Date.now()){await patch("launchpad_transaction_reviews",`id=eq.${encodeURIComponent(current.id)}`,{status:"expired",settlement_stage:"expired"})}else{return error("BAD_REQUEST","A purchase transaction is already prepared for this wallet and sale. Complete or expire it before preparing another.",409)}}
  const usd=parsePositiveBigInt(b.usdMicros,"usdMicros"),sale=await loadSale(saleId);await assertEligible(sale,wallet);
  const now=Date.now(),start=Date.parse(sale.starts_at),end=Date.parse(sale.ends_at);if(![start,end].every(Number.isFinite)||now<start||now>=end||!(sale.phase==="public"||sale.phase==="private"))return error("SALE_CLOSED","Sale is not active",409);
  const spent=await confirmedWalletSpend(saleId,wallet),min=BigInt(sale.min_purchase_usd_micros),max=BigInt(sale.max_purchase_usd_micros);if(usd<min||spent+usd>max)return error("BAD_REQUEST","Purchase is outside wallet limits");
  const q=quote(usd,BigInt(sale.price_usd_micros),sale.decimals);if(BigInt(sale.sold_base_units)+q.tokenBaseUnits>BigInt(sale.allocation_base_units))return error("SALE_CLOSED","Sale allocation is exhausted",409);
  const expectedFee=fee(usd,BigInt(sale.service_fee_bps));if(q.serviceFeeUsdMicros!==expectedFee)throw new Error("service_fee_mismatch");
  const treasury=POWERCHAIN_FEE_WALLET_ADDRESS;if(!isSolanaAddress(treasury))throw new Error("powerchain_fee_wallet_invalid");
  if(!isSolanaAddress(sale.payment_receiver_wallet))throw new Error("sale_payment_receiver_not_configured");
  const idempotencyKey=crypto.randomUUID();
  const programId=configuredLaunchpadProgramId();if(!programId||sale.launchpad_program_id!==programId||!sale.sale_pda)return error("CONFIGURATION_ERROR","Sale is not bound to the configured PowerChain Launchpad program",503);
  const onchain=await readSaleProgramState(sale.sale_pda);if(!onchain.state)return error("CONFIGURATION_ERROR","On-chain sale state is unavailable",503);if(onchain.state.paused)return error("SALE_CLOSED","Sale is paused on-chain",409);if(onchain.state.status!==1)return error("SALE_CLOSED","Sale is not active on-chain",409);if(onchain.state.mint!==sale.mint||onchain.state.feeWallet!==treasury)return error("CONFIGURATION_ERROR","On-chain sale binding does not match canonical sale configuration",503);if(onchain.state.deliveryOnClaim!==(sale.delivery_mode==="claim"))return error("CONFIGURATION_ERROR","On-chain delivery mode does not match sale configuration",503);
  const quoteAuthorityWallet=configuredQuoteAuthorityWallet();if(!quoteAuthorityWallet)return error("CONFIGURATION_ERROR","Quote authority signer is not configured",503);if(onchain.state.quoteAuthority!==quoteAuthorityWallet)return error("CONFIGURATION_ERROR","On-chain quote authority does not match deployment configuration",503);
  const participant=await readParticipantProgramState(sale.sale_pda,wallet);const purchaseNonce=(BigInt(participant.state?.purchaseNonce??"0")+1n).toString();
  const delivery=sale.delivery_mode==="immediate"?buildDeliveryContract({wallet,mint:sale.mint,sourceVaultTokenAccount:String(sale.source_vault_token_account??""),amountBaseUnits:q.tokenBaseUnits.toString(),decimals:sale.decimals,mode:"immediate"}):null;
  const plan=attachFeePolicy(await buildTransaction("purchase",{saleId,wallet,mint:sale.mint,symbol:sale.symbol,decimals:sale.decimals,usdMicros:usd.toString(),tokenBaseUnits:q.tokenBaseUnits.toString(),serviceFeeUsdMicros:q.serviceFeeUsdMicros.toString(),idempotencyKey,paymentReceiverWallet:sale.payment_receiver_wallet,powerchainTreasuryWallet:treasury,launchpadProgramId:programId,salePda:sale.sale_pda,vaultAuthorityPda:sale.vault_authority_pda,participantPda:participant.participantPda,purchaseNonce,quoteAuthorityWallet,delivery}),"purchase");
  if(plan.feePayer!==wallet)throw new Error("builder_fee_payer_mismatch");
  const paymentSettlement=assertNativeSolPaymentSettlement(plan,{paymentReceiverWallet:sale.payment_receiver_wallet,powerchainTreasuryWallet:treasury});
  assertBuilderUsesLaunchpadProgram(plan,{operation:"purchase",salePda:sale.sale_pda,participantPda:participant.participantPda,requiredSigners:[wallet,quoteAuthorityWallet]});if(plan.programOperation?.purchaseNonce!==purchaseNonce)throw new Error("builder_purchase_nonce_mismatch");
  if(delivery)assertBuilderDelivers(plan,delivery);
  const reviewId=crypto.randomUUID();plan.id=reviewId;const planHash=reviewPlanHash(plan);
  await insert("launchpad_transaction_reviews",{id:reviewId,wallet,kind:"purchase",sale_id:saleId,plan_hash:planHash,plan,expires_at:plan.expiresAt??null,status:"prepared",metadata:{idempotencyKey,usdMicros:usd.toString(),tokenBaseUnits:q.tokenBaseUnits.toString(),serviceFeeUsdMicros:q.serviceFeeUsdMicros.toString(),mint:sale.mint,delivery,paymentSettlement,paymentReceiverWallet:sale.payment_receiver_wallet,powerchainTreasuryWallet:treasury,programId,salePda:sale.sale_pda,participantPda:participant.participantPda,purchaseNonce,quoteAuthorityWallet}});
  return json({quote:{usdMicros:usd.toString(),tokenBaseUnits:q.tokenBaseUnits.toString(),serviceFeeUsdMicros:q.serviceFeeUsdMicros.toString(),totalUsdMicros:q.totalUsdMicros.toString()},delivery,paymentSettlement,plan});
 }catch(e){const m=e instanceof Error?e.message:"Unable to prepare purchase";if(m==="wallet_not_eligible")return error("NOT_ELIGIBLE","Wallet is not eligible",403);return error("BAD_REQUEST",m)}
}
