import { NextResponse } from "next/server";
import { getRuntimeCapabilities } from "../../../../lib/runtime-capabilities";
import { POWERCHAIN_CACHE_POLICY, publicCacheControl } from "@powerchain/token-data";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const policy = POWERCHAIN_CACHE_POLICY.metadata;
  return NextResponse.json(getRuntimeCapabilities(), {
    status: 200,
    headers: {
      "Cache-Control": publicCacheControl(
        policy.browserMaxAgeSeconds,
        policy.cdnMaxAgeSeconds,
        policy.staleWhileRevalidateSeconds,
      ),
      "X-PowerChain-Release": "1.0.0",
      "X-PowerChain-Schema-Version": "1",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
