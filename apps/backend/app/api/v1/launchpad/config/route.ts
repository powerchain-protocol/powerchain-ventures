import {integrationStatus} from "../../../../../lib/integrations/config";
import {
  DEFAULT_PRESALE_DURATION_DAYS,
  DEFAULT_QUOTE_TTL_SECONDS,
  getDeploymentReadiness,
  getPresaleConfig,
  POWERCHAIN_APP_NAME,
  POWERCHAIN_SERVICE_FEE_BPS,
  POWERCHAIN_FEE_WALLET_ADDRESS,
  POWERCHAIN_LAUNCHPAD_PROGRAM_ID,
  POWERCHAIN_VERSION,
  SOLANA_MAINNET_GENESIS_PREFIX,
  SOLANA_TOKEN_2022_PROGRAM_ID,
} from "@powerchain/launchpad-config";
import {json} from "../../../../../lib/http";

export async function GET(){
 const cluster=process.env.NEXT_PUBLIC_SOLANA_CLUSTER==="devnet"?"devnet":"mainnet-beta";
 const presale=getPresaleConfig(process.env);
 const deployment=getDeploymentReadiness(process.env);
 return json({
  name:POWERCHAIN_APP_NAME,
  version:POWERCHAIN_VERSION,
  cluster,
  serviceFeeBps:POWERCHAIN_SERVICE_FEE_BPS,
  feeWallet:POWERCHAIN_FEE_WALLET_ADDRESS,
  launchpadProgramId:process.env.POWERCHAIN_LAUNCHPAD_PROGRAM_ID?.trim()||POWERCHAIN_LAUNCHPAD_PROGRAM_ID,
  launchpadProgramIdConfigured:Boolean(process.env.POWERCHAIN_LAUNCHPAD_PROGRAM_ID?.trim()||POWERCHAIN_LAUNCHPAD_PROGRAM_ID),
  integrations:integrationStatus(),
  tokenProgram:"Token-2022",
  tokenProgramId:SOLANA_TOKEN_2022_PROGRAM_ID,
  mainnetGenesisPrefix:SOLANA_MAINNET_GENESIS_PREFIX,
  explorerBaseUrl:"https://explorer.solana.com",
  quoteTtlSeconds:Number(process.env.QUOTE_TTL_SECONDS??DEFAULT_QUOTE_TTL_SECONDS),
  deployment:{
   configured:deployment.configured,
   missing:deployment.missing,
   invalid:deployment.invalid,
   presaleMintConfigured:deployment.presaleMintConfigured,
   presaleVaultConfigured:deployment.presaleVaultConfigured,
   presaleVaultAuthorityConfigured:deployment.presaleVaultAuthorityConfigured,
   treasuryConfigured:deployment.treasuryConfigured,
   quoteAuthorityConfigured:deployment.quoteAuthorityConfigured,
  },
  presale:{
   allocationTokens:presale.allocationTokens,
   startsAt:presale.startsAt??null,
   endsAt:presale.endsAt??null,
   claimStartsAt:presale.claimStartsAt??null,
   priceUsd:presale.priceUsd??null,
   minPurchaseUsd:presale.minPurchaseUsd??null,
   maxPurchaseUsd:presale.maxPurchaseUsd??null,
   mint:presale.mint??null,
   vaultTokenAccount:presale.vaultTokenAccount??null,
   vaultAuthority:presale.vaultAuthority??null,
   treasuryWallet:presale.treasuryWallet??null,
   defaultDurationDays:DEFAULT_PRESALE_DURATION_DAYS,
  }
 });
}
