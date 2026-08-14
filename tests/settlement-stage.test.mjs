import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const migration=fs.readFileSync(new URL('../database/migrations/020_monotonic_settlement_and_purchase_review_guard.sql',import.meta.url),'utf8');
const state=fs.readFileSync(new URL('../apps/backend/lib/confirmation-state.ts',import.meta.url),'utf8');
const prepare=fs.readFileSync(new URL('../apps/backend/app/api/v1/launchpad/purchase/prepare/route.ts',import.meta.url),'utf8');
test('database settlement stage advancement is monotonic and terminal',()=>{assert.match(migration,/launchpad_advance_review_stage/);assert.match(migration,/for update/);assert.match(migration,/v_next_rank < v_current_rank/);assert.match(migration,/settled','failed','expired/)});
test('shared confirmation state delegates stage transitions to database RPC',()=>{assert.match(state,/launchpad_advance_review_stage/);assert.doesNotMatch(state,/patch\(/)});
test('purchase preparation prevents duplicate live reviews',()=>{assert.match(prepare,/kind=eq\.purchase/);assert.match(prepare,/status=in\.\(prepared,submitted\)/);assert.match(prepare,/already prepared for this wallet and sale/)});
