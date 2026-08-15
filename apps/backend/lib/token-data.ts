import {
  PWRC_PUBLIC_DATA,
  assertPwrcPublicPayload,
  type PwrcPublicPayload,
} from "@powerchain/token-data";

export function getPublicPwrcData(): PwrcPublicPayload {
  assertPwrcPublicPayload(PWRC_PUBLIC_DATA);
  return PWRC_PUBLIC_DATA;
}

export function tokenDataEtag(payload: PwrcPublicPayload): string {
  const body = JSON.stringify(payload);
  let hash = 2166136261;
  for (let i = 0; i < body.length; i += 1) {
    hash ^= body.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `"pwrc-${(hash >>> 0).toString(16)}"`;
}
