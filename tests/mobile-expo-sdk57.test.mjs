import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

test("Expo SDK 57 config omits obsolete newArchEnabled and defines PowerChain scheme", () => {
  const config = read("apps/mobile/app.config.ts");
  assert.doesNotMatch(config, /newArchEnabled\s*:/);
  assert.match(config, /scheme:\s*process\.env\.EXPO_PUBLIC_APP_SCHEME\s*\|\|\s*"powerchain"/);
  assert.match(config, /expo-dev-client/);
});

test("native iOS and Android projects contain the PowerChain URI scheme", () => {
  const manifest = read("apps/mobile/android/app/src/main/AndroidManifest.xml");
  const plist = read("apps/mobile/ios/PowerChainLaunchpad/Info.plist");
  assert.match(manifest, /android:scheme="powerchain"/);
  assert.match(plist, /powerchain/);
});

test("mobile TypeScript is self-contained for editor-safe JSX resolution", () => {
  const tsconfig = JSON.parse(read("apps/mobile/tsconfig.json"));
  assert.equal(tsconfig.extends, undefined);
});
