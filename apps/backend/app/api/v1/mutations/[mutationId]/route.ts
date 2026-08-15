import { NextRequest, NextResponse } from "next/server";
import { getRuntimePersistence } from "../../../../../lib/runtime-persistence";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ mutationId: string }> },
) {
  const { mutationId } = await context.params;

  if (!/^mut_[a-f0-9]{32}$/.test(mutationId)) {
    return NextResponse.json(
      { error: { code: "INVALID_MUTATION_ID", message: "Invalid mutation ID." } },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const receipt = await getRuntimePersistence().mutationReceipts.read(mutationId);

  if (!receipt) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Mutation receipt not found." } },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(receipt, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "X-PowerChain-Release": "1.0.0",
      "X-PowerChain-Schema-Version": "1",
    },
  });
}
