import { NextResponse } from "next/server";
import type { MutationKind } from "@powerchain/token-data";
import { executeIdempotentMutation } from "./mutation-executor";
import { problemResponse } from "./problem-response";
import { resolveRequestId } from "./request-id";

export async function handleIdempotentJsonMutation<T>(input: {
  request: Request;
  body: unknown;
  kind: MutationKind;
  execute: () => Promise<{ statusCode: number; body: T }>;
}) {
  const requestId = resolveRequestId(input.request.headers);
  const result = await executeIdempotentMutation<T>({
    requestId,
    method: input.request.method,
    path: new URL(input.request.url).pathname,
    body: input.body,
    idempotencyKeyHeader: input.request.headers.get("idempotency-key"),
    kind: input.kind,
    execute: input.execute,
  });

  if (result.kind === "idempotency-required") {
    return problemResponse(input.request, {
      code: "INVALID_REQUEST",
      status: 400,
      title: "Idempotency key required",
      detail: "A valid Idempotency-Key header is required for this mutation.",
    });
  }

  if (result.kind === "in-progress") {
    return problemResponse(input.request, {
      code: "INVALID_REQUEST",
      status: 409,
      title: "Mutation in progress",
      detail: "A matching mutation is already being processed. Retry with the same Idempotency-Key.",
      retryAfterSeconds: 1,
    });
  }

  if (result.kind === "idempotency-conflict") {
    return problemResponse(input.request, {
      code: "INVALID_REQUEST",
      status: 409,
      title: "Idempotency conflict",
      detail: "The Idempotency-Key was already used for a different request.",
    });
  }

  return NextResponse.json(result.value.body, {
    status: result.value.statusCode,
    headers: {
      "Cache-Control": "no-store",
      "X-Request-ID": requestId,
      "Idempotency-Replayed": result.value.replayed ? "true" : "false",
      "X-PowerChain-Release": "1.0.0",
    },
  });
}
