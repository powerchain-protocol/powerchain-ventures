import { POWERCHAIN_SECURITY_POLICY } from "@powerchain/token-data";

export type RateLimitBucket =
  | "public-metadata"
  | "public-health"
  | "authenticated-mutation";

export function rateLimitFor(bucket: RateLimitBucket): {
  readonly limit: number;
  readonly windowSeconds: 60;
} {
  switch (bucket) {
    case "public-health":
      return {
        limit: POWERCHAIN_SECURITY_POLICY.rateLimits.publicHealthPerMinute,
        windowSeconds: 60,
      };
    case "authenticated-mutation":
      return {
        limit: POWERCHAIN_SECURITY_POLICY.rateLimits.authenticatedMutationPerMinute,
        windowSeconds: 60,
      };
    default:
      return {
        limit: POWERCHAIN_SECURITY_POLICY.rateLimits.publicMetadataPerMinute,
        windowSeconds: 60,
      };
  }
}
