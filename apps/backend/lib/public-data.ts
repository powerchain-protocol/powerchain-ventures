import {
  POWERCHAIN_PUBLIC_REGISTRY_ENVELOPE,
  assertPwrcPublicPayload,
  type PowerChainPublicRegistry,
  type PublicDataEnvelope,
} from "@powerchain/token-data";

export function getPublicRegistry():
  PublicDataEnvelope<PowerChainPublicRegistry> {
  assertPwrcPublicPayload(POWERCHAIN_PUBLIC_REGISTRY_ENVELOPE.data.tokens.PWRC);
  return POWERCHAIN_PUBLIC_REGISTRY_ENVELOPE;
}

export function stablePublicDataEtag(value: unknown): string {
  const body = JSON.stringify(value);
  let hash = 2166136261;
  for (let index = 0; index < body.length; index += 1) {
    hash ^= body.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `"powerchain-${(hash >>> 0).toString(16)}"`;
}

export function publicDataHeaders(etag: string): Record<string, string> {
  return {
    ETag: etag,
    "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=900",
    "Content-Type": "application/json; charset=utf-8",
    "X-PowerChain-Data-Source": "powerchain-token-data",
    "X-PowerChain-Schema-Version": "1",
    "X-PowerChain-Release": "1.0.0",
  };
}
