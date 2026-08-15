import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("monorepo has canonical app roots and no payload directory", () => {
  for (const rel of ["apps/frontend", "apps/backend", "apps/mobile"]) {
    assert.equal(fs.existsSync(path.join(root, rel)), true, `${rel} missing`);
  }
  assert.equal(fs.existsSync(path.join(root, "payload")), false);
});

test("build/cache directories are not present in source tree", () => {
  for (const rel of ["node_modules", ".next", ".turbo", ".expo", "__MACOSX"]) {
    assert.equal(fs.existsSync(path.join(root, rel)), false, `${rel} must not be packaged`);
  }
});

test("canonical app package names are stable", () => {
  const expected = {
    "apps/frontend/package.json": "@powerchain/launchpad-frontend",
    "apps/backend/package.json": "@powerchain/launchpad-backend",
    "apps/mobile/package.json": "@powerchain/launchpad-mobile",
  };
  for (const [rel, name] of Object.entries(expected)) {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
    assert.equal(pkg.name, name);
    assert.equal(pkg.version, "1.0.0");
  }
});
