import { spawnSync } from "node:child_process";

const commands = [
  ["node", ["scripts/check-production-dependencies.mjs"]],
  ["node", ["scripts/check-public-route-policy.mjs"]],
  ["pnpm", ["public:data:production-check"]],
  ["pnpm", ["production:contract:check"]],
  ["node", ["scripts/generate-production-provenance.mjs", "--check"]],
];

for (const [command, args] of commands) {
  console.log(`\n> ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log("\nPowerChain production release checks passed.");
