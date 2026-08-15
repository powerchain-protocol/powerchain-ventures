import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

const required = [
  "README.md",
  "CHANGELOG.md",
  "CONTRIBUTORS.md",
  "apps/README.md",
  "apps/frontend/README.md",
  "apps/backend/README.md",
  "apps/mobile/README.md",
  "docs/ARCHITECTURE.md",
  "docs/ROUTING.md",
  "docs/API.md",
  "docs/DATABASE.md",
  "docs/SECURITY.md",
  "docs/TESTING.md",
  "docs/OPERATIONS.md",
  "docs/DEPLOYMENT.md",
  "docs/RELEASE-CHECKLIST.md",
  "docs/MOBILE.md",
  "docs/PROGRAMS.md",
];

for (const rel of required) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    failures.push(`missing ${rel}`);
    continue;
  }
  const text = fs.readFileSync(file, "utf8");
  if (text.trim().length < 80) failures.push(`${rel} is unexpectedly short`);
}

const rootMarkdown = fs.readdirSync(root)
  .filter(name => name.endsWith(".md"))
  .sort();

const allowedRoot = ["CHANGELOG.md", "CONTRIBUTORS.md", "README.md"];
for (const file of rootMarkdown) {
  if (!allowedRoot.includes(file)) failures.push(`unexpected root markdown ${file}`);
}

console.log(JSON.stringify({
  ok: failures.length === 0,
  checked: required.length,
  failures,
}, null, 2));

if (failures.length) process.exit(1);
