import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const errors = [];

const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor !== 24) {
  errors.push(`Node.js 24.x is required; current runtime is ${process.version}`);
}

if (pkg.packageManager !== "pnpm@11.21.0") {
  errors.push(`packageManager must be pnpm@11.21.0; found ${pkg.packageManager ?? "missing"}`);
}
if (pkg.engines?.node !== ">=24 <25") {
  errors.push(`engines.node must be >=24 <25`);
}
if (pkg.engines?.pnpm !== ">=11.21.0 <12") {
  errors.push(`engines.pnpm must be >=11.21.0 <12`);
}

if (errors.length) {
  console.error(errors.map((message) => `[error] ${message}`).join("\n"));
  process.exit(1);
}

console.log(`[ok] Node ${process.versions.node} active; repository expects pnpm 11.21.0.`);
