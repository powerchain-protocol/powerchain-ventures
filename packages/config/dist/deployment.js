import { REQUIRED_MAINNET_DEPLOYMENT_ENV, SOLANA_MAINNET_CLUSTER, SOLANA_MAINNET_PUBLIC_RPC_HOSTS, SOLANA_SYSTEM_PROGRAM_ID, POWERCHAIN_FEE_WALLET_ADDRESS, } from "./constants.js";
const SOLANA_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
function trimmed(source, key) {
    return source[key]?.trim() ?? "";
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
/**
 * Pure configuration validation only. It does not prove that the mint/vault are
 * funded or controlled; live RPC validation remains authoritative for that.
 */
export function getDeploymentReadiness(source) {
    const cluster = trimmed(source, "NEXT_PUBLIC_SOLANA_CLUSTER") || SOLANA_MAINNET_CLUSTER;
    const mainnet = cluster === SOLANA_MAINNET_CLUSTER;
    const missing = mainnet
        ? REQUIRED_MAINNET_DEPLOYMENT_ENV.filter((key) => !trimmed(source, key))
        : [];
    const invalid = [];
    const heliusRpc = trimmed(source, "HELIUS_API_KEY")
        ? trimmed(source, "HELIUS_RPC_URL") || "https://mainnet.helius-rpc.com/"
        : "";
    const rpcByIdentity = new Map();
    for (const value of [
        trimmed(source, "SOLANA_RPC_URL"),
        heliusRpc,
        trimmed(source, "SOLANA_RPC_FALLBACK_URL"),
        ...trimmed(source, "SOLANA_RPC_FALLBACK_URLS").split(",").map((value) => value.trim()),
    ].filter(Boolean))
        if (!rpcByIdentity.has(rpcIdentity(value)))
            rpcByIdentity.set(rpcIdentity(value), value);
    const rpcUrls = [...rpcByIdentity.values()];
    for (const [key, value] of [
        ["POWERCHAIN_TREASURY_WALLET", trimmed(source, "POWERCHAIN_TREASURY_WALLET") || POWERCHAIN_FEE_WALLET_ADDRESS],
        ["POWERCHAIN_LAUNCHPAD_PROGRAM_ID", trimmed(source, "POWERCHAIN_LAUNCHPAD_PROGRAM_ID")],
        ["POWERCHAIN_QUOTE_AUTHORITY_WALLET", trimmed(source, "POWERCHAIN_QUOTE_AUTHORITY_WALLET")],
        ["POWERCHAIN_PRESALE_MINT", trimmed(source, "POWERCHAIN_PRESALE_MINT")],
        ["POWERCHAIN_PRESALE_VAULT_TOKEN_ACCOUNT", trimmed(source, "POWERCHAIN_PRESALE_VAULT_TOKEN_ACCOUNT")],
        ["POWERCHAIN_PRESALE_VAULT_AUTHORITY", trimmed(source, "POWERCHAIN_PRESALE_VAULT_AUTHORITY")],
    ]) {
        if (value && !SOLANA_ADDRESS.test(value))
            invalid.push(`${key}:invalid_solana_address`);
    }
    const treasury = trimmed(source, "POWERCHAIN_TREASURY_WALLET") || POWERCHAIN_FEE_WALLET_ADDRESS;
    if (treasury === SOLANA_SYSTEM_PROGRAM_ID) {
        invalid.push("POWERCHAIN_TREASURY_WALLET:system_program_is_not_a_treasury");
    }
    if (treasury !== POWERCHAIN_FEE_WALLET_ADDRESS) {
        invalid.push("POWERCHAIN_TREASURY_WALLET:must_equal_canonical_powerchain_fee_wallet");
    }
    const dedicatedRpc = rpcUrls.length > 0 && rpcUrls.every((rpc) => {
        try {
            return !SOLANA_MAINNET_PUBLIC_RPC_HOSTS.has(new URL(rpc).hostname);
        }
        catch {
            return false;
        }
    });
    if (mainnet && rpcUrls.length < 2)
        invalid.push("SOLANA_RPC:mainnet_requires_redundancy");
    if (mainnet && !dedicatedRpc)
        invalid.push("SOLANA_RPC:mainnet_requires_dedicated_endpoints");
    return {
        configured: missing.length === 0 && invalid.length === 0,
        mainnet,
        missing,
        invalid,
        rpcCount: rpcUrls.length,
        dedicatedRpc,
        presaleMintConfigured: Boolean(trimmed(source, "POWERCHAIN_PRESALE_MINT")),
        presaleVaultConfigured: Boolean(trimmed(source, "POWERCHAIN_PRESALE_VAULT_TOKEN_ACCOUNT")),
        presaleVaultAuthorityConfigured: Boolean(trimmed(source, "POWERCHAIN_PRESALE_VAULT_AUTHORITY")),
        treasuryConfigured: Boolean(treasury) && treasury !== SOLANA_SYSTEM_PROGRAM_ID,
        quoteAuthorityConfigured: Boolean(trimmed(source, "POWERCHAIN_QUOTE_AUTHORITY_WALLET")),
    };
}
