import { createRequire } from "node:module";
import { resolve, join } from "node:path";

const root = resolve(import.meta.dirname, "..");
const mobileRoot = join(root, "apps", "mobile");
const requireFromMobile = createRequire(join(mobileRoot, "package.json"));
const required = [
  "expo",
  "expo-router",
  "expo-constants",
  "expo-doctor",
  "react",
  "react-native",
  "react-native-screens",
  "typescript",
  "@types/react",
];

const missing = [];
for (const name of required) {
  try {
    requireFromMobile.resolve(`${name}/package.json`);
  } catch {
    missing.push(name);
  }
}

if (missing.length) {
  console.error("\n[PowerChain mobile] Required Expo workspace packages are not linked:");
  for (const name of missing) console.error(`  - ${name}`);
  console.error("\nRun from the repository root:");
  console.error("  corepack enable");
  console.error("  pnpm install --no-frozen-lockfile");
  console.error("  pnpm mobile:bootstrap");
  console.error("\nDo not run npm install inside apps/mobile; this repository is a pnpm workspace.\n");
  process.exit(1);
}

console.log("[ok] PowerChain mobile Expo/React Native dependencies are linked.");
