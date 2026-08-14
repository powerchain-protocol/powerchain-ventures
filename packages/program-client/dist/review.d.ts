import type { ProgramOperation } from "./operations.js";
export declare function operationToReview(operation: ProgramOperation, index?: number): {
    index: number;
    programId: string;
    programName: string;
    accounts: {
        address: string;
        signer: boolean;
        writable: boolean;
        label: string;
    }[];
    dataBase64: string;
    summary: string;
};
