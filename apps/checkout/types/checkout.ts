export type Sale = {
  id: string;
  slug: string;
  name: string;
  mint: string;
  symbol: string;
  decimals: number;
  phase: string;
  starts_at: string;
  ends_at: string;
  claim_starts_at: string;
  price_usd_micros: string;
  allocation_base_units: string;
  sold_base_units: string;
  min_purchase_usd_micros: string;
  max_purchase_usd_micros: string;
  eligibility_mode:
    | "public"
    | "allowlist"
    | "trusted";
  service_fee_bps: number;
  delivery_mode:
    | "immediate"
    | "claim";
  metrics?: {
    raisedUsdMicros: string;
    soldBaseUnits: string;
    participants: number;
  };
};

export type PurchaseQuote = {
  saleId: string;
  mint: string;
  symbol: string;
  decimals: number;
  priceUsdMicros: string;
  usdMicros: string;
  tokenBaseUnits: string;
  serviceFeeBps: number;
  serviceFeeUsdMicros: string;
  totalUsdMicros: string;
  expiresInSeconds: number;
};

export type ReviewPlan = {
  id: string;
  cluster:
    | "devnet"
    | "mainnet-beta";
  feePayer: string;
  feePolicy?: {
    kind:
      | "purchase"
      | "claim"
      | "creator"
      | "transfer";
    serviceFeeBps: number;
    serviceFeeCharged: boolean;
    networkFeeVariable: true;
    rentVariable: true;
  };
  paymentSettlement?: {
    assetKind: "native-sol";
    paymentAmountBaseUnits: string;
    serviceFeeBaseUnits: string;
    paymentReceiverWallet: string;
    powerchainTreasuryWallet: string;
  };
  instructions: Array<{
    index: number;
    programId: string;
    programName: string;
    accounts: Array<{
      address: string;
      signer: boolean;
      writable: boolean;
      label?: string;
    }>;
    dataBase64: string;
    summary: string;
  }>;
  fees: {
    networkFeeLamports: string;
    serviceFeeLamports: string;
    rentLamports: string;
    totalLamports: string;
  };
  recipients: Array<{
    address: string;
    label: string;
    amountBaseUnits?: string;
    mint?: string;
  }>;
  serializedTransactionBase64?: string;
  expiresAt?: string;
  simulation?: {
    ok: boolean;
    unitsConsumed?: number;
    error?: string;
  };
};

export type PreparedPurchase = {
  quote: PurchaseQuote;
  marketPrice?: {
    asset: "SOL";
    priceUsd: number;
    priceUsdMicros: string;
    observedAt: string;
    providers: string[];
    maxDivergenceBps:
      number | null;
  };
  plan: ReviewPlan;
};

export type PurchaseReceipt = {
  saleId: string;
  reviewId: string;
  signature: string;
  wallet: string;
  cluster: "devnet" | "mainnet-beta";
  settledAt: string;
  slot?: number;
};
