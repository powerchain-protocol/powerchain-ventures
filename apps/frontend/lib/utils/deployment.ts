import type { DeploymentState } from "../../context/powerchain-config-context";

export function deploymentIssueSummary(state: DeploymentState | null | undefined): string[] {
  if (!state) return ["Deployment configuration unavailable"];
  return [...state.missing, ...state.invalid];
}

export function deploymentReady(state: DeploymentState | null | undefined): boolean {
  return Boolean(state?.configured && state.presaleMintConfigured && state.presaleVaultConfigured && state.presaleVaultAuthorityConfigured && state.treasuryConfigured);
}
