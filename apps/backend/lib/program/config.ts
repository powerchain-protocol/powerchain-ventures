import {POWERCHAIN_FEE_WALLET_ADDRESS,SOLANA_TOKEN_2022_PROGRAM_ID} from "@powerchain/launchpad-config";
import {PublicKey} from "@solana/web3.js";

export const LAUNCHPAD_PROGRAM_STATE_VERSION=1;
export type ProgramMode="external-builder"|"onchain-v1";

export function configuredLaunchpadProgramId(){const value=process.env.POWERCHAIN_LAUNCHPAD_PROGRAM_ID?.trim()??"";if(!value)return null;try{return new PublicKey(value).toBase58()}catch{throw new Error("POWERCHAIN_LAUNCHPAD_PROGRAM_ID is not a valid Solana program address")}}
export function configuredQuoteAuthorityWallet(){const value=process.env.POWERCHAIN_QUOTE_AUTHORITY_WALLET?.trim()??"";if(!value)return null;try{return new PublicKey(value).toBase58()}catch{throw new Error("POWERCHAIN_QUOTE_AUTHORITY_WALLET is not a valid Solana address")}}
export function launchpadProgramMode():ProgramMode{return configuredLaunchpadProgramId()?"onchain-v1":"external-builder"}
export function programRuntimePolicy(){return {version:LAUNCHPAD_PROGRAM_STATE_VERSION,programId:configuredLaunchpadProgramId(),mode:launchpadProgramMode(),feeWallet:POWERCHAIN_FEE_WALLET_ADDRESS,serviceFeeBps:250,tokenProgram:SOLANA_TOKEN_2022_PROGRAM_ID,quoteAuthorityWallet:configuredQuoteAuthorityWallet(),onchainPricingAuthority:"server-quote-signer",custodyMode:"vault-authority-pda" as const}}
