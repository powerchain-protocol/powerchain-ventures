import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const envPath = path.join(root, '.env.example');
const text = fs.readFileSync(envPath, 'utf8');
const documented = new Set(
  text.split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#') && line.includes('='))
    .map(line => line.slice(0, line.indexOf('=')))
);

const roots = ['apps', 'packages', 'scripts'];
const extensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs']);
const refs = new Set();
const ignored = new Set(['VERCEL', 'NEXT_RUNTIME']); // platform-provided, not user configuration
const ignoredPrefixes = ['EXPO_PUBLIC_'];
const mobileOnly = new Set(['IOS_BUNDLE_IDENTIFIER', 'ANDROID_PACKAGE_NAME']);

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.next'].includes(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (p === path.join(root, 'apps', 'mobile')) continue;
    if (entry.isDirectory()) walk(p);
    else if (extensions.has(path.extname(entry.name))) {
      const src = fs.readFileSync(p, 'utf8');
      for (const match of src.matchAll(/(?:process\.env\.|source\.|env\[?["']?)([A-Z][A-Z0-9_]{2,})/g)) {
        const name = match[1];
        if (!ignored.has(name) && !ignoredPrefixes.some(prefix => name.startsWith(prefix)) && !mobileOnly.has(name)) refs.add(name);
      }
      for (const match of src.matchAll(/env\(["']([A-Z][A-Z0-9_]{2,})["']\)/g)) {
        if (!ignored.has(match[1]) && !ignoredPrefixes.some(prefix => match[1].startsWith(prefix)) && !mobileOnly.has(match[1])) refs.add(match[1]);
      }
    }
  }
}
for (const relative of roots) {
  const dir = path.join(root, relative);
  if (fs.existsSync(dir)) walk(dir);
}

// These are runtime/platform values intentionally not user-set in .env.example.
for (const name of ['NODE_ENV']) refs.add(name);

const missing = [...refs].filter(name => !documented.has(name)).sort();
if (missing.length) {
  console.error(JSON.stringify({ ok: false, missingFromEnvExample: missing }, null, 2));
  process.exit(1);
}

const duplicates = [...documented].filter(name => {
  const count = text.split(/\r?\n/).filter(line => line.trim().startsWith(`${name}=`)).length;
  return count > 1;
});
if (duplicates.length) {
  console.error(JSON.stringify({ ok: false, duplicateEnvKeys: duplicates.sort() }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, documentedKeys: documented.size, referencedKeys: refs.size }, null, 2));
