import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("root release remains 1.0.0 and pnpm is pinned", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  assert.equal(pkg.version, "1.0.0");
  assert.equal(pkg.packageManager, "pnpm@11.21.0");
});

test("mobile react-native-screens remains pinned exactly", () => {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(root, "apps/mobile/package.json"), "utf8"),
  );
  assert.equal(pkg.dependencies?.["react-native-screens"], "4.26.0");
});

test("canonical fee wallet appears in repository policy/config", () => {
  const expected = "FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy";
  const env = fs.readFileSync(path.join(root, ".env.example"), "utf8");
  assert.match(env, new RegExp(expected));
});
