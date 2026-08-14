import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor !== 24) {
  console.error(`[PowerChain] Install requires Node 24.x; current runtime is ${process.version}.`);
  console.error("Run: nvm use 24");
  process.exit(1);
}

if (pkg.packageManager !== "pnpm@11.21.0") {
  console.error(`[PowerChain] packageManager must be pnpm@11.21.0; found ${pkg.packageManager ?? "missing"}.`);
  process.exit(1);
}

const userAgent = process.env.npm_config_user_agent ?? "";
const pnpmMatch = userAgent.match(/\bpnpm\/([^\s]+)/);
if (pnpmMatch && pnpmMatch[1] !== "11.21.0") {
  console.error(`[PowerChain] Install requires pnpm 11.21.0; current pnpm is ${pnpmMatch[1]}.`);
  console.error("Run: corepack prepare pnpm@11.21.0 --activate");
  process.exit(1);
}

if (pkg.devEngines?.runtime) {
  console.error("[PowerChain] devEngines.runtime must remain disabled; use nvm Node 24 instead.");
  process.exit(1);
}

console.log(`[PowerChain] install runtime OK (${process.version}, pnpm ${pnpmMatch?.[1] ?? "via Corepack"}).`);
