import test from 'node:test';
import assert from 'node:assert/strict';

import { createIdempotencyKey, createRequestId, parseRetryAfterMs, retryDelayMs } from '../dist/http.js';

test('request and idempotency identifiers have stable scopes', () => {
  assert.match(createRequestId('pc'), /^pc-/);
  assert.match(createIdempotencyKey('purchase'), /^purchase:idem-/);
});

test('Retry-After parser supports seconds and HTTP dates', () => {
  assert.equal(parseRetryAfterMs('2', 1_000), 2_000);
  assert.equal(parseRetryAfterMs(null, 1_000), null);
  assert.equal(parseRetryAfterMs('invalid', 1_000), null);
  const now = Date.parse('2026-08-14T12:00:00Z');
  assert.equal(parseRetryAfterMs('Fri, 14 Aug 2026 12:00:03 GMT', now), 3_000);
});

test('retry delay is bounded', () => {
  assert.equal(retryDelayMs(0, 1_500), 1_500);
  const delay = retryDelayMs(20);
  assert.ok(delay >= 0 && delay <= 9_600);
});
