import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("mobile doctor invokes the installed expo-doctor binary explicitly", async () => {
  const pkg = JSON.parse(await read("apps/mobile/package.json"));
  assert.equal(pkg.devDependencies["expo-doctor"], "1.20.1");
  assert.match(pkg.scripts.doctor, /pnpm exec expo-doctor/);
  const installDoctor = await read("scripts/check-mobile-install.mjs");
  const toolchainDoctor = await read("scripts/check-mobile-toolchain.mjs");
  assert.match(installDoctor, /"expo-doctor"/);
  assert.match(toolchainDoctor, /"expo-doctor"/);
});

test("Page accepts explicit undefined and async refresh handlers under exactOptionalPropertyTypes", async () => {
  const source = await read("apps/mobile/src/components/page.tsx");
  assert.match(source, /onRefresh\?: \(\(\) => void \| Promise<void>\) \| undefined/);
  assert.match(source, /void onRefresh\(\)/);
});

test("shared Field accepts explicit undefined error and Pressable style forwards full state", async () => {
  const source = await read("apps/mobile/src/shared/ui/primitives.tsx");
  assert.match(source, /error\?: string \| undefined/);
  assert.match(source, /props\.style\(state\)/);
  assert.doesNotMatch(source, /props\.style\(\{ pressed \}\)/);
});

test("pnpm only mutes the two known transitive uuid deprecations", async () => {
  const workspace = await read("pnpm-workspace.yaml");
  assert.match(workspace, /uuid: "7\.0\.3 \|\| 8\.3\.2"/);
});
