import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => fs.readFileSync(new URL(path, root), "utf8");

test("mobile TypeScript explicitly enables JSX and bundler resolution", () => {
  const config = JSON.parse(read("apps/mobile/tsconfig.json"));
  assert.equal(config.extends, undefined);
  assert.equal(config.compilerOptions.jsx, "react-jsx");
  assert.equal(config.compilerOptions.moduleResolution, "Bundler");
  assert.deepEqual(config.compilerOptions.paths["@/*"], ["./src/*"]);
});

test("mobile shared UI has canonical primitives with compatibility barrel", () => {
  const shared = read("apps/mobile/src/shared/ui/primitives.tsx");
  const barrel = read("apps/mobile/src/components/ui.tsx");
  assert.match(shared, /Haptics\.selectionAsync/);
  assert.match(shared, /export function Button/);
  assert.match(shared, /export function Card/);
  assert.match(barrel, /@\/shared\/ui/);
});

test("mobile config and constants have canonical barrels", () => {
  const constants = read("apps/mobile/src/constants/app.ts");
  const environment = read("apps/mobile/src/config/environment.ts");
  assert.match(constants, /POWERCHAIN_MOBILE/);
  assert.match(constants, /defaultApiTimeoutMs/);
  assert.match(environment, /getMobileEnvironment/);
  assert.match(environment, /POWERCHAIN_MOBILE/);
});
