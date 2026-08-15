import {
  POWERCHAIN_CAPABILITIES,
  PWRC_TOKEN,
} from "@powerchain/token-data";

export function getRuntimeCapabilities() {
  return {
    ...POWERCHAIN_CAPABILITIES,
    tokenDeploymentStatus: PWRC_TOKEN.deploymentStatus,
    tokenMintVerified: PWRC_TOKEN.deploymentStatus === "verified" && Boolean(PWRC_TOKEN.mintAddress),
  };
}
