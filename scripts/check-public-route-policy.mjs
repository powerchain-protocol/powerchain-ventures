import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const routes = [
  "apps/backend/app/api/v1/token/route.ts",
  "apps/backend/app/api/v1/public-data/route.ts",
  "apps/backend/app/api/v1/public-data/health/route.ts",
  "apps/backend/app/api/v1/public-data/meta/route.ts",
  "apps/backend/app/api/v1/public-data/integrity/route.ts",
  "apps/backend/app/api/v1/version/route.ts",
];

const failures = [];

for (const rel of routes) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    failures.push(`${rel}: missing`);
    continue;
  }

  const source = fs.readFileSync(file, "utf8");
  if (!source.includes("export async function GET")) {
    failures.push(`${rel}: GET handler missing`);
  }
  if (/process\.env\.[A-Z0-9_]*(SECRET|KEY|TOKEN|PASSWORD)/.test(source)) {
    failures.push(`${rel}: public route references secret-like environment variable`);
  }
  if (/Authorization|Set-Cookie/i.test(source)) {
    failures.push(`${rel}: public route contains auth/cookie header logic`);
  }
}

if (failures.length) {
  console.error(JSON.stringify({ ok:false, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok:true, routes:routes.length }, null, 2));
