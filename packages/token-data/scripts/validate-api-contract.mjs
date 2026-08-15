import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, "..");
const repoRoot = path.resolve(pkgRoot, "../..");

const spec = JSON.parse(fs.readFileSync(path.join(pkgRoot, "data/public-api.openapi.json"), "utf8"));
const expected = [
  "/api/v1/token",
  "/api/v1/public-data",
  "/api/v1/public-data/health",
  "/api/v1/public-data/meta",
  "/api/v1/public-data/integrity",
  "/api/v1/version",
  "/api/v1/capabilities",
  "/api/v1/readiness",
  "/api/v1/runtime/persistence/health",
];

const errors = [];
if (spec.openapi !== "3.1.0") errors.push("OpenAPI version must be 3.1.0");
if (spec.info?.version !== "1.0.0") errors.push("API version must remain 1.0.0");

for (const apiPath of expected) {
  if (!spec.paths?.[apiPath]?.get) errors.push(`OpenAPI missing GET ${apiPath}`);

  const rel = apiPath
    .replace(/^\/api\/v1\//, "")
    .split("/")
    .join(path.sep);
  const route = path.join(repoRoot, "apps/backend/app/api/v1", rel, "route.ts");
  if (!fs.existsSync(route)) errors.push(`backend route missing for ${apiPath}`);
}

if (errors.length) {
  console.error(JSON.stringify({ ok:false, errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok:true, paths:expected.length }, null, 2));
