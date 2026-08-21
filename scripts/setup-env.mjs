import { copyFile, access } from "node:fs/promises";
import { constants } from "node:fs";

const pairs = [
  [".env.example", ".env"],
  ["apps/frontend/.env.example", "apps/frontend/.env.local"],
  ["apps/marketplace/.env.example", "apps/marketplace/.env.local"],
  ["apps/api/.env.example", "apps/api/.env"]
];

for (const [source, destination] of pairs) {
  try { await access(destination, constants.F_OK); console.log(`skip ${destination} (already exists)`); }
  catch { await copyFile(source, destination); console.log(`created ${destination}`); }
}
