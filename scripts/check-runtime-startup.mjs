import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

for (const rel of [
  "apps/backend/lib/env.ts",
  "apps/backend/lib/request-guards.ts",
  "apps/backend/lib/rate-limit.ts",
  "apps/backend/lib/idempotency-store.ts",
  "apps/backend/lib/security-headers.ts",
  "apps/backend/lib/problem-response.ts",
]) {
  if (!exists(rel)) failures.push(`missing runtime protection module ${rel}`);
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (pkg.version !== "1.0.0") failures.push("release must remain 1.0.0");

const workspace = fs.readFileSync(path.join(root, "pnpm-workspace.yaml"), "utf8");
if (workspace.includes("dangerouslyAllowAllBuilds: true")) {
  failures.push("dangerouslyAllowAllBuilds must remain disabled");
}

if (!process.env.CI) {
  warnings.push("runtime startup doctor is not running under CI");
}

console.log(JSON.stringify({ ok: failures.length === 0, failures, warnings }, null, 2));
if (failures.length) process.exit(1);
