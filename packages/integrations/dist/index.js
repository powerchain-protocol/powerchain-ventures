export const HELIUS_MAINNET_RPC_BASE = "https://mainnet.helius-rpc.com/";
export const HELIUS_API_BASE = "https://api.helius.xyz";
export const BIRDEYE_API_BASE = "https://public-api.birdeye.so";
async function fetchJson(url, init, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 8000);
    try {
        const r = await (options.fetcher ?? fetch)(url, { ...init, signal: controller.signal, cache: "no-store" });
        const text = await r.text();
        if (!r.ok)
            throw new Error(`integration_http_${r.status}:${text.slice(0, 200)}`);
        return JSON.parse(text);
    }
    finally {
        clearTimeout(timer);
    }
}
export function heliusRpcUrl(apiKey, base = HELIUS_MAINNET_RPC_BASE) { if (!apiKey.trim())
    throw new Error("helius_api_key_required"); const u = new URL(base); u.searchParams.set("api-key", apiKey.trim()); return u.toString(); }
export async function heliusRpc(input, options = {}) {
    const body = { jsonrpc: "2.0", id: crypto.randomUUID(), method: input.method, params: input.params ?? [] };
    const result = await fetchJson(heliusRpcUrl(input.apiKey, input.rpcBase), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }, options);
    if (result.error)
        throw new Error(`helius_rpc_${result.error.code}:${result.error.message}`);
    if (result.result === undefined)
        throw new Error("helius_rpc_missing_result");
    return result.result;
}
export function birdeyeHeaders(apiKey) { if (!apiKey.trim())
    throw new Error("birdeye_api_key_required"); return { accept: "application/json", "X-API-KEY": apiKey.trim(), "x-chain": "solana" }; }
export async function birdeyePrice(input, options = {}) {
    const u = new URL("/defi/price", input.baseUrl ?? BIRDEYE_API_BASE);
    u.searchParams.set("address", input.mint);
    u.searchParams.set("include_liquidity", "true");
    return fetchJson(u.toString(), { headers: birdeyeHeaders(input.apiKey) }, options);
}
export async function birdeyeTokenOverview(input, options = {}) {
    const u = new URL("/defi/token_overview", input.baseUrl ?? BIRDEYE_API_BASE);
    u.searchParams.set("address", input.mint);
    u.searchParams.set("frames", "1h,24h");
    u.searchParams.set("ui_amount_mode", "raw");
    return fetchJson(u.toString(), { headers: birdeyeHeaders(input.apiKey) }, options);
}
