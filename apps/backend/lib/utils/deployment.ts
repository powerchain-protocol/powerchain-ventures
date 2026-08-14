import { getDeploymentReadiness } from "@powerchain/launchpad-config";

export function requireMainnetDeploymentConfiguration(source: NodeJS.ProcessEnv = process.env) {
  const readiness = getDeploymentReadiness(source);
  if (readiness.mainnet && !readiness.configured) {
    throw new Error(`mainnet_deployment_incomplete:${[...readiness.missing, ...readiness.invalid].join(",")}`);
  }
  return readiness;
}
