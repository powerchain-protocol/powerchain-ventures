import { NextResponse } from "next/server";
import { resolveRequestId } from "./request-id";

export function publicJson<T>(
  request: Request,
  body: T,
  init: { status?: number; headers?: HeadersInit } = {},
) {
  const requestId = resolveRequestId(request.headers);
  const headers = new Headers(init.headers);
  headers.set("X-Request-ID", requestId);
  headers.set("X-PowerChain-Release", "1.0.0");
  headers.set("X-PowerChain-Schema-Version", "1");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Vary", "Accept, If-None-Match");
  return NextResponse.json(body, { ...init, headers });
}

export function publicProblem(
  request: Request,
  status: number,
  code: string,
  message: string,
) {
  const requestId = resolveRequestId(request.headers);
  return NextResponse.json(
    { error: { code, message, requestId } },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "X-Request-ID": requestId,
        "X-PowerChain-Release": "1.0.0",
      },
    },
  );
}
