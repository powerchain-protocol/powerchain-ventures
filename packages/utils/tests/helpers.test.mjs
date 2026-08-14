import test from 'node:test';
import assert from 'node:assert/strict';

import {
  asPositiveUint,
  asUint,
  formatBaseUnits,
  isConfiguredSecret,
  isSolanaAddress,
  isUsableSolanaWalletAddress,
  normalizeOrigin,
  parseCsvList,
  redactSecret,
  requireUsableSolanaWalletAddress,
  shortAddress,
} from '../dist/helpers.js';

test('Solana address and wallet guards reject placeholders', () => {
  const feeWallet = 'FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy';
  assert.equal(isSolanaAddress(feeWallet), true);
  assert.equal(isUsableSolanaWalletAddress(feeWallet), true);
  assert.equal(isUsableSolanaWalletAddress('11111111111111111111111111111111'), false);
  assert.throws(() => requireUsableSolanaWalletAddress('11111111111111111111111111111111'));
});

test('unsigned bigint parsing and formatting stay exact', () => {
  assert.equal(asUint('5000000000'), 5_000_000_000n);
  assert.equal(asPositiveUint('1'), 1n);
  assert.throws(() => asUint('-1'));
  assert.throws(() => asPositiveUint('0'));
  assert.equal(formatBaseUnits('18446000000000000000', 9, 9), '18446000000');
});

test('string helpers normalize without exposing secrets', () => {
  assert.deepEqual(parseCsvList('a, b, a, ,c'), ['a', 'b', 'c']);
  assert.equal(normalizeOrigin('https://launchpad.powerchain.example///'), 'https://launchpad.powerchain.example');
  assert.equal(shortAddress('FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy'), 'Fees…Nhqy');
  assert.equal(isConfiguredSecret('x'.repeat(20)), true);
  assert.equal(redactSecret('abcdefghijklmnopqrstuvwxyz'), 'abc…xyz');
});
