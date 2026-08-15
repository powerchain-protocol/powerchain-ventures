import { json } from "../../../../lib/http";
import {
  configuredCorsOrigins,
  corsHeadersFor,
} from "../../../../lib/cors";

export async function GET() {
  return json({
    cors: {
      allowedOrigins: [...configuredCorsOrigins()],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      headers: [
        "authorization",
        "content-type",
        "idempotency-key",
        "x-request-id",
        "x-wallet-address",
      ],
      exposedHeaders: [
        "x-request-id",
        "x-powerchain-release",
        "x-powerchain-rpc-endpoint",
        "x-powerchain-rpc-latency-ms",
      ],
      credentials: false,
      maxAgeSeconds: 600,
    },
  });
}

export async function OPTIONS(request: Request) {
  const headers = corsHeadersFor(request.headers.get("origin"));
  headers.set("cache-control", "no-store");
  return new Response(null, { status: 204, headers });
}
