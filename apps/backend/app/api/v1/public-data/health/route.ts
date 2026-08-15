import { NextResponse } from "next/server";
import { getPublicDataHealth } from "../../../../../lib/public-data-health";

export const dynamic = "force-dynamic";

export async function GET() {
  const health = getPublicDataHealth();
  return NextResponse.json(health, {
    status: health.ready ? 200 : 503,
    headers: {
      "Cache-Control": "no-store",
      "X-PowerChain-Schema-Version": "1",
      "X-PowerChain-Release": "1.0.0",
    },
  });
}
