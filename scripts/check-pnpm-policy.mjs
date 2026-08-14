import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const file = path.join(root, "pnpm-workspace.yaml");
const text = fs.readFileSync(file, "utf8");
const required = ["@prisma/engines", "bigint-buffer", "bufferutil", "prisma", "sharp", "utf-8-validate"];
const errors = [];

const rootPkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (rootPkg.packageManager !== "pnpm@11.21.0") errors.push("packageManager must be pnpm@11.21.0");
if (rootPkg.devEngines?.runtime) errors.push("devEngines.runtime must be absent; Node is managed by nvm/Corepack and engines");
if (rootPkg.engines?.node !== ">=24 <25") errors.push("engines.node must be >=24 <25");
if (rootPkg.engines?.pnpm !== ">=11.21.0 <12") errors.push("engines.pnpm must be >=11.21.0 <12");
for (const [fileName, expected] of [[".nvmrc", "24"], [".node-version", "24"]]) {
  const filePath = path.join(root, fileName);
  if (!fs.existsSync(filePath) || fs.readFileSync(filePath, "utf8").trim() !== expected) {
    errors.push(`${fileName} must contain ${expected}`);
  }
}
if (!/^strictDepBuilds:\s*true$/m.test(text)) errors.push("strictDepBuilds must remain true");
for (const name of required) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`^[ \t]*(?:[\"']?${escaped}[\"']?):[ \t]*true[ \t]*$`, "m");
  if (!re.test(text)) errors.push(`allowBuilds missing trusted dependency: ${name}`);
}
if (errors.length) {
  console.error(errors.map((e) => `[error] ${e}`).join("\n"));
  process.exit(1);
}
console.log(`[ok] Node 24 + pnpm 11.21.0 policy valid; strictDepBuilds enabled; ${required.length} reviewed build dependencies explicitly allowed.`);
