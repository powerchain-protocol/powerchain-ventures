export declare const POWERCHAIN_APP_NAME: "PowerChain Launchpad";
export declare const POWERCHAIN_VERSION: "1.0.0";
export declare const POWERCHAIN_SERVICE_FEE_BPS: 250;
export declare const POWERCHAIN_SERVICE_FEE_PERCENT: 2.5;
export declare const POWERCHAIN_FEE_WALLET_ADDRESS: "FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy";
export declare const POWERCHAIN_PWRC_SYMBOL: "PWRC";
export declare const POWERCHAIN_PWRC_DECIMALS: 9;
export declare const SOLANA_LAMPORTS_PER_SOL: 1000000000n;
export declare const SOLANA_WRAPPED_NATIVE_MINT_ADDRESS: "So11111111111111111111111111111111111111112";
/** Canonical PWRC mainnet mint. Intentionally unset until the real deployed Token-2022 mint is supplied. */
export declare const POWERCHAIN_PWRC_MINT_ADDRESS: string | null;
/** Real deployed PowerChain Launchpad program. Intentionally unset until deployment is verified. */
export declare const POWERCHAIN_LAUNCHPAD_PROGRAM_ID: string | null;
export declare const SOLANA_MAINNET_CLUSTER: "mainnet-beta";
export declare const SOLANA_DEVNET_CLUSTER: "devnet";
export declare const SOLANA_MAINNET_GENESIS_PREFIX: "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp";
export declare const SOLANA_TOKEN_2022_PROGRAM_ID: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
export declare const SOLANA_SYSTEM_PROGRAM_ID: "11111111111111111111111111111111";
export declare const SOLANA_MAINNET_PUBLIC_RPC_HOSTS: Set<string>;
export declare const DEFAULT_PRESALE_ALLOCATION_TOKENS: "5000000000";
export declare const DEFAULT_PRESALE_DURATION_DAYS: 30;
export declare const DEFAULT_QUOTE_TTL_SECONDS: 60;
export declare const DEFAULT_RATE_LIMIT_REQUESTS_PER_MINUTE: 60;
/**
 * These values identify the real mainnet deployment and MUST be supplied by the
 * operator. They intentionally have no fallback values in source control.
 */
export declare const REQUIRED_MAINNET_DEPLOYMENT_ENV: readonly ["SOLANA_RPC_URL", "POWERCHAIN_LAUNCHPAD_PROGRAM_ID", "POWERCHAIN_QUOTE_AUTHORITY_WALLET", "POWERCHAIN_PRESALE_MINT", "POWERCHAIN_PRESALE_VAULT_TOKEN_ACCOUNT", "POWERCHAIN_PRESALE_VAULT_AUTHORITY", "POWERCHAIN_TRANSACTION_BUILDER_URL", "POWERCHAIN_TRANSACTION_BUILDER_API_KEY", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
export type MainnetDeploymentEnvName = typeof REQUIRED_MAINNET_DEPLOYMENT_ENV[number];
