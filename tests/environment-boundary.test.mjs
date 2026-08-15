import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const forbiddenMobile = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "HELIUS_API_KEY",
  "BIRDEYE_API_KEY",
  "CDP_API_KEY_SECRET",
  "PRIVATE_KEY",
  "SEED_PHRASE",
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

test("mobile source does not reference server-only credentials", () => {
  for (const file of walk(path.join(root, "apps/mobile"))) {
    if (!/\.(ts|tsx|js|jsx|json)$/.test(file)) continue;
    const source = fs.readFileSync(file, "utf8");
    for (const secret of forbiddenMobile) {
      assert.equal(source.includes(secret), false, `${file} references ${secret}`);
    }
  }
});

test("local environment files are not packaged", () => {
  for (const file of walk(root)) {
    const name = path.basename(file);
    if (!name.startsWith(".env")) continue;
    const allowedLocal =
      name === ".env.local" &&
      (
        file === path.join(root, ".env.local") ||
        file === path.join(root, "apps/frontend/.env.local") ||
        file === path.join(root, "apps/backend/.env.local")
      );
    assert.equal(
      name === ".env.example" || name.endsWith(".example") || allowedLocal,
      true,
      `${file} must be an example or approved secret-free local env`,
    );
  }
});
