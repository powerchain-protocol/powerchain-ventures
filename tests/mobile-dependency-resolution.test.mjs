import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("mobile TypeScript configuration is JSX and alias safe without an external base", async () => {
  const config = JSON.parse(await read("apps/mobile/tsconfig.json"));
  assert.equal(config.extends, undefined);
  assert.equal(config.compilerOptions.jsx, "react-jsx");
  assert.equal(config.compilerOptions.moduleResolution, "Bundler");
  assert.deepEqual(config.compilerOptions.paths["@/*"], ["./src/*"]);
  assert.ok(config.compilerOptions.customConditions.includes("react-native"));
});

test("mobile package declares the Expo Router runtime graph directly", async () => {
  const pkg = JSON.parse(await read("apps/mobile/package.json"));
  for (const dep of ["expo", "expo-router", "expo-constants", "react", "react-native"]) {
    assert.ok(pkg.dependencies[dep], `${dep} must be a direct mobile dependency`);
  }
});

test("SDK 57 Metro config relies on Expo automatic monorepo support", async () => {
  const metro = await read("apps/mobile/metro.config.js");
  assert.match(metro, /getDefaultConfig/);
  assert.doesNotMatch(metro, /watchFolders\s*=/);
  assert.doesNotMatch(metro, /nodeModulesPaths\s*=/);
  assert.doesNotMatch(metro, /disableHierarchicalLookup\s*=/);
});
