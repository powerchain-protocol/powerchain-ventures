import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const target = process.argv[2] ?? "all";
const apps = target === "all" ? ["frontend", "backend", "checkout"] : [target];
for (const app of apps) {
  if (!new Set(["frontend", "backend", "checkout"]).has(app)) {
    console.error("Usage: node scripts/clean-next-cache.mjs [frontend|backend|checkout|all]");
    process.exit(2);
  }
  const dir = path.join(root, "apps", app, ".next");
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`[PowerChain] cleared ${path.relative(root, dir)}`);
}
