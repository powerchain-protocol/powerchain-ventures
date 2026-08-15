import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

test("Next App Router has no logical page/route collisions", () => {
  for (const app of ["frontend", "backend"]) {
    const base = path.join(root, "apps", app, "app");
    const seen = new Map();

    for (const file of walk(base)) {
      const baseName = path.basename(file);
      if (baseName !== "page.tsx" && baseName !== "route.ts") continue;

      const parts = path.relative(base, path.dirname(file))
        .split(path.sep)
        .filter(Boolean)
        .filter(part => !(part.startsWith("(") && part.endsWith(")")));
      const route = "/" + parts.join("/");
      const key = `${baseName}:${route}`;

      assert.equal(
        seen.has(key),
        false,
        `duplicate logical ${baseName} route ${route}: ${seen.get(key)} and ${file}`,
      );
      seen.set(key, file);

      const sibling = baseName === "page.tsx" ? "route.ts" : "page.tsx";
      assert.equal(
        fs.existsSync(path.join(path.dirname(file), sibling)),
        false,
        `${app} segment ${route} contains both page.tsx and route.ts`,
      );
    }
  }
});
