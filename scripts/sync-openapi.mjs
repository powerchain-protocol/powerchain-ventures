import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const canonical = path.join(root, "apps/backend/api/openapi/openapi.yaml");
const swaggerConfig = path.join(root, "apps/backend/api/openapi/swagger.config.json");
const apiRoute = path.join(root, "apps/backend/app/api/v1/openapi/route.ts");
const docsRoute = path.join(root, "apps/frontend/app/docs/api/page.tsx");

const failures = [];

for (const [label, file] of [
  ["canonical OpenAPI", canonical],
  ["Swagger config", swaggerConfig],
  ["backend OpenAPI route", apiRoute],
  ["frontend API docs route", docsRoute],
]) {
  if (!fs.existsSync(file)) failures.push(`missing ${label}`);
}

if (fs.existsSync(path.join(root, "openapi"))) {
  failures.push("root openapi/ must not exist");
}
if (fs.existsSync(path.join(root, "apps/backend/openapi"))) {
  failures.push("legacy apps/backend/openapi must not exist");
}

if (fs.existsSync(canonical)) {
  const source = fs.readFileSync(canonical, "utf8");
  if (!/^openapi:\s*3\.1\.0/m.test(source)) failures.push("OpenAPI must use 3.1.0");
  if (!/version:\s*1\.0\.0/m.test(source)) failures.push("OpenAPI version must remain 1.0.0");
  if (!/servers:\s*\n\s*-\s*url:\s*\/api\/v1/m.test(source)) {
    failures.push("OpenAPI server must be /api/v1");
  }
}

if (fs.existsSync(swaggerConfig)) {
  const config = JSON.parse(fs.readFileSync(swaggerConfig, "utf8"));
  if (config.spec !== "./openapi.yaml") failures.push("Swagger spec path is incorrect");
  if (config.servedAt !== "/api/v1/openapi") failures.push("Swagger servedAt is incorrect");
  if (config.documentationRoute !== "/docs/api") failures.push("Swagger docs route is incorrect");
}

if (fs.existsSync(apiRoute)) {
  const route = fs.readFileSync(apiRoute, "utf8");
  if (!route.includes('path.join(backendRoot, "api", "openapi", "openapi.yaml")')) {
    failures.push("backend route is not reading the canonical backend OpenAPI file");
  }
}

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  canonical: "apps/backend/api/openapi/openapi.yaml",
  servedAt: "/api/v1/openapi",
  docsAt: "/docs/api",
  duplicateCopies: 0,
}, null, 2));
