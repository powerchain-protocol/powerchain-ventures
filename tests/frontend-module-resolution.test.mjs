import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const readJson = path => JSON.parse(fs.readFileSync(path, "utf8"));

test("frontend pins ConnectorKit with official react/headless subpath package", () => {
  const pkg = readJson("apps/frontend/package.json");
  assert.equal(pkg.dependencies["@solana/connector"], "0.2.6");
  assert.match(pkg.scripts.predev, /build:packages/);
  assert.match(pkg.scripts.predev, /check-frontend-resolution/);
});

test("PowerChain workspace packages export compiled dist artifacts", () => {
  for (const name of ["config", "domain", "solana", "utils", "integrations", "program-client"]) {
    const pkg = readJson(`packages/${name}/package.json`);
    const rootExport = pkg.exports["."];
    const runtime = typeof rootExport === "string" ? rootExport : rootExport.import ?? rootExport.default;
    assert.match(runtime, /^\.\/dist\//, `${name} must export dist runtime`);
  }
});

test("Next Turbopack roots are monorepo-aware", () => {
  const frontend = fs.readFileSync("apps/frontend/next.config.ts", "utf8");
  const backend = fs.readFileSync("apps/backend/next.config.ts", "utf8");
  assert.match(frontend, /turbopack:\s*\{\s*root:\s*monorepoRoot\s*\}/);
  assert.match(backend, /turbopack:\s*\{\s*root:\s*monorepoRoot\s*\}/);
});
