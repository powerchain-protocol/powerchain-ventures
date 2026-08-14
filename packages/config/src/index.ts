import {
  DEFAULT_PRESALE_ALLOCATION_TOKENS,
  DEFAULT_PRESALE_DURATION_DAYS,
  DEFAULT_QUOTE_TTL_SECONDS,
  POWERCHAIN_APP_NAME,
  POWERCHAIN_SERVICE_FEE_BPS,
  POWERCHAIN_FEE_WALLET_ADDRESS,
  POWERCHAIN_PWRC_MINT_ADDRESS,
  POWERCHAIN_VERSION,
  SOLANA_MAINNET_GENESIS_PREFIX,
  SOLANA_MAINNET_PUBLIC_RPC_HOSTS,
  SOLANA_TOKEN_2022_PROGRAM_ID,
} from "./constants.js";

type Env = Record<string,string|undefined>;
const env: Env = (globalThis as typeof globalThis & {process?:{env?:Env}}).process?.env ?? {};

export const networkConfig = {
  devnet: { cluster: "devnet", rpcUrl: env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com" },
  mainnet: { cluster: "mainnet-beta", rpcUrl: env.NEXT_PUBLIC_SOLANA_RPC_URL },
} as const;

export const appConfig = {
  name: POWERCHAIN_APP_NAME,
  version: POWERCHAIN_VERSION,
  serviceFeeBps: POWERCHAIN_SERVICE_FEE_BPS,
} as const;

export {
  DEFAULT_PRESALE_ALLOCATION_TOKENS,
  DEFAULT_PRESALE_DURATION_DAYS,
  DEFAULT_QUOTE_TTL_SECONDS,
  POWERCHAIN_APP_NAME,
  POWERCHAIN_SERVICE_FEE_BPS,
  POWERCHAIN_FEE_WALLET_ADDRESS,
  POWERCHAIN_PWRC_MINT_ADDRESS,
  POWERCHAIN_LAUNCHPAD_PROGRAM_ID,
  POWERCHAIN_VERSION,
  SOLANA_MAINNET_GENESIS_PREFIX,
  SOLANA_MAINNET_PUBLIC_RPC_HOSTS,
  SOLANA_TOKEN_2022_PROGRAM_ID,
} from "./constants.js";

export function explorerUrl(kind:"address"|"tx"|"token", value:string, cluster:"devnet"|"mainnet-beta"="mainnet-beta") {
  const path=kind==="tx"?`tx/${value}`:`address/${value}`;
  return `https://explorer.solana.com/${path}${cluster==="devnet"?"?cluster=devnet":""}`;
}

export interface PresaleConfig {
  allocationTokens: string;
  startsAt: string|undefined;
  endsAt: string|undefined;
  claimStartsAt: string|undefined;
  priceUsd: string|undefined;
  minPurchaseUsd: string|undefined;
  maxPurchaseUsd: string|undefined;
  mint: string|undefined;
  vaultTokenAccount: string|undefined;
  vaultAuthority: string|undefined;
  treasuryWallet: string|undefined;
}

/**
 * Single configuration boundary for the PowerChain presale. Values are env-driven
 * so allocation, dates and pricing can be changed without touching transaction logic.
 */
export function getPresaleConfig(source:Env=env):PresaleConfig {
  return {
    allocationTokens: source.POWERCHAIN_PRESALE_ALLOCATION_TOKENS ?? DEFAULT_PRESALE_ALLOCATION_TOKENS,
    startsAt: source.POWERCHAIN_PRESALE_STARTS_AT,
    endsAt: source.POWERCHAIN_PRESALE_ENDS_AT,
    claimStartsAt: source.POWERCHAIN_PRESALE_CLAIM_STARTS_AT,
    priceUsd: source.POWERCHAIN_PRESALE_PRICE_USD,
    minPurchaseUsd: source.POWERCHAIN_PRESALE_MIN_PURCHASE_USD,
    maxPurchaseUsd: source.POWERCHAIN_PRESALE_MAX_PURCHASE_USD,
    mint: source.POWERCHAIN_PRESALE_MINT ?? POWERCHAIN_PWRC_MINT_ADDRESS ?? undefined,
    vaultTokenAccount: source.POWERCHAIN_PRESALE_VAULT_TOKEN_ACCOUNT,
    vaultAuthority: source.POWERCHAIN_PRESALE_VAULT_AUTHORITY,
    treasuryWallet: source.POWERCHAIN_TREASURY_WALLET ?? POWERCHAIN_FEE_WALLET_ADDRESS,
  };
}

export function tokenAmountToBaseUnits(value:string,decimals:number):bigint {
  if(!Number.isInteger(decimals)||decimals<0||decimals>18)throw new Error("invalid token decimals");
  const [whole="0",fraction=""] = value.trim().split(".");
  if(!/^\d+$/.test(whole)||!/^\d*$/.test(fraction)||fraction.length>decimals)throw new Error("invalid token amount");
  return BigInt(whole)*(10n**BigInt(decimals))+BigInt((fraction+"0".repeat(decimals)).slice(0,decimals)||"0");
}

export function createDefaultPresaleTimes(now=new Date(),durationDays=DEFAULT_PRESALE_DURATION_DAYS){
  const start=new Date(now.getTime()+60*60*1000);
  const end=new Date(start.getTime()+durationDays*24*60*60*1000);
  const claim=new Date(end);
  return {startsAt:start.toISOString(),endsAt:end.toISOString(),claimStartsAt:claim.toISOString()};
}

export * from "./runtime.js";

export * from "./deployment.js";
