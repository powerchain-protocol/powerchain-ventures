import { rmSync } from "node:fs";
import { resolve, join } from "node:path";

const root = resolve(import.meta.dirname, "..");
const mobile = join(root, "apps", "mobile");
for (const rel of [".expo", "node_modules/.cache", "android/.gradle", "android/app/build"]) {
  rmSync(join(mobile, rel), { recursive: true, force: true });
}
console.log("[ok] Cleared PowerChain mobile Expo/Metro/Gradle caches.");
