import { toNextJsHandler } from "better-auth/next-js";
import {
  auth,
  betterAuthEnabled,
} from "../../../../lib/better-auth";

const handler = toNextJsHandler(auth);

function unavailable() {
  return Response.json(
    {
      ok: false,
      error: {
        code: "AUTH_NOT_CONFIGURED",
        message:
          "Better Auth requires DATABASE_URL and BETTER_AUTH_SECRET.",
      },
    },
    { status: 503 },
  );
}

export async function GET(request: Request) {
  return betterAuthEnabled
    ? handler.GET(request)
    : unavailable();
}

export async function POST(request: Request) {
  return betterAuthEnabled
    ? handler.POST(request)
    : unavailable();
}
