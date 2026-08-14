import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const file = path.join(root, "pnpm-workspace.yaml");
const text = fs.readFileSync(file, "utf8");
const required = ["@prisma/engines", "bigint-buffer", "bufferutil", "prisma", "sharp", "utf-8-validate"];
const errors = [];
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
console.log(`[ok] pnpm strictDepBuilds enabled; ${required.length} reviewed build dependencies explicitly allowed.`);
