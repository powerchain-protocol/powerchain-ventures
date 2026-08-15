import { checkPublicDataReadiness } from "./public-data-readiness";
import { getRuntimeCapabilities } from "../runtime-capabilities";

export type AggregateReadiness = {
  readonly ready: boolean;
  readonly release: "1.0.0";
  readonly checks: {
    readonly publicData: ReturnType<typeof checkPublicDataReadiness>;
    readonly capabilities: ReturnType<typeof getRuntimeCapabilities>;
  };
  readonly blockers: readonly string[];
};

export function checkAggregateReadiness(): AggregateReadiness {
  const publicData = checkPublicDataReadiness();
  const capabilities = getRuntimeCapabilities();
  const blockers: string[] = [];

  if (!publicData.ready) blockers.push(...publicData.errors);

  // Configuration-ready PWRC is supported. "verified" must carry an actual mint.
  if (capabilities.tokenDeploymentStatus === "verified" && !capabilities.tokenMintVerified) {
    blockers.push("PWRC is marked verified without a verified mint address");
  }

  return {
    ready: blockers.length === 0,
    release: "1.0.0",
    checks: { publicData, capabilities },
    blockers,
  };
}
