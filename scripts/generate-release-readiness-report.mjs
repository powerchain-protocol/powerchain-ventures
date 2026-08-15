import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const output = path.join(root, "docs/reports/validation/release-readiness.json");

const checks = [
  ["dependencies", "node", ["scripts/check-production-dependencies.mjs"]],
  ["publicRoutes", "node", ["scripts/check-public-route-policy.mjs"]],
  ["publicApiContract", "pnpm", ["public:api:check"]],
  ["publicData", "pnpm", ["public:data:production-check"]],
  ["snapshotManifest", "pnpm", ["public:data:snapshots"]],
];

const results = {};
let failures = 0;

for (const [name, command, args] of checks) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  const ok = result.status === 0;
  if (!ok) failures += 1;
  results[name] = {
    ok,
    exitCode: result.status ?? 1,
    stdout: (result.stdout ?? "").slice(-4000),
    stderr: (result.stderr ?? "").slice(-4000),
  };
}

const report = {
  product: "PowerChain Launchpad",
  release: "1.0.0",
  generatedAt: new Date().toISOString(),
  ok: failures === 0,
  failures,
  results,
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ ok: report.ok, failures, output: path.relative(root, output) }, null, 2));
process.exit(report.ok ? 0 : 1);
