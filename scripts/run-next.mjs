import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const appName = process.argv[2];
const command = process.argv[3];
const forwarded = process.argv.slice(4);

const apps = {
  frontend: { directory: "apps/frontend", port: "3000" },
  backend: { directory: "apps/backend", port: "3001" },
  checkout: { directory: "apps/checkout", port: "3002" },
};

if (!(appName in apps) || !["dev", "build", "start"].includes(command)) {
  console.error("Usage: node scripts/run-next.mjs <frontend|backend|checkout> <dev|build|start> [...next args]");
  process.exit(2);
}

const app = apps[appName];
const appDir = path.join(root, app.directory);
const hasAppRouter = fs.existsSync(path.join(appDir, "app"));
const hasPagesRouter = fs.existsSync(path.join(appDir, "pages"));
const hasSrcAppRouter = fs.existsSync(path.join(appDir, "src/app"));
const hasSrcPagesRouter = fs.existsSync(path.join(appDir, "src/pages"));

if (!fs.existsSync(path.join(appDir, "package.json"))) {
  console.error(`[PowerChain] Missing ${app.directory}/package.json`);
  process.exit(1);
}

if (!hasAppRouter && !hasPagesRouter && !hasSrcAppRouter && !hasSrcPagesRouter) {
  console.error(`[PowerChain] ${appName} has no app/pages router under ${appDir}`);
  process.exit(1);
}

const major = Number(process.versions.node.split(".")[0]);
if (major !== 24) {
  console.error(`[PowerChain] Node 24 is required; current runtime is ${process.version}.`);
  console.error("Run: nvm use 24");
  process.exit(1);
}

const require = createRequire(import.meta.url);
let nextCli;
try {
  nextCli = require.resolve("next/dist/bin/next");
} catch {
  console.error("[PowerChain] Next.js is not installed. Run: pnpm install");
  process.exit(1);
}

const args = [nextCli, command, appDir];
if ((command === "dev" || command === "start") && !forwarded.some((arg) => arg === "-p" || arg === "--port")) {
  args.push("--port", app.port);
}
args.push(...forwarded);

console.log(`[PowerChain] next ${command} ${app.directory}${command === "dev" || command === "start" ? ` (port ${app.port})` : ""}`);

const child = spawn(process.execPath, args, {
  cwd: root,
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
  stdio: "inherit",
});

child.once("error", (error) => {
  console.error(`[PowerChain] Failed to launch Next.js: ${error.message}`);
  process.exit(1);
});

child.once("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
