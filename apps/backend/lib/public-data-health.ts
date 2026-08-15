import { checkPublicDataReadiness } from "./readiness/public-data-readiness";
import { POWERCHAIN_PUBLIC_DATA_PROVENANCE } from "@powerchain/token-data";

export function getPublicDataHealth() {
  const readiness = checkPublicDataReadiness();
  return {
    ready: readiness.ready,
    source: readiness.source,
    schemaVersion: readiness.schemaVersion,
    release: POWERCHAIN_PUBLIC_DATA_PROVENANCE.release,
    deploymentStatus: readiness.tokenDeploymentStatus,
    errors: readiness.errors,
    checkedAt: new Date().toISOString(),
  };
}
