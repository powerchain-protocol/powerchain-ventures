import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

for (const forbidden of [
  "payload",
  "apps/payload",
]) {
  if (
    fs.existsSync(
      path.join(root, forbidden),
    )
  ) {
    failures.push(
      `forbidden application layer exists: ${forbidden}`,
    );
  }
}

for (const required of [
  "apps/frontend/package.json",
  "apps/backend/package.json",
  "apps/checkout/package.json",
  "apps/mobile/package.json",
  "packages/ui/package.json",
  "apps/checkout/app/checkout/[saleId]/page.tsx",
  "apps/backend/app/api/v1/launchpad/purchase/prepare/route.ts",
  "apps/backend/app/api/v1/launchpad/purchase/confirm/route.ts",
]) {
  if (
    !fs.existsSync(
      path.join(root, required),
    )
  ) {
    failures.push(
      `missing canonical workspace file: ${required}`,
    );
  }
}

for (const forbidden of [
  "apps/frontend/app/checkout",
  "apps/frontend/components/checkout",
  "apps/frontend/components/launchpad/purchase-experience.tsx",
]) {
  if (
    fs.existsSync(
      path.join(root, forbidden),
    )
  ) {
    failures.push(
      `checkout ownership duplicated in frontend: ${forbidden}`,
    );
  }
}

console.log(JSON.stringify({
  ok: failures.length === 0,
  failures,
  canonicalApps: [
    "frontend",
    "backend",
    "checkout",
    "mobile",
  ],
}, null, 2));

if (failures.length) {
  process.exit(1);
}
