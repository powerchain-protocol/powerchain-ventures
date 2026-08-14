import { TransactionInstruction, PublicKey } from "@solana/web3.js";
export declare function eligibilityCode(value: "public" | "allowlist" | "trusted"): 0 | 1 | 2;
export type InitializeSaleInstructionInput = {
    programId: string;
    saleId: string;
    creatorWallet: string;
    mint: string;
    sourceVaultTokenAccount: string;
    sourceVaultAuthority: string;
    paymentReceiverWallet: string;
    decimals: number;
    eligibility: "public" | "allowlist" | "trusted";
    vestingEnabled: boolean;
    deliveryMode: "immediate" | "claim";
    quoteAuthorityWallet: string;
    startsAt: string;
    endsAt: string;
    claimStartsAt: string;
    vestingCliffAt: string;
    vestingEndsAt: string;
    allocationBaseUnits: string;
    priceUsdMicros: string;
    minPurchaseUsdMicros: string;
    maxPurchaseUsdMicros: string;
};
export declare function buildInitializeSaleInstruction(input: InitializeSaleInstructionInput): {
    salePda: PublicKey;
    vaultAuthorityPda: PublicKey;
    instruction: TransactionInstruction;
};
export declare function buildAdoptVaultAuthorityInstruction(input: {
    programId: string;
    salePda: string;
    currentVaultAuthority: string;
    sourceVaultTokenAccount: string;
}): {
    vaultAuthorityPda: PublicKey;
    instruction: TransactionInstruction;
};
export declare function buildPurchaseInstruction(input: {
    programId: string;
    salePda: string;
    wallet: string;
    quoteAuthorityWallet: string;
    sourceVaultTokenAccount: string;
    destinationTokenAccount: string;
    mint: string;
    paymentReceiverWallet: string;
    tokenAmountBaseUnits: string;
    paymentLamports: string;
    serviceFeeLamports: string;
    purchaseNonce: string;
}): {
    participantPda: PublicKey;
    vaultAuthorityPda: PublicKey;
    instruction: TransactionInstruction;
};
export declare function buildClaimInstruction(input: {
    programId: string;
    salePda: string;
    wallet: string;
    sourceVaultTokenAccount: string;
    destinationTokenAccount: string;
    mint: string;
    amountBaseUnits: string;
}): {
    participantPda: PublicKey;
    vaultAuthorityPda: PublicKey;
    instruction: TransactionInstruction;
};
export declare function buildSetPausedInstruction(input: {
    programId: string;
    salePda: string;
    creatorWallet: string;
    paused: boolean;
}): TransactionInstruction;
export declare function buildUpdateTimingInstruction(input: {
    programId: string;
    salePda: string;
    creatorWallet: string;
    startsAt: string;
    endsAt: string;
    claimStartsAt: string;
    vestingCliffAt: string;
    vestingEndsAt: string;
}): TransactionInstruction;
export declare function buildLifecycleInstruction(input: {
    programId: string;
    salePda: string;
    creatorWallet: string;
    action: "cancel" | "complete";
}): TransactionInstruction;
