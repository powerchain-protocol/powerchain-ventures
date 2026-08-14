type Env = Record<string, string | undefined>;
export declare const networkConfig: {
    readonly devnet: {
        readonly cluster: "devnet";
        readonly rpcUrl: string;
    };
    readonly mainnet: {
        readonly cluster: "mainnet-beta";
        readonly rpcUrl: string | undefined;
    };
};
export declare const appConfig: {
    readonly name: "PowerChain Launchpad";
    readonly version: "1.0.0";
    readonly serviceFeeBps: 250;
};
export { DEFAULT_PRESALE_ALLOCATION_TOKENS, DEFAULT_PRESALE_DURATION_DAYS, DEFAULT_QUOTE_TTL_SECONDS, POWERCHAIN_APP_NAME, POWERCHAIN_SERVICE_FEE_BPS, POWERCHAIN_FEE_WALLET_ADDRESS, POWERCHAIN_PWRC_MINT_ADDRESS, POWERCHAIN_LAUNCHPAD_PROGRAM_ID, POWERCHAIN_VERSION, SOLANA_MAINNET_GENESIS_PREFIX, SOLANA_MAINNET_PUBLIC_RPC_HOSTS, SOLANA_TOKEN_2022_PROGRAM_ID, } from "./constants.js";
export declare function explorerUrl(kind: "address" | "tx" | "token", value: string, cluster?: "devnet" | "mainnet-beta"): string;
export interface PresaleConfig {
    allocationTokens: string;
    startsAt: string | undefined;
    endsAt: string | undefined;
    claimStartsAt: string | undefined;
    priceUsd: string | undefined;
    minPurchaseUsd: string | undefined;
    maxPurchaseUsd: string | undefined;
    mint: string | undefined;
    vaultTokenAccount: string | undefined;
    vaultAuthority: string | undefined;
    treasuryWallet: string | undefined;
}
/**
 * Single configuration boundary for the PowerChain presale. Values are env-driven
 * so allocation, dates and pricing can be changed without touching transaction logic.
 */
export declare function getPresaleConfig(source?: Env): PresaleConfig;
export declare function tokenAmountToBaseUnits(value: string, decimals: number): bigint;
export declare function createDefaultPresaleTimes(now?: Date, durationDays?: 30): {
    startsAt: string;
    endsAt: string;
    claimStartsAt: string;
};
export * from "./runtime.js";
export * from "./deployment.js";
