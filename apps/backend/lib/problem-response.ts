import { NextResponse } from "next/server";
import {
  createPowerChainProblem,
  type PowerChainProblemCode,
} from "@powerchain/token-data";
import { resolveRequestId } from "./request-id";

export function problemResponse(
  request: Request,
  options: {
    code: PowerChainProblemCode;
    status: number;
    title: string;
    detail: string;
    retryAfterSeconds?: number;
  },
) {
  const requestId = resolveRequestId(request.headers);
  const body = createPowerChainProblem(
    options.code,
    options.status,
    options.title,
    options.detail,
    requestId,
  );

  const headers = new Headers({
    "Cache-Control": "no-store",
    "Content-Type": "application/problem+json",
    "X-Content-Type-Options": "nosniff",
    "X-Request-ID": requestId,
    "X-PowerChain-Release": "1.0.0",
    "X-PowerChain-Schema-Version": "1",
  });

  if (options.retryAfterSeconds && options.retryAfterSeconds > 0) {
    headers.set("Retry-After", String(Math.ceil(options.retryAfterSeconds)));
  }

  return NextResponse.json(body, {
    status: options.status,
    headers,
  });
}
