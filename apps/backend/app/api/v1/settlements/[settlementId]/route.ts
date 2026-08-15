import { NextRequest, NextResponse } from "next/server";
import { getRuntimePersistence } from "../../../../../lib/runtime-persistence";
import { bootstrapRuntimePersistence } from "../../../../../lib/runtime-persistence/bootstrap";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ settlementId: string }> },
) {
  const { settlementId } = await context.params;

  if (!/^set_[a-f0-9]{32}$/.test(settlementId)) {
    return NextResponse.json(
      { error: { code: "INVALID_SETTLEMENT_ID", message: "Invalid settlement ID." } },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  await bootstrapRuntimePersistence();
  const settlement = await getRuntimePersistence().settlements.read(settlementId);
  if (!settlement) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Settlement not found." } },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(settlement, {
    headers: {
      "Cache-Control": "no-store",
      "X-PowerChain-Release": "1.0.0",
    },
  });
}
