import { POWERCHAIN_FEE_WALLET_ADDRESS, SOLANA_MAINNET_PUBLIC_RPC_HOSTS, SOLANA_SYSTEM_PROGRAM_ID } from "./constants.js";
const SOLANA_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
function requireValue(source, name) {
    const value = source[name]?.trim();
    if (!value)
        throw new Error(`${name} is required`);
    return value;
}
function requireUrl(source, name, production) {
    const value = requireValue(source, name);
    let url;
    try {
        url = new URL(value);
    }
    catch {
        throw new Error(`${name} must be a valid URL`);
    }
    if (production && url.protocol !== "https:")
        throw new Error(`${name} must use https in production`);
    return url.toString().replace(/\/$/, "");
}
function rpcIdentity(value) {
    try {
        const url = new URL(value);
        url.search = "";
        url.hash = "";
        return `${url.origin}${url.pathname}`.replace(/\/$/, "");
    }
    catch {
        return value;
    }
}
function dedupeRpcUrls(values) {
    const byIdentity = new Map();
    for (const value of values)
        if (!byIdentity.has(rpcIdentity(value)))
            byIdentity.set(rpcIdentity(value), value);
    return [...byIdentity.values()];
}
function clusterOf(source) {
    const cluster = source.NEXT_PUBLIC_SOLANA_CLUSTER?.trim();
    if (cluster !== "devnet" && cluster !== "mainnet-beta") {
        throw new Error("NEXT_PUBLIC_SOLANA_CLUSTER must be devnet or mainnet-beta");
    }
    return cluster;
}
export function getPublicRuntimeConfig(source = globalThis.process?.env ?? {}) {
    const production = source.NODE_ENV === "production";
    return {
        appUrl: requireUrl(source, "NEXT_PUBLIC_APP_URL", production),
        solanaCluster: clusterOf(source),
        solanaRpcUrl: requireUrl(source, "NEXT_PUBLIC_SOLANA_RPC_URL", production),
    };
}
export function getServerRuntimeConfig(source = globalThis.process?.env ?? {}) {
    const production = source.NODE_ENV === "production";
    const base = getPublicRuntimeConfig(source);
    let heliusRpc;
    const heliusApiKey = source.HELIUS_API_KEY?.trim();
    if (heliusApiKey) {
        let url;
        try {
            url = new URL(source.HELIUS_RPC_URL?.trim() || "https://mainnet.helius-rpc.com/");
        }
        catch {
            throw new Error("HELIUS_RPC_URL must be a valid URL");
        }
        url.searchParams.set("api-key", heliusApiKey);
        heliusRpc = url.toString();
    }
    const rpcUrls = dedupeRpcUrls([source.SOLANA_RPC_URL, heliusRpc, source.SOLANA_RPC_FALLBACK_URL, ...(source.SOLANA_RPC_FALLBACK_URLS ?? "").split(",")]
        .map(value => value?.trim())
        .filter((value) => Boolean(value)));
    if (!rpcUrls.length)
        throw new Error("SOLANA_RPC_URL is required");
    for (const rpc of rpcUrls) {
        let url;
        try {
            url = new URL(rpc);
        }
        catch {
            throw new Error("Solana RPC endpoints must be valid URLs");
        }
        if (production && url.protocol !== "https:")
            throw new Error("Solana RPC endpoints must use https in production");
    }
    if (production && base.solanaCluster === "mainnet-beta") {
        const browserRpcHost = new URL(base.solanaRpcUrl).hostname;
        if (SOLANA_MAINNET_PUBLIC_RPC_HOSTS.has(browserRpcHost)) {
            throw new Error("NEXT_PUBLIC_SOLANA_RPC_URL must not use a shared Solana mainnet endpoint in production");
        }
    }
    if (production && base.solanaCluster === "mainnet-beta" && rpcUrls.length < 2) {
        throw new Error("mainnet-beta production requires at least two Solana RPC endpoints");
    }
    if (production && base.solanaCluster === "mainnet-beta") {
        if (rpcUrls.some(rpc => { try {
            return SOLANA_MAINNET_PUBLIC_RPC_HOSTS.has(new URL(rpc).hostname);
        }
        catch {
            return true;
        } })) {
            throw new Error("mainnet-beta production requires dedicated/private Solana RPC endpoints");
        }
    }
    const expectedGenesisPrefix = (source.SOLANA_EXPECTED_GENESIS_PREFIX?.trim() || (base.solanaCluster === "mainnet-beta" ? "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp" : ""));
    if (production && base.solanaCluster === "mainnet-beta" && expectedGenesisPrefix !== "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp") {
        throw new Error("SOLANA_EXPECTED_GENESIS_PREFIX must identify Solana mainnet-beta");
    }
    const treasuryWallet = source.POWERCHAIN_TREASURY_WALLET?.trim() || POWERCHAIN_FEE_WALLET_ADDRESS;
    const launchpadProgramId = source.POWERCHAIN_LAUNCHPAD_PROGRAM_ID?.trim() ?? "";
    const quoteAuthorityWallet = source.POWERCHAIN_QUOTE_AUTHORITY_WALLET?.trim() ?? "";
    if (production && base.solanaCluster === "mainnet-beta" && !SOLANA_ADDRESS.test(launchpadProgramId))
        throw new Error("POWERCHAIN_LAUNCHPAD_PROGRAM_ID must be the real deployed Solana program address");
    if (production && base.solanaCluster === "mainnet-beta" && !SOLANA_ADDRESS.test(quoteAuthorityWallet))
        throw new Error("POWERCHAIN_QUOTE_AUTHORITY_WALLET must be the real quote-authority signer address");
    if (!SOLANA_ADDRESS.test(treasuryWallet))
        throw new Error("POWERCHAIN_TREASURY_WALLET must be a valid Solana address");
    if (treasuryWallet === SOLANA_SYSTEM_PROGRAM_ID)
        throw new Error("POWERCHAIN_TREASURY_WALLET cannot be the Solana System Program");
    if (treasuryWallet !== POWERCHAIN_FEE_WALLET_ADDRESS)
        throw new Error("POWERCHAIN_TREASURY_WALLET must equal the canonical PowerChain fee wallet");
    const allowedOrigins = (source.ALLOWED_ORIGINS ?? "").split(",").map(value => value.trim().replace(/\/+$/, "")).filter(Boolean);
    if (production && !allowedOrigins.length)
        throw new Error("ALLOWED_ORIGINS is required in production");
    return {
        ...base,
        backendOrigin: requireUrl(source, "BACKEND_ORIGIN", production),
        rpcUrls,
        expectedGenesisPrefix,
        supabaseUrl: requireUrl(source, "SUPABASE_URL", production),
        treasuryWallet,
        transactionBuilderUrl: requireUrl(source, "POWERCHAIN_TRANSACTION_BUILDER_URL", production),
        launchpadProgramId,
        quoteAuthorityWallet,
        allowedOrigins: [...new Set(allowedOrigins)],
    };
}
