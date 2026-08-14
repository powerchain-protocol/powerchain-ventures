type Env = Record<string, string | undefined>;
export type SolanaCluster = "devnet" | "mainnet-beta";
export interface PublicRuntimeConfig {
    appUrl: string;
    solanaCluster: SolanaCluster;
    solanaRpcUrl: string;
}
export interface ServerRuntimeConfig extends PublicRuntimeConfig {
    backendOrigin: string;
    rpcUrls: string[];
    expectedGenesisPrefix: string;
    supabaseUrl: string;
    treasuryWallet: string;
    transactionBuilderUrl: string;
    allowedOrigins: string[];
    launchpadProgramId: string;
    quoteAuthorityWallet: string;
}
export declare function getPublicRuntimeConfig(source?: Env): PublicRuntimeConfig;
export declare function getServerRuntimeConfig(source?: Env): ServerRuntimeConfig;
export {};
