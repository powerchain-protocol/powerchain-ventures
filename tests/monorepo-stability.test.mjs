import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const rootPkg = JSON.parse(fs.readFileSync('package.json','utf8'));
const envCheck = fs.readFileSync('scripts/check-env-example.mjs','utf8');
const typeDoctor = fs.readFileSync('scripts/check-type-deps.mjs','utf8');

test('monorepo typecheck and build use deterministic package/app stages', () => {
  assert.match(rootPkg.scripts.typecheck, /typecheck:packages/);
  assert.match(rootPkg.scripts.typecheck, /typecheck:apps/);
  assert.match(rootPkg.scripts.build, /build:packages/);
  assert.match(rootPkg.scripts.build, /prisma:generate/);
  assert.ok(rootPkg.scripts['doctor:workspace']);
});

test('root environment validator isolates Expo-native variables', () => {
  assert.match(envCheck, /ignoredPrefixes = \['EXPO_PUBLIC_'\]/);
  assert.match(envCheck, /IOS_BUNDLE_IDENTIFIER/);
  assert.match(envCheck, /ANDROID_PACKAGE_NAME/);
});

test('type doctor covers Expo mobile workspace dependencies', () => {
  assert.match(typeDoctor, /mobile Expo/);
  assert.match(typeDoctor, /mobile React Native/);
  assert.match(typeDoctor, /mobile PowerChain config/);
  assert.match(typeDoctor, /mobile PowerChain utils/);
});
