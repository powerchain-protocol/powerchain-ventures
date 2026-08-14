import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const root = resolve(import.meta.dirname, "..");
const mobileRoot = join(root, "apps", "mobile");
const requireFromMobile = createRequire(join(mobileRoot, "package.json"));
const args = new Set(process.argv.slice(2));
let failed = false;

function ok(label, value = "") { console.log(`[ok] ${label}${value ? `: ${value}` : ""}`); }
function fail(label, value = "") { failed = true; console.error(`[error] ${label}${value ? `: ${value}` : ""}`); }
function warn(label, value = "") { console.warn(`[warn] ${label}${value ? `: ${value}` : ""}`); }

let expoPackage;
try {
  expoPackage = requireFromMobile.resolve("expo/package.json");
  ok("Expo package", expoPackage);
} catch {
  fail("Expo package is not linked in apps/mobile", "run `pnpm install` from the repository root");
}

if (expoPackage) {
  ok("Expo package linked", expoPackage);
}

for (const dep of ["expo-router", "expo-constants", "expo-doctor", "react-native", "react-native-screens"]) {
  try { ok(dep, requireFromMobile.resolve(`${dep}/package.json`)); }
  catch { fail(`${dep} is not linked`, "run `pnpm mobile:bootstrap` from the repository root"); }
}

try {
  const screensPkgPath = requireFromMobile.resolve("react-native-screens/package.json");
  const screensPkg = JSON.parse(readFileSync(screensPkgPath, "utf8"));
  if (screensPkg.version === "4.26.0") ok("react-native-screens version", screensPkg.version);
  else fail("react-native-screens version mismatch", `expected 4.26.0, found ${screensPkg.version}`);
} catch {
  fail("react-native-screens version check failed");
}

const mobileTsconfig = JSON.parse(readFileSync(join(mobileRoot, "tsconfig.json"), "utf8"));
if (mobileTsconfig.extends) warn("Mobile tsconfig uses an external base", mobileTsconfig.extends);
else ok("Mobile tsconfig is self-contained", "editor-safe before Expo resolution");
if (mobileTsconfig.compilerOptions?.jsx === "react-jsx") ok("Mobile JSX compiler", "react-jsx");
else fail("Mobile JSX compiler option is missing", "set compilerOptions.jsx to react-jsx");
if (mobileTsconfig.compilerOptions?.moduleResolution === "Bundler") ok("Mobile module resolution", "Bundler");
else fail("Mobile module resolution must be Bundler");
if (mobileTsconfig.compilerOptions?.paths?.["@/*"]?.includes("./src/*")) ok("Mobile @/* path alias");
else fail("Mobile @/* path alias is missing");

try {
  const devClient = requireFromMobile.resolve("expo-dev-client/package.json");
  ok("expo-dev-client", devClient);
} catch {
  fail("expo-dev-client is not linked", "run `pnpm install` after updating the mobile package");
}

const appConfig = readFileSync(join(mobileRoot, "app.config.ts"), "utf8");
if (/newArchEnabled\s*:/.test(appConfig)) fail("obsolete Expo config property newArchEnabled is still present");
else ok("Expo SDK 57 New Architecture config", "implicit/always enabled");

const manifest = readFileSync(join(mobileRoot, "android", "app", "src", "main", "AndroidManifest.xml"), "utf8");
if (manifest.includes('android:scheme="powerchain"')) ok("Android URI scheme", "powerchain");
else fail("Android URI scheme powerchain is missing");

const plist = readFileSync(join(mobileRoot, "ios", "PowerChainLaunchpad", "Info.plist"), "utf8");
if (plist.includes("powerchain")) ok("iOS URI scheme", "powerchain");
else fail("iOS URI scheme powerchain is missing");

if (args.has("--typescript")) {
  try { ok("TypeScript", requireFromMobile.resolve("typescript/package.json")); }
  catch { fail("TypeScript is not linked for apps/mobile"); }
}

if (args.has("--ios")) {
  if (process.platform !== "darwin") {
    warn("iOS host checks skipped", "not running on macOS");
  } else {
    try {
      const developerDir = execFileSync("xcode-select", ["-p"], { encoding: "utf8" }).trim();
      ok("Xcode developer directory", developerDir);
      if (!developerDir.includes("Xcode.app/Contents/Developer")) {
        warn("xcode-select may point to CommandLineTools instead of full Xcode", "use `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`");
      }
    } catch {
      fail("xcode-select failed", "install/open Xcode and select its developer directory");
    }
    try {
      execFileSync("xcrun", ["simctl", "help"], { stdio: "ignore", timeout: 10000 });
      ok("xcrun simctl");
    } catch {
      fail("xcrun simctl is unavailable", "run `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer` then `sudo xcodebuild -runFirstLaunch`");
    }
  }
}

if (failed) process.exit(1);
