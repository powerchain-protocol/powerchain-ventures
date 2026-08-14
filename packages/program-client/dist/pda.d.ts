import { PublicKey } from "@solana/web3.js";
export declare function deriveSalePda(input: {
    programId: string | PublicKey;
    creator: string | PublicKey;
    mint: string | PublicKey;
    saleId: string;
}): {
    address: any;
    bump: any;
    seed: NonSharedBuffer;
};
export declare function deriveVaultAuthorityPda(programId: string | PublicKey, salePda: string | PublicKey): {
    address: any;
    bump: any;
};
export declare function deriveParticipantPda(programId: string | PublicKey, salePda: string | PublicKey, wallet: string | PublicKey): {
    address: any;
    bump: any;
};
export declare function asKey(value: string | PublicKey): any;
