import { spawnSync } from "node:child_process";
const result = spawnSync(process.execPath, ["packages/token-data/scripts/sync-data.mjs", ...process.argv.slice(2)], {
  cwd: process.cwd(),
  stdio: "inherit",
});
process.exit(result.status ?? 1);
