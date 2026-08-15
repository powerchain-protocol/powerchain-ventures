import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const app = process.argv[2];

const apps = {
  frontend: {
    port: 3000,
    env: [
      "NEXT_PUBLIC_APP_URL",
      "NEXT_PUBLIC_SOLANA_CLUSTER",
      "NEXT_PUBLIC_SOLANA_RPC_URL",
    ],
  },
  backend: {
    port: 3001,
    env: [],
  },
  checkout: {
    port: 3002,
    env: [
      "NEXT_PUBLIC_CHECKOUT_URL",
      "NEXT_PUBLIC_LAUNCHPAD_URL",
      "NEXT_PUBLIC_SOLANA_CLUSTER",
      "NEXT_PUBLIC_SOLANA_RPC_URL",
    ],
  },
};

if (!(app in apps)) {
  console.error("Usage: node scripts/check-dev-start.mjs <frontend|backend|checkout>");
  process.exit(2);
}

const major = Number(process.versions.node.split(".")[0]);
if (major !== 24) {
  console.error(`[PowerChain] Node 24 is required; current runtime is ${process.version}.`);
  console.error("Run: nvm use 24");
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (packageJson.packageManager !== "pnpm@11.21.0") {
  console.error(`[PowerChain] Expected pnpm@11.21.0, found ${packageJson.packageManager ?? "none"}.`);
  process.exit(1);
}

const appDir = path.join(root, "apps", app);
const appEnvCandidates = [
  ".env.development.local",
  ".env.local",
  ".env.development",
  ".env",
];
const hasAppEnv = appEnvCandidates.some((name) => fs.existsSync(path.join(appDir, name)));
if (!hasAppEnv) {
  console.warn(`[PowerChain] No ${app} app-local env file found under ${appDir}.`);
  console.warn(`Create one with: cp apps/${app}/.env.example apps/${app}/.env.local`);
}

const routerCandidates = ["app", "pages", "src/app", "src/pages"];
if (!routerCandidates.some((candidate) => fs.existsSync(path.join(appDir, candidate)))) {
  console.error(`[PowerChain] ${app} has no app/pages router under ${appDir}.`);
  process.exit(1);
}

const port = apps[app].port;
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(`[PowerChain] Invalid ${app} port: ${port}`);
  process.exit(1);
}

await new Promise((resolve, reject) => {
  const server = net.createServer();
  server.unref();
  server.once("error", (error) => {
    if (error?.code === "EADDRINUSE") {
      console.error(`[PowerChain] Port ${port} is already in use; ${app} cannot start.`);
      console.error(`Inspect it on macOS with: lsof -nP -iTCP:${port} -sTCP:LISTEN`);
      console.error(`Or stop the stale process before restarting PowerChain.`);
      reject(error);
      return;
    }
    reject(error);
  });
  server.listen({ host: "127.0.0.1", port }, () => {
    server.close(resolve);
  });
}).catch(() => process.exit(1));

console.log(`[PowerChain] ${app} dev preflight passed (Node ${process.version}, port ${port}).`);
