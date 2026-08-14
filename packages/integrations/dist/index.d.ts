export declare const HELIUS_MAINNET_RPC_BASE: "https://mainnet.helius-rpc.com/";
export declare const HELIUS_API_BASE: "https://api.helius.xyz";
export declare const BIRDEYE_API_BASE: "https://public-api.birdeye.so";
export type FetchLike = typeof fetch;
export type IntegrationRequestOptions = {
    fetcher?: FetchLike;
    timeoutMs?: number;
};
export declare function heliusRpcUrl(apiKey: string, base?: string): string;
export declare function heliusRpc<T>(input: {
    apiKey: string;
    method: string;
    params?: unknown[];
    rpcBase?: string;
}, options?: IntegrationRequestOptions): Promise<T & ({} | null)>;
export declare function birdeyeHeaders(apiKey: string): {
    accept: string;
    "X-API-KEY": string;
    "x-chain": string;
};
export declare function birdeyePrice(input: {
    apiKey: string;
    mint: string;
    baseUrl?: string;
}, options?: IntegrationRequestOptions): Promise<{
    success?: boolean;
    data?: {
        value?: number;
        updateUnixTime?: number;
        liquidity?: number;
    } | null;
}>;
export declare function birdeyeTokenOverview(input: {
    apiKey: string;
    mint: string;
    baseUrl?: string;
}, options?: IntegrationRequestOptions): Promise<{
    success?: boolean;
    data?: Record<string, unknown> | null;
}>;
