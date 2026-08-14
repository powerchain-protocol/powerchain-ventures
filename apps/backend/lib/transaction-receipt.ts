import {isSolanaAddress} from "./policy";

export type ReceiptPlan={
  cluster?:"devnet"|"mainnet-beta";
  feePayer?:string;
  fees?:Record<string,unknown>;
  feePolicy?:Record<string,unknown>;
  paymentSettlement?:Record<string,unknown>;
  recipients?:Array<Record<string,unknown>>;
  simulation?:Record<string,unknown>;
  programOperation?:Record<string,unknown>;
};

export type SanitizedReceiptPlan = {
  cluster: "devnet" | "mainnet-beta";
  feePayer?: string;
  feePolicy: { kind: string; serviceFeeBps: number; serviceFeeCharged: boolean };
  fees: { networkFeeLamports: string; serviceFeeLamports: string; rentLamports: string; totalLamports: string };
  paymentSettlement?: {
    assetKind: "native-sol";
    paymentAmountBaseUnits: string;
    serviceFeeBaseUnits: string;
    paymentReceiverWallet: string;
    powerchainTreasuryWallet: string;
  };
  recipients: Array<{ address: string; label: string; amountBaseUnits?: string; mint?: string }>;
  simulation?: { ok: boolean; unitsConsumed?: number };
  programOperation?: { programId:string; operation:string; salePda:string; participantPda?:string; purchaseNonce?:string };
};

const s=(v:unknown,f="")=>typeof v==="string"?v:f;
const n=(v:unknown,f=0)=>typeof v==="number"&&Number.isFinite(v)?v:f;

export function explorerTransactionUrl(signature:string,cluster:"devnet"|"mainnet-beta"="mainnet-beta"){
  if(!signature)return undefined;
  const suffix=cluster==="devnet"?"?cluster=devnet":"";
  return `https://explorer.solana.com/tx/${encodeURIComponent(signature)}${suffix}`;
}

export function safeReceiptPlan(raw:unknown): SanitizedReceiptPlan {
  const p=(raw&&typeof raw==="object"?raw:{}) as ReceiptPlan;
  const fees=(p.fees??{}) as Record<string,unknown>;
  const policy=(p.feePolicy??{}) as Record<string,unknown>;
  const payment=(p.paymentSettlement??{}) as Record<string,unknown>;
  const cluster: "devnet" | "mainnet-beta" = p.cluster==="devnet"?"devnet":"mainnet-beta";
  const feePayer=s(p.feePayer);
  const recipients=Array.isArray(p.recipients)
    ? p.recipients.map(r=>{
        const amountBaseUnits=s(r.amountBaseUnits);
        const mint=s(r.mint);
        return {
          address:s(r.address),
          label:s(r.label,"Recipient"),
          ...(amountBaseUnits ? {amountBaseUnits} : {}),
          ...(mint ? {mint} : {}),
        };
      }).filter(r=>isSolanaAddress(r.address))
    : [];
  const paymentSettlement = payment.assetKind==="native-sol"
    ? {
        assetKind:"native-sol" as const,
        paymentAmountBaseUnits:s(payment.paymentAmountBaseUnits,"0"),
        serviceFeeBaseUnits:s(payment.serviceFeeBaseUnits,"0"),
        paymentReceiverWallet:s(payment.paymentReceiverWallet),
        powerchainTreasuryWallet:s(payment.powerchainTreasuryWallet),
      }
    : undefined;
  const unitsConsumed=n(p.simulation?.unitsConsumed);
  const simulation=p.simulation
    ? {ok:Boolean(p.simulation.ok),...(unitsConsumed?{unitsConsumed}:{})}
    : undefined;
  const program=(p.programOperation??{}) as Record<string,unknown>;const programId=s(program.programId),salePda=s(program.salePda),participantPda=s(program.participantPda),purchaseNonce=s(program.purchaseNonce);const programOperation=isSolanaAddress(programId)&&isSolanaAddress(salePda)?{programId,operation:s(program.operation),salePda,...(isSolanaAddress(participantPda)?{participantPda}:{}),...(purchaseNonce?{purchaseNonce}:{})}:undefined;

  return {
    cluster,
    ...(isSolanaAddress(feePayer)?{feePayer}:{}),
    feePolicy:{
      kind:s(policy.kind),
      serviceFeeBps:n(policy.serviceFeeBps),
      serviceFeeCharged:Boolean(policy.serviceFeeCharged),
    },
    fees:{
      networkFeeLamports:s(fees.networkFeeLamports,"0"),
      serviceFeeLamports:s(fees.serviceFeeLamports,"0"),
      rentLamports:s(fees.rentLamports,"0"),
      totalLamports:s(fees.totalLamports,"0"),
    },
    ...(paymentSettlement?{paymentSettlement}:{}),
    recipients,
    ...(simulation?{simulation}:{}),
    ...(programOperation?{programOperation}:{}),
  };
}
