"use client";

import { fetchJsonWithPolicy } from "@powerchain/utils/http";
import { validateWalletAddress } from "./validate";

export function actionIdempotencyKey(
  kind: string,
  wallet: string,
  scope: string,
): string {
  return `powerchain:${kind}:${validateWalletAddress(wallet)}:${scope}:${crypto.randomUUID()}`;
}

export async function safePost<T>(
  url: string,
  body: Record<string, unknown>,
  wallet: string,
  scope = "action",
): Promise<T> {
  const idempotencyKey = actionIdempotencyKey(
    scope,
    wallet,
    String(body.saleId ?? body.reviewId ?? "global"),
  );

  return fetchJsonWithPolicy<T>(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      ...body,
      wallet: validateWalletAddress(wallet),
    }),
    idempotencyKey,
    retries: 1,
  });
}
