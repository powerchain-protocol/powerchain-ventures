import test from 'node:test';
import assert from 'node:assert/strict';

import { PowerChainError, apiErrorMessage, errorCodeOf, isPowerChainError, messageOf, normalizeError } from '../dist/utils/errors.js';

test('PowerChain errors expose stable status and retry policy', () => {
  const rate = new PowerChainError('RATE_LIMITED', 'Slow down');
  assert.equal(rate.status, 429);
  assert.equal(rate.retryable, true);
  assert.equal(isPowerChainError(rate), true);
  assert.equal(errorCodeOf(rate), 'RATE_LIMITED');
});

test('unknown errors normalize without losing the message', () => {
  const normalized = normalizeError(new Error('boom'));
  assert.equal(normalized.code, 'INTERNAL_ERROR');
  assert.equal(normalized.message, 'boom');
  assert.equal(messageOf('plain'), 'plain');
});

test('API error payload message extraction is safe', () => {
  assert.equal(apiErrorMessage({ error: { message: 'Denied' } }), 'Denied');
  assert.equal(apiErrorMessage({ message: 'Fallback body' }), 'Fallback body');
  assert.equal(apiErrorMessage(null, 'Fallback'), 'Fallback');
});
