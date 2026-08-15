import { spawnSync } from "node:child_process";

const checks = [
  ["pnpm", ["--filter", "@powerchain/token-data", "validate:api"]],
  ["pnpm", ["--filter", "@powerchain/token-data", "validate:release"]],
  ["pnpm", ["--filter", "@powerchain/token-data", "validate:integrity"]],
  ["pnpm", ["--filter", "@powerchain/token-data", "validate:snapshots"]],
];

for (const [cmd, args] of checks) {
  const result = spawnSync(cmd, args, { stdio:"inherit", shell:process.platform === "win32" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log("PowerChain public API contract checks passed.");
