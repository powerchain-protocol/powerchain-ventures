export const POWERCHAIN_APP_NAME = "PowerChain Launchpad";
export const POWERCHAIN_VERSION = "1.0.0";
export const POWERCHAIN_SERVICE_FEE_BPS = 250;
export const POWERCHAIN_SERVICE_FEE_PERCENT = 2.5;
export const POWERCHAIN_FEE_WALLET_ADDRESS = "FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy";
export const POWERCHAIN_PWRC_SYMBOL = "PWRC";
export const POWERCHAIN_PWRC_DECIMALS = 9;
export const SOLANA_LAMPORTS_PER_SOL = 1000000000n;
export const SOLANA_WRAPPED_NATIVE_MINT_ADDRESS = "So11111111111111111111111111111111111111112";
/** Canonical PWRC mainnet mint. Intentionally unset until the real deployed Token-2022 mint is supplied. */
export const POWERCHAIN_PWRC_MINT_ADDRESS = null;
/** Real deployed PowerChain Launchpad program. Intentionally unset until deployment is verified. */
export const POWERCHAIN_LAUNCHPAD_PROGRAM_ID = null;
export const SOLANA_MAINNET_CLUSTER = "mainnet-beta";
export const SOLANA_DEVNET_CLUSTER = "devnet";
export const SOLANA_MAINNET_GENESIS_PREFIX = "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp";
export const SOLANA_TOKEN_2022_PROGRAM_ID = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
export const SOLANA_SYSTEM_PROGRAM_ID = "11111111111111111111111111111111";
export const SOLANA_MAINNET_PUBLIC_RPC_HOSTS = new Set([
    "api.mainnet.solana.com",
    "api.mainnet-beta.solana.com",
]);
export const DEFAULT_PRESALE_ALLOCATION_TOKENS = "5000000000";
export const DEFAULT_PRESALE_DURATION_DAYS = 30;
export const DEFAULT_QUOTE_TTL_SECONDS = 60;
export const DEFAULT_RATE_LIMIT_REQUESTS_PER_MINUTE = 60;
/**
 * These values identify the real mainnet deployment and MUST be supplied by the
 * operator. They intentionally have no fallback values in source control.
 */
export const REQUIRED_MAINNET_DEPLOYMENT_ENV = [
    "SOLANA_RPC_URL",
    "POWERCHAIN_LAUNCHPAD_PROGRAM_ID",
    "POWERCHAIN_QUOTE_AUTHORITY_WALLET",
    "POWERCHAIN_PRESALE_MINT",
    "POWERCHAIN_PRESALE_VAULT_TOKEN_ACCOUNT",
    "POWERCHAIN_PRESALE_VAULT_AUTHORITY",
    "POWERCHAIN_TRANSACTION_BUILDER_URL",
    "POWERCHAIN_TRANSACTION_BUILDER_API_KEY",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
];
