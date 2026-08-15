import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

const publicRoutes = [
  "apps/backend/app/api/v1/token/route.ts",
  "apps/backend/app/api/v1/public-data/route.ts",
  "apps/backend/app/api/v1/public-data/health/route.ts",
  "apps/backend/app/api/v1/public-data/meta/route.ts",
  "apps/backend/app/api/v1/public-data/integrity/route.ts",
  "apps/backend/app/api/v1/version/route.ts",
  "apps/backend/app/api/v1/capabilities/route.ts",
  "apps/backend/app/api/v1/readiness/route.ts",
];

for (const rel of publicRoutes) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    failures.push(`${rel}: missing`);
    continue;
  }
  const source = fs.readFileSync(file, "utf8");
  if (/SUPABASE_SERVICE_ROLE_KEY|CDP_API_KEY_SECRET|PRIVATE_KEY|SEED_PHRASE/.test(source)) {
    failures.push(`${rel}: secret-like server credential referenced in public route`);
  }
}

const mobileRoots = [
  path.join(root, "apps/mobile/src"),
  path.join(root, "apps/mobile/app"),
];

const forbidden = /(SUPABASE_SERVICE_ROLE_KEY|CDP_API_KEY_SECRET|PRIVATE_KEY|SEED_PHRASE|HELIUS_API_KEY|BIRDEYE_API_KEY)/;
for (const dir of mobileRoots) {
  if (!fs.existsSync(dir)) continue;
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes:true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        const source = fs.readFileSync(full, "utf8");
        if (forbidden.test(source)) failures.push(`${path.relative(root, full)}: server-only secret reference`);
      }
    }
  }
}

console.log(JSON.stringify({ ok: failures.length === 0, failures }, null, 2));
if (failures.length) process.exit(1);
