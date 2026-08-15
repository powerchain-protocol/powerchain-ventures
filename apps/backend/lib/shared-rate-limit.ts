import { sha256Hex } from "@powerchain/token-data";
import { rateLimitFor, type RateLimitBucket } from "./rate-limit-policy";
import { getRuntimePersistence } from "./runtime-persistence";

export async function consumeSharedRateLimit(
  bucket: RateLimitBucket,
  identity: string,
  now = new Date(),
) {
  const policy = rateLimitFor(bucket);
  const identityHash = await sha256Hex(identity);
  const result = await getRuntimePersistence().rateLimit.consume({
    bucket,
    identityHash,
    limit: policy.limit,
    windowSeconds: policy.windowSeconds,
    now,
  });

  return {
    allowed: result.allowed,
    limit: policy.limit,
    remaining: result.remaining,
    resetAt: result.resetAt.getTime(),
    retryAfterSeconds: result.allowed
      ? 0
      : Math.max(1, Math.ceil((result.resetAt.getTime() - now.getTime()) / 1000)),
  };
}
