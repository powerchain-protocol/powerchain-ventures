import {
  NextResponse,
} from "next/server";
import {
  bootstrapRuntimePersistence,
  runtimeBootstrapStatus,
} from "../../../../../../lib/runtime-persistence/bootstrap";
import {
  checkRuntimePersistenceHealth,
} from "../../../../../../lib/runtime-persistence/health";

export const dynamic =
  "force-dynamic";
export const runtime =
  "nodejs";

export async function GET() {
  try {
    const bootstrap =
      await bootstrapRuntimePersistence();

    const health =
      await checkRuntimePersistenceHealth();

    return NextResponse.json(
      {
        ...health,
        bootstrap,
      },
      {
        status:
          health.ready
            ? 200
            : 503,
        headers: {
          "Cache-Control":
            "no-store",
          "X-PowerChain-Release":
            "1.0.0",
          "X-PowerChain-Schema-Version":
            "2",
          "X-Content-Type-Options":
            "nosniff",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ready: false,
        bootstrap:
          runtimeBootstrapStatus(),
        error:
          error instanceof Error
            ? error.message
            : "Runtime persistence bootstrap failed",
      },
      {
        status: 503,
        headers: {
          "Cache-Control":
            "no-store",
          "X-PowerChain-Release":
            "1.0.0",
          "X-PowerChain-Schema-Version":
            "2",
          "X-Content-Type-Options":
            "nosniff",
        },
      },
    );
  }
}
