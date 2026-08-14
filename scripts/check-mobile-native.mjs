import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const required = [
  "apps/mobile/app.config.ts",
  "apps/mobile/.env.example",
  "apps/mobile/ios/PowerChainLaunchpad/AppDelegate.swift",
  "apps/mobile/ios/PowerChainLaunchpad/Assets.xcassets/AppIcon.appiconset/Contents.json",
  "apps/mobile/android/app/src/main/AndroidManifest.xml",
  "apps/mobile/assets/app-icon.png",
  "apps/mobile/assets/pwrc.png",
  "apps/mobile/src/navigation/map.ts",
  "apps/mobile/src/config/environment.ts",
  "docs/MOBILE-SOURCE-SURVEY.md",
];
for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) throw new Error(`Missing native mobile artifact: ${rel}`);
}
const appConfig = fs.readFileSync(path.join(root, "apps/mobile/app.config.ts"), "utf8");
if (/newArchEnabled\s*:/.test(appConfig)) throw new Error("Expo SDK 57 must not declare obsolete newArchEnabled");
if (!appConfig.includes('scheme: process.env.EXPO_PUBLIC_APP_SCHEME || "powerchain"')) throw new Error("PowerChain app scheme is missing from Expo config");
const androidManifest = fs.readFileSync(path.join(root, "apps/mobile/android/app/src/main/AndroidManifest.xml"), "utf8");
if (!androidManifest.includes('android:scheme="powerchain"')) throw new Error("PowerChain Android URI scheme is missing");
const iosPlist = fs.readFileSync(path.join(root, "apps/mobile/ios/PowerChainLaunchpad/Info.plist"), "utf8");
if (!iosPlist.includes("powerchain")) throw new Error("PowerChain iOS URI scheme is missing");
const icon = JSON.parse(fs.readFileSync(path.join(root, required[3]), "utf8"));
if (!Array.isArray(icon.images) || icon.images.length < 10) throw new Error("Incomplete iOS AppIcon set");
console.log(`PowerChain native mobile artifacts passed (${required.length} required files; ${icon.images.length} iOS icons).`);
