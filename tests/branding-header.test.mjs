import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = rel => fs.readFileSync(path.join(root, rel), "utf8");

test("application branding uses one canonical PowerChain mark", () => {
  assert.equal(
    fs.existsSync(
      path.join(
        root,
        "apps/frontend/public/assets/brand/powerchain-mark-dark.png",
      ),
    ),
    true,
  );
  for (const obsolete of [
    "apps/frontend/public/assets/pwrc/logo-green.png",
    "apps/frontend/public/assets/pwrc/logo-white.png",
    "apps/frontend/public/assets/pwrc/logo-dark.png",
  ]) {
    assert.equal(fs.existsSync(path.join(root, obsolete)), false);
  }
});

test("web logo component supports compact and light-surface variants", () => {
  const source = read("apps/frontend/components/logo.tsx");
  assert.match(source, /PowerChainMark/);
  assert.match(source, /tone = "dark"/);
  assert.match(source, /powerchain-mark-\$\{tone\}/);
  assert.match(source, /brand-compact/);
});

test("header keeps primary navigation concise and secondary routes grouped", () => {
  const nav = read("apps/frontend/components/navigation/app-navigation.tsx");
  assert.match(nav, /primaryLinks/);
  assert.match(nav, /secondaryLinks/);
  assert.match(nav, /<Dropdown/);
  assert.doesNotMatch(nav, /\["\/", "Launchpad"\]/);
});

test("PWA metadata uses brand app icons", () => {
  const manifest = read("apps/frontend/app/manifest.ts");
  assert.match(manifest, /assets\/brand\/app-icon-192\.png/);
  assert.match(manifest, /assets\/brand\/app-icon-512\.png/);
});
