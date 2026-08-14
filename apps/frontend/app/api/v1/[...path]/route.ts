import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
]);

function backendOrigin(): string {
  const raw = process.env.BACKEND_ORIGIN?.trim() || "http://localhost:3001";
  const url = new URL(raw);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("BACKEND_ORIGIN must use http or https");
  }
  return url.origin;
}

function forwardedHeaders(request: NextRequest): Headers {
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (HOP_BY_HOP.has(lower) || lower === "host" || lower === "content-length") return;
    headers.append(key, value);
  });
  headers.set("x-forwarded-host", request.headers.get("host") ?? "");
  headers.set("x-forwarded-proto", new URL(request.url).protocol.replace(":", ""));
  return headers;
}

function responseHeaders(source: Headers): Headers {
  const headers = new Headers();
  source.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) headers.append(key, value);
  });
  return headers;
}

type RouteContext = { params: Promise<{ path: string[] }> };

async function forward(request: NextRequest, context: RouteContext): Promise<Response> {
  const { path } = await context.params;
  const incoming = new URL(request.url);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const target = new URL(`/api/v1/${path.map(encodeURIComponent).join("/")}`, backendOrigin());
    target.search = incoming.search;

    const init: RequestInit = {
      method: request.method,
      headers: forwardedHeaders(request),
      cache: "no-store",
      redirect: "manual",
      signal: controller.signal,
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = await request.arrayBuffer();
    }

    const upstream = await fetch(target, init);
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders(upstream.headers),
    });
  } catch (cause) {
    const unavailable = cause instanceof Error && cause.name === "AbortError" ? "Backend request timed out" : "Backend is not running or is unreachable";
    return Response.json(
      {
        ok: false,
        error: {
          code: "BACKEND_UNAVAILABLE",
          message: unavailable,
        },
      },
      {
        status: 503,
        headers: {
          "cache-control": "no-store",
          "retry-after": "2",
        },
      },
    );
  } finally {
    clearTimeout(timeout);
  }
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
export const HEAD = forward;
