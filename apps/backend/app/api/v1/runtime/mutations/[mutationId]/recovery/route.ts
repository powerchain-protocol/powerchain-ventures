import { NextRequest, NextResponse } from "next/server";
import { inspectMutationForRecovery } from "../../../../../../../lib/mutation-recovery";

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

  const result = await inspectMutationForRecovery(mutationId);
  return NextResponse.json(result, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "X-PowerChain-Release": "1.0.0",
    },
  });
}
