import { NextRequest, NextResponse } from "next/server";
import {
  configuredCorsOrigins,
  corsHeadersFor,
  isCorsOriginAllowed,
} from "./lib/cors";

function requestId(request: NextRequest): string {
  return request.headers.get("x-request-id") ?? crypto.randomUUID();
}

function isMutation(method: string): boolean {
  return !["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase());
}

export function proxy(request: NextRequest) {
  const id = requestId(request);
  const origin = request.headers.get("origin");
  const allowed = configuredCorsOrigins();
  const cors = corsHeadersFor(origin, allowed);

  if (request.method === "OPTIONS") {
    if (origin && !isCorsOriginAllowed(origin, allowed)) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "FORBIDDEN",
            message: "Request origin is not allowed",
            requestId: id,
          },
        },
        {
          status: 403,
          headers: {
            "x-request-id": id,
            "cache-control": "no-store",
          },
        },
      );
    }

    cors.set("x-request-id", id);
    cors.set("cache-control", "no-store");
    return new NextResponse(null, { status: 204, headers: cors });
  }

  if (
    isMutation(request.method) &&
    process.env.NODE_ENV === "production" &&
    origin &&
    !isCorsOriginAllowed(origin, allowed)
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "FORBIDDEN",
          message: "Request origin is not allowed",
          requestId: id,
        },
      },
      {
        status: 403,
        headers: {
          "x-request-id": id,
          "cache-control": "no-store",
        },
      },
    );
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", id);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("x-request-id", id);
  response.headers.set("cache-control", "no-store");
  cors.forEach((value, key) => response.headers.set(key, value));
  return response;
}

export const config = {
  matcher: "/api/v1/:path*",
};
