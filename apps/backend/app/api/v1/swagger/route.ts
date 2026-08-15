import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  return NextResponse.json(
    {
      product: "PowerChain Launchpad",
      version: "1.0.0",
      format: "OpenAPI 3.1 YAML",
      openapi: `${origin}/api/v1/openapi`,
      docsPath: "/docs/api",
    },
    {
      headers: {
        "cache-control": "public, max-age=300",
        "x-content-type-options": "nosniff",
        "x-powerchain-release": "1.0.0",
      },
    },
  );
}
