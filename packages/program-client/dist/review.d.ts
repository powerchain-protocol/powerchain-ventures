import type { ProgramOperation } from "./operations.js";
export declare function operationToReview(operation: ProgramOperation, index?: number): {
    index: number;
    programId: any;
    programName: string;
    accounts: any;
    dataBase64: string;
    summary: string;
};
