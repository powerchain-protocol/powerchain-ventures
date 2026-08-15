import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = rel => fs.readFileSync(path.join(root, rel), "utf8");

test("OpenAPI is backend-owned with no root duplicate", () => {
  assert.equal(fs.existsSync(path.join(root, "openapi")), false);
  assert.equal(fs.existsSync(path.join(root, "apps/backend/openapi")), false);
  assert.equal(
    fs.existsSync(path.join(root, "apps/backend/api/openapi/openapi.yaml")),
    true,
  );
});

test("OpenAPI route and frontend developer docs use canonical ownership", () => {
  assert.match(
    read("apps/backend/app/api/v1/openapi/route.ts"),
    /api", "openapi", "openapi\.yaml/,
  );
  assert.match(
    read("apps/frontend/app/docs/api/page.tsx"),
    /apps\/backend\/api\/openapi\/openapi\.yaml/,
  );
});

test("Swagger metadata points to canonical backend spec", () => {
  const config = JSON.parse(
    read("apps/backend/api/openapi/swagger.config.json"),
  );
  assert.equal(config.spec, "./openapi.yaml");
  assert.equal(config.servedAt, "/api/v1/openapi");
  assert.equal(config.documentationRoute, "/docs/api");
});
