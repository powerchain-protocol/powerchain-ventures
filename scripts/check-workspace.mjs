import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const VERSION = '1.0.0';
const packageRoots = ['apps', 'packages'];
const packageDirs = [];
for (const dir of packageRoots) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) continue;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (entry.isDirectory() && fs.existsSync(path.join(abs, entry.name, 'package.json'))) {
      packageDirs.push(path.join(abs, entry.name));
    }
  }
}

const packages = new Map();
const failures = [];
for (const dir of packageDirs) {
  const file = path.join(dir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!pkg.name) failures.push(`${path.relative(root, file)} missing name`);
  if (pkg.version !== VERSION) failures.push(`${pkg.name ?? file} version must remain ${VERSION}`);
  if (pkg.name) {
    if (packages.has(pkg.name)) failures.push(`duplicate workspace package name ${pkg.name}`);
    packages.set(pkg.name, { dir, pkg });
  }
}

for (const [name, { dir, pkg }] of packages) {
  for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
    for (const [dep, range] of Object.entries(pkg[field] ?? {})) {
      if (String(range).startsWith('workspace:') && !packages.has(dep)) {
        failures.push(`${name} references missing workspace dependency ${dep}`);
      }
    }
  }

  const sourceImports = new Set();
  const walk = current => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (['node_modules', 'dist', '.next', '.expo', 'Pods', 'build', '.gradle'].includes(entry.name)) continue;
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (/\.(?:ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) {
        const text = fs.readFileSync(file, 'utf8');
        for (const match of text.matchAll(/(?:from\s+|import\s*\(?\s*)["'](@powerchain\/[^"']+)["']/g)) {
          const parts = match[1].split('/');
          sourceImports.add(parts.slice(0, 2).join('/'));
        }
      }
    }
  };
  walk(dir);
  const declared = new Set(Object.keys({ ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}), ...(pkg.peerDependencies ?? {}), ...(pkg.optionalDependencies ?? {}) }));
  for (const dep of sourceImports) {
    if (dep !== name && packages.has(dep) && !declared.has(dep)) failures.push(`${name} imports undeclared workspace dependency ${dep}`);
  }

  if (name.startsWith('@powerchain/') && name !== '@powerchain/launchpad-frontend' && name !== '@powerchain/launchpad-backend' && name !== '@powerchain/launchpad-mobile') {
    if (!pkg.exports?.['.']) failures.push(`${name} must expose an explicit package export`);
    const rootExport = pkg.exports?.['.'];
    const rootImport = typeof rootExport === 'string' ? rootExport : rootExport?.import ?? rootExport?.default;
    if (rootImport && !String(rootImport).startsWith('./dist/')) failures.push(`${name} runtime export must point to dist`);
    if (!pkg.scripts?.typecheck) failures.push(`${name} missing typecheck script`);
    if (!pkg.scripts?.build) failures.push(`${name} missing build script`);
  }
}

const rootPkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (rootPkg.version !== VERSION) failures.push(`root package version must remain ${VERSION}`);
if (rootPkg.packageManager !== 'pnpm@11.21.0') failures.push('root packageManager must be pnpm@11.21.0');
if (rootPkg.devEngines?.runtime) failures.push('root devEngines.runtime must not install a second Node runtime; use .nvmrc/engines/preflight');
if (rootPkg.engines?.node !== '>=24 <25') failures.push('root Node engine must be >=24 <25');
if (rootPkg.engines?.pnpm !== '>=11.21.0 <12') failures.push('root pnpm engine must be >=11.21.0 <12');
for (const script of ['doctor:workspace', 'doctor:types', 'doctor:pnpm', 'doctor:runtime', 'typecheck:packages', 'typecheck:apps', 'build:packages']) {
  if (!rootPkg.scripts?.[script]) failures.push(`root script ${script} is required`);
}

if (failures.length) {
  console.error(JSON.stringify({ ok: false, workspaces: packages.size, failures }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, workspaces: packages.size, version: VERSION, packageNames: [...packages.keys()].sort() }, null, 2));
