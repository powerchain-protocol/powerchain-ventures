import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

const required = [
  "apps/frontend/public/assets/brand/powerchain-mark-dark.png",
  "apps/frontend/public/assets/brand/favicon-32.png",
  "apps/frontend/public/assets/brand/favicon-64.png",
  "apps/frontend/public/assets/brand/apple-touch-icon.png",
  "apps/frontend/public/assets/brand/app-icon-192.png",
  "apps/frontend/public/assets/brand/app-icon-512.png",
  "apps/frontend/app/favicon.ico",
  "apps/frontend/app/icon.png",
  "apps/frontend/app/apple-icon.png",
  "apps/frontend/components/logo.tsx",
  "apps/mobile/assets/logo-dark.png",
  "apps/mobile/assets/app-icon.png",
  "apps/mobile/assets/adaptive-icon.png",
  "apps/mobile/assets/splash-icon.png",
  "apps/mobile/assets/notification-icon.png",
  "docs/BRANDING.md",
];

for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) failures.push(`missing ${rel}`);
}

for (const obsolete of [
  "apps/frontend/public/assets/pwrc/logo-green.png",
  "apps/frontend/public/assets/pwrc/logo-white.png",
  "apps/frontend/public/assets/pwrc/logo-dark.png",
  "apps/mobile/assets/logo-green.png",
  "apps/mobile/assets/logo-white.png",
]) {
  if (fs.existsSync(path.join(root, obsolete))) {
    failures.push(`obsolete duplicate brand asset remains: ${obsolete}`);
  }
}

const logo = fs.readFileSync(
  path.join(root, "apps/frontend/components/logo.tsx"),
  "utf8",
);
if (!logo.includes('/assets/brand/powerchain-mark-dark.png')) {
  failures.push("web logo component is not using canonical brand mark");
}
if (!logo.includes('tone?: LogoTone')) {
  failures.push("web logo component does not expose light/dark tone");
}

const header = fs.readFileSync(
  path.join(root, "apps/frontend/components/app-shell.tsx"),
  "utf8",
);
if (!header.includes("header-create-link")) {
  failures.push("optimized header create-sale action is missing");
}
if (!header.includes("<AppNavigation />")) {
  failures.push("app header navigation is missing");
}

console.log(JSON.stringify({
  ok: failures.length === 0,
  canonicalMark: "apps/frontend/public/assets/brand/powerchain-mark-dark.png",
  failures,
}, null, 2));

if (failures.length) process.exit(1);
