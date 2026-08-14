export declare const TOKEN_2022_PROGRAM_ID = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
export declare function explorerTx(signature: string, cluster?: "devnet" | "mainnet-beta"): string;
export declare function rpcCall<T>(rpcUrl: string, method: string, params?: unknown[], timeoutMs?: number): Promise<T>;
/** Returns the exact serialized Solana message, excluding transaction signatures. */
export declare function transactionMessageBytes(serialized: Uint8Array): Uint8Array<ArrayBuffer>;
