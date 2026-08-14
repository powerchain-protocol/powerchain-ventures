import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const frontendPkg = path.join(root, "apps/frontend/package.json");
const req = createRequire(frontendPkg);
const failures = [];

const targets = [
  ["PowerChain config", "@powerchain/launchpad-config"],
  ["PowerChain utils helpers", "@powerchain/utils/helpers"],
  ["PowerChain utils HTTP", "@powerchain/utils/http"],
  ["ConnectorKit React", "@solana/connector/react"],
  ["ConnectorKit headless", "@solana/connector/headless"],
];

for (const [label, target] of targets) {
  try {
    const resolved = req.resolve(target);
    console.log(`[ok] ${label}: ${resolved}`);
  } catch (error) {
    failures.push(`${label} (${target})`);
    console.error(`[missing] ${label}: ${target}`);
  }
}

const frontend = JSON.parse(fs.readFileSync(frontendPkg, "utf8"));
if (frontend.dependencies?.["@solana/connector"] !== "0.2.6") {
  failures.push("@solana/connector must be pinned to 0.2.6");
}
for (const dep of ["@powerchain/launchpad-config", "@powerchain/utils"]) {
  if (frontend.dependencies?.[dep] !== "workspace:*") failures.push(`${dep} must use workspace:*`);
}

if (failures.length) {
  console.error(`\nPowerChain frontend resolution doctor failed (${failures.length} issue${failures.length === 1 ? "" : "s"}).`);
  for (const failure of failures) console.error(` - ${failure}`);
  console.error("\nFrom the repository root run:");
  console.error("  corepack enable");
  console.error("  pnpm install --force --no-frozen-lockfile");
  console.error("  pnpm doctor:frontend");
  process.exit(1);
}

console.log("\nPowerChain frontend module resolution passed.");
