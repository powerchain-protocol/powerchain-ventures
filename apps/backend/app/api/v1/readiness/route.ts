import { NextResponse } from "next/server";
import { checkAggregateReadiness } from "../../../../lib/readiness/aggregate-readiness";

export const dynamic = "force-dynamic";

export async function GET() {
  const readiness = checkAggregateReadiness();
  return NextResponse.json(readiness, {
    status: readiness.ready ? 200 : 503,
    headers: {
      "Cache-Control": "no-store",
      "X-PowerChain-Release": "1.0.0",
      "X-PowerChain-Schema-Version": "1",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
