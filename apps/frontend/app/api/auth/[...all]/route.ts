import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Context = {
  params: Promise<{ all: string[] }>;
};

function backendOrigin() {
  return (
    process.env.BACKEND_ORIGIN?.trim() ||
    "http://localhost:3001"
  );
}

async function forward(
  request: NextRequest,
  context: Context,
) {
  const { all } = await context.params;
  const target = new URL(
    `/api/auth/${all
      .map(encodeURIComponent)
      .join("/")}`,
    backendOrigin(),
  );
  target.search = new URL(request.url).search;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");

  const body =
    request.method === "GET" ||
    request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  try {
    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body,
      redirect: "manual",
      cache: "no-store",
    });

    const responseHeaders =
      new Headers(upstream.headers);
    responseHeaders.delete("transfer-encoding");
    responseHeaders.delete("connection");

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: {
          code: "AUTH_BACKEND_UNAVAILABLE",
          message:
            error instanceof Error
              ? error.message
              : "Authentication backend unavailable",
        },
      },
      { status: 503 },
    );
  }
}

export const GET = forward;
export const POST = forward;
