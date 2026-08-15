import { NextResponse } from "next/server";
import {
  POWERCHAIN_PUBLIC_DATA_PROVENANCE,
  POWERCHAIN_PUBLIC_REGISTRY,
} from "@powerchain/token-data";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  return NextResponse.json({
    provenance: POWERCHAIN_PUBLIC_DATA_PROVENANCE,
    registryVersion: POWERCHAIN_PUBLIC_REGISTRY.version,
    chain: POWERCHAIN_PUBLIC_REGISTRY.chain,
    cluster: POWERCHAIN_PUBLIC_REGISTRY.cluster,
    tokenCount: Object.keys(POWERCHAIN_PUBLIC_REGISTRY.tokens).length,
  }, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      "X-PowerChain-Schema-Version": "1",
      "X-PowerChain-Release": "1.0.0",
    },
  });
}
