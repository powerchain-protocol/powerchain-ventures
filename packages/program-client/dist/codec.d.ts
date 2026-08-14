export declare const PROGRAM_INSTRUCTION_TAG: {
    readonly initializeSale: 0;
    readonly updateTiming: 1;
    readonly setPaused: 2;
    readonly purchase: 3;
    readonly claim: 4;
    readonly cancelSale: 5;
    readonly completeSale: 6;
    readonly adoptVaultAuthority: 7;
};
export type LaunchpadOperationName = keyof typeof PROGRAM_INSTRUCTION_TAG;
export declare function saleSeedFromId(saleId: string): NonSharedBuffer;
export type InitializeSaleCodecArgs = {
    saleSeed: Uint8Array;
    decimals: number;
    eligibility: number;
    vestingEnabled: boolean;
    deliveryOnClaim: boolean;
    quoteAuthority: Uint8Array;
    startsAt: number | bigint;
    endsAt: number | bigint;
    claimStartsAt: number | bigint;
    vestingCliffAt: number | bigint;
    vestingEndsAt: number | bigint;
    allocationBaseUnits: string | bigint;
    priceUsdMicros: string | bigint;
    minPurchaseUsdMicros: string | bigint;
    maxPurchaseUsdMicros: string | bigint;
};
export declare function encodeInitializeSale(a: InitializeSaleCodecArgs): Buffer<ArrayBuffer>;
export declare function encodeUpdateTiming(a: {
    startsAt: number | bigint;
    endsAt: number | bigint;
    claimStartsAt: number | bigint;
    vestingCliffAt: number | bigint;
    vestingEndsAt: number | bigint;
}): Buffer<ArrayBuffer>;
export declare function encodeSetPaused(paused: boolean): Buffer<ArrayBuffer>;
export declare function encodePurchase(a: {
    tokenAmountBaseUnits: string | bigint;
    paymentLamports: string | bigint;
    serviceFeeLamports: string | bigint;
    purchaseNonce: string | bigint;
}): Buffer<ArrayBuffer>;
export declare function encodeClaim(amountBaseUnits: string | bigint): Buffer<ArrayBuffer>;
export declare function encodeNoArgs(name: "cancelSale" | "completeSale" | "adoptVaultAuthority"): Buffer<ArrayBuffer>;
