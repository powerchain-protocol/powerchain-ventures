import {
  getDeploymentReadiness,
  getPresaleConfig,
  getServerRuntimeConfig,
  POWERCHAIN_SERVICE_FEE_BPS,
  SOLANA_TOKEN_2022_PROGRAM_ID,
  POWERCHAIN_FEE_WALLET_ADDRESS,
} from "@powerchain/launchpad-config";
import { requireUsableSolanaWalletAddress } from "@powerchain/utils/helpers";

export function getBackendConfig() {
  const runtime = getServerRuntimeConfig(process.env);
  requireUsableSolanaWalletAddress(runtime.treasuryWallet, "POWERCHAIN_TREASURY_WALLET");
  return {
    runtime,
    presale: getPresaleConfig(process.env),
    deployment: getDeploymentReadiness(process.env),
    serviceFeeBps: POWERCHAIN_SERVICE_FEE_BPS,
    tokenProgramId: SOLANA_TOKEN_2022_PROGRAM_ID,
    feeWallet: POWERCHAIN_FEE_WALLET_ADDRESS,
    launchpadProgramId: process.env.POWERCHAIN_LAUNCHPAD_PROGRAM_ID?.trim() || undefined,
  };
}
