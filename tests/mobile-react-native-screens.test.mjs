import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("mobile pins react-native-screens exactly to 4.26.0", async () => {
  const pkg = JSON.parse(await read("apps/mobile/package.json"));
  assert.equal(pkg.dependencies["react-native-screens"], "4.26.0");
});

test("mobile install doctor requires react-native-screens", async () => {
  const source = await read("scripts/check-mobile-install.mjs");
  assert.match(source, /"react-native-screens"/);
});

test("mobile toolchain doctor verifies react-native-screens 4.26.0", async () => {
  const source = await read("scripts/check-mobile-toolchain.mjs");
  assert.match(source, /screensPkg\.version === "4\.26\.0"/);
});
