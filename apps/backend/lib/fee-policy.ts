import {POWERCHAIN_SERVICE_FEE_BPS} from "@powerchain/launchpad-config";
import type {BuilderPlan} from "./transaction-builder";

export type FeePolicyKind="purchase"|"claim"|"creator"|"transfer";
export type FeePolicy={kind:FeePolicyKind;serviceFeeBps:number;serviceFeeCharged:boolean;networkFeeVariable:true;rentVariable:true};

export function feePolicy(kind:FeePolicyKind):FeePolicy{
  return kind==="purchase"
    ? {kind,serviceFeeBps:POWERCHAIN_SERVICE_FEE_BPS,serviceFeeCharged:true,networkFeeVariable:true,rentVariable:true}
    : {kind,serviceFeeBps:0,serviceFeeCharged:false,networkFeeVariable:true,rentVariable:true};
}

export function attachFeePolicy(plan:BuilderPlan,kind:FeePolicyKind):BuilderPlan{
  plan.feePolicy=feePolicy(kind);
  if(kind!=="purchase"&&BigInt(plan.fees.serviceFeeLamports)!==0n) throw new Error("unexpected_powerchain_service_fee");
  if(kind==="purchase"&&plan.paymentSettlement&&BigInt(plan.fees.serviceFeeLamports)!==BigInt(plan.paymentSettlement.serviceFeeBaseUnits)) throw new Error("review_service_fee_mismatch");
  return plan;
}
