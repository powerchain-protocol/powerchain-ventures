import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const source = path.join(root, "packages/token-data/data/pwrc.json");
const check = process.argv.includes("--check");
const targets = [
  path.join(root, "apps/frontend/public/data/pwrc.json"),
  path.join(root, "apps/mobile/assets/data/pwrc.json"),
].filter(target => fs.existsSync(path.dirname(target)));

const canonical = fs.readFileSync(source);
let drift = 0;
for (const target of targets) {
  if (check) {
    if (!fs.existsSync(target) || !fs.readFileSync(target).equals(canonical)) {
      drift++;
      console.error(`[drift] ${path.relative(root, target)}`);
    } else console.log(`[ok] ${path.relative(root, target)}`);
  } else {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, canonical);
    console.log(`[sync] ${path.relative(root, target)}`);
  }
}
if (check && drift) process.exit(1);
