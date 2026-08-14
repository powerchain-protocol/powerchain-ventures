import type { TransactionInstruction } from "@solana/web3.js";
import { buildClaimInstruction, buildLifecycleInstruction, buildPurchaseInstruction, buildUpdateTimingInstruction, type InitializeSaleInstructionInput } from "./instructions.js";
export type ProgramOperation = {
    name: "initialize-sale" | "adopt-vault-authority" | "purchase" | "claim" | "pause" | "resume" | "update-timing" | "cancel" | "complete";
    instruction: TransactionInstruction;
    salePda?: string;
    participantPda?: string;
    vaultAuthorityPda?: string;
};
export declare function buildSaleActivationOperations(input: InitializeSaleInstructionInput): ProgramOperation[];
export declare function buildPurchaseOperation(input: Parameters<typeof buildPurchaseInstruction>[0]): ProgramOperation;
export declare function buildClaimOperation(input: Parameters<typeof buildClaimInstruction>[0]): ProgramOperation;
export declare function buildLifecycleOperation(input: Parameters<typeof buildLifecycleInstruction>[0]): ProgramOperation;
export declare function buildPauseOperation(input: {
    programId: string;
    salePda: string;
    creatorWallet: string;
    paused: boolean;
}): ProgramOperation;
export declare function buildTimingOperation(input: Parameters<typeof buildUpdateTimingInstruction>[0]): ProgramOperation;
