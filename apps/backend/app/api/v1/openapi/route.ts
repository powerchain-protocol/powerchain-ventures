import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { error } from "../../../../lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const routeDir = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(routeDir, "../../../../../");
const openApiFile = path.join(backendRoot, "api", "openapi", "openapi.yaml");

export async function GET() {
  try {
    const spec = await readFile(openApiFile, "utf8");
    return new Response(spec, {
      status: 200,
      headers: {
        "content-type": "application/yaml; charset=utf-8",
        "cache-control":
          "public, max-age=300, s-maxage=300, stale-while-revalidate=3600",
        "x-content-type-options": "nosniff",
        "x-powerchain-release": "1.0.0",
      },
    });
  } catch (cause) {
    return error(
      "INTERNAL_ERROR",
      cause instanceof Error ? cause.message : "OpenAPI document unavailable",
      500,
    );
  }
}
