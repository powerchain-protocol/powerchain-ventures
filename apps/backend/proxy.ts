import { NextRequest, NextResponse } from "next/server";
import { normalizeOrigin } from "@powerchain/utils/helpers";

const ALLOW_METHODS = "GET,POST,OPTIONS";
const ALLOW_HEADERS = "content-type,authorization,idempotency-key,x-request-id";
function allowedOrigins() {
  const configured = (process.env.ALLOWED_ORIGINS ?? "").split(",").map(value => value.trim()).filter(Boolean);
  const app = process.env.NEXT_PUBLIC_APP_URL?.trim();
  return new Set([...configured, ...(app ? [app] : [])].map(normalizeOrigin));
}
function corsHeaders(origin: string | null, allowed: Set<string>) {
  const headers = new Headers({ "access-control-allow-methods": ALLOW_METHODS, "access-control-allow-headers": ALLOW_HEADERS, "access-control-max-age": "600", vary: "origin" });
  if (origin && allowed.has(normalizeOrigin(origin))) headers.set("access-control-allow-origin", origin);
  return headers;
}
function isMutation(method: string) { return !["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase()); }

export function proxy(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
  const origin = request.headers.get("origin");
  const allowed = allowedOrigins();
  const cors = corsHeaders(origin, allowed);

  if (request.method === "OPTIONS") {
    if (origin && !allowed.has(normalizeOrigin(origin))) return NextResponse.json({ ok:false,error:{code:"FORBIDDEN",message:"Request origin is not allowed",requestId} },{status:403,headers:{"x-request-id":requestId,"cache-control":"no-store"}});
    cors.set("x-request-id", requestId); cors.set("cache-control", "no-store");
    return new NextResponse(null, { status: 204, headers: cors });
  }

  if (isMutation(request.method) && process.env.NODE_ENV === "production" && origin && !allowed.has(normalizeOrigin(origin))) {
    return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: "Request origin is not allowed", requestId } }, { status: 403, headers: { "x-request-id": requestId, "cache-control": "no-store" } });
  }

  const requestHeaders = new Headers(request.headers); requestHeaders.set("x-request-id", requestId);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("x-request-id", requestId); response.headers.set("cache-control", "no-store");
  cors.forEach((value,key)=>response.headers.set(key,value));
  return response;
}
export const config = { matcher: "/api/v1/:path*" };
