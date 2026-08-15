import {
  forwardBackendRequest,
} from "@powerchain/utils/backend-proxy";

export const dynamic =
  "force-dynamic";
export const runtime =
  "nodejs";

type Context = {
  params: Promise<{
    path: string[];
  }>;
};

async function forward(
  request: Request,
  context: Context,
) {
  const { path } =
    await context.params;

  return forwardBackendRequest(
    request,
    path,
  );
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
export const HEAD = forward;
export const OPTIONS = forward;
