import { getPublicRegistry } from "../public-data";

export type PublicDataReadiness = {
  readonly ready: boolean;
  readonly source: "powerchain-token-data";
  readonly schemaVersion: 1;
  readonly tokenDeploymentStatus: string;
  readonly errors: readonly string[];
};

export function checkPublicDataReadiness(): PublicDataReadiness {
  const errors: string[] = [];
  try {
    const registry = getPublicRegistry();
    const pwrc = registry.data.tokens.PWRC.token;
    if (registry.schemaVersion !== 1) errors.push("unexpected public-data schema version");
    if (pwrc.deploymentStatus === "verified" && !pwrc.mintAddress) {
      errors.push("verified PWRC deployment is missing mintAddress");
    }
    return {
      ready: errors.length === 0,
      source: "powerchain-token-data",
      schemaVersion: 1,
      tokenDeploymentStatus: pwrc.deploymentStatus,
      errors,
    };
  } catch (error) {
    return {
      ready: false,
      source: "powerchain-token-data",
      schemaVersion: 1,
      tokenDeploymentStatus: "unknown",
      errors: [error instanceof Error ? error.message : "public-data validation failed"],
    };
  }
}
