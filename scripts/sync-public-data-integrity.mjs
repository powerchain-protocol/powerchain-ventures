import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "packages/token-data/data/integrity.json");
const canonical = fs.readFileSync(source);
const check = process.argv.includes("--check");
const targets = [
  path.join(root, "apps/frontend/public/data/integrity.json"),
  path.join(root, "apps/mobile/assets/data/integrity.json"),
].filter(target => fs.existsSync(path.dirname(target)));

let drift = 0;
for (const target of targets) {
  if (check) {
    if (!fs.existsSync(target) || !fs.readFileSync(target).equals(canonical)) {
      drift++;
      console.error(`[drift] ${path.relative(root, target)}`);
    } else console.log(`[ok] ${path.relative(root, target)}`);
  } else {
    fs.mkdirSync(path.dirname(target), { recursive:true });
    fs.writeFileSync(target, canonical);
    console.log(`[sync] ${path.relative(root, target)}`);
  }
}
if (check && drift) process.exit(1);
