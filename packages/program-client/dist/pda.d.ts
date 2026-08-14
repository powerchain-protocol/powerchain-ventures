import { PublicKey } from "@solana/web3.js";
export declare function deriveSalePda(input: {
    programId: string | PublicKey;
    creator: string | PublicKey;
    mint: string | PublicKey;
    saleId: string;
}): {
    address: PublicKey;
    bump: number;
    seed: NonSharedBuffer;
};
export declare function deriveVaultAuthorityPda(programId: string | PublicKey, salePda: string | PublicKey): {
    address: PublicKey;
    bump: number;
};
export declare function deriveParticipantPda(programId: string | PublicKey, salePda: string | PublicKey, wallet: string | PublicKey): {
    address: PublicKey;
    bump: number;
};
export declare function asKey(value: string | PublicKey): PublicKey;
