export declare const POWERCHAIN_VERSION: "1.0.0";
export declare const SERVICE_FEE_BPS = 250n;
export declare const BPS_DENOMINATOR = 10000n;
export declare const PWRC_DECIMALS = 9;
export declare const PWRC_SYMBOL: "PWRC";
export type SalePhase = "draft" | "scheduled" | "private" | "public" | "ended" | "claimable" | "completed" | "cancelled";
export type EligibilityMode = "public" | "allowlist" | "trusted";
export interface SaleConfig {
    id: string;
    name: string;
    symbol: string;
    mint: string;
    tokenProgram: "token-2022";
    decimals: number;
    phase: SalePhase;
    startsAt: string;
    endsAt: string;
    claimStartsAt: string;
    priceUsdMicros: bigint;
    allocationBaseUnits: bigint;
    minPurchaseUsdMicros: bigint;
    maxPurchaseUsdMicros: bigint;
    eligibility: EligibilityMode;
}
export interface QuoteInput {
    usdMicros: bigint;
    priceUsdMicros: bigint;
    decimals: number;
}
export interface Quote {
    tokenBaseUnits: bigint;
    serviceFeeUsdMicros: bigint;
    totalUsdMicros: bigint;
}
export declare function calculateServiceFee(amount: bigint, feeBps?: bigint): bigint;
export declare function buildQuote(input: QuoteInput): Quote;
export declare function resolveSalePhase(config: Pick<SaleConfig, "phase" | "startsAt" | "endsAt" | "claimStartsAt">, now?: Date): SalePhase;
export declare function resolveActivationPhase(eligibility: EligibilityMode, startsAt: string, endsAt: string, now?: Date): "scheduled" | "private" | "public";
export declare function validatePurchase(config: SaleConfig, usdMicros: bigint, purchasedUsdMicros: bigint, now?: Date): Quote;
export declare function normalizeWalletList(rows: string[]): string[];
export interface VestingSchedule {
    totalBaseUnits: bigint;
    claimedBaseUnits: bigint;
    startsAt: string;
    cliffAt?: string;
    endsAt: string;
}
export declare function vestedBaseUnits(schedule: VestingSchedule, now?: Date): bigint;
export declare function claimableBaseUnits(schedule: VestingSchedule, now?: Date): bigint;
export declare function assertAllocationAvailable(allocationBaseUnits: bigint, soldBaseUnits: bigint, requestedBaseUnits: bigint): void;
export interface TransactionAccountMeta {
    address: string;
    signer: boolean;
    writable: boolean;
    label?: string;
}
export interface TransactionInstructionReview {
    index: number;
    programId: string;
    programName: string;
    accounts: TransactionAccountMeta[];
    dataBase64: string;
    summary: string;
}
export interface TransactionFeeReview {
    networkFeeLamports: bigint;
    serviceFeeLamports: bigint;
    rentLamports: bigint;
    totalLamports: bigint;
}
export interface TransactionReviewPlan {
    id: string;
    cluster: "devnet" | "mainnet-beta";
    feePayer: string;
    recentBlockhash?: string;
    instructions: TransactionInstructionReview[];
    fees: TransactionFeeReview;
    recipients: Array<{
        address: string;
        label: string;
        amountBaseUnits?: bigint;
        mint?: string;
    }>;
    serializedTransactionBase64?: string;
    expiresAt?: string;
    simulation?: {
        ok: boolean;
        unitsConsumed?: number;
        error?: string;
    };
}
export declare function validateSaleTiming(startsAt: string, endsAt: string, claimStartsAt: string): void;
export declare function validateSaleEconomics(input: {
    priceUsdMicros: bigint;
    allocationBaseUnits: bigint;
    minPurchaseUsdMicros: bigint;
    maxPurchaseUsdMicros: bigint;
}): void;
export declare function assertTransactionReview(plan: TransactionReviewPlan, now?: Date): void;
