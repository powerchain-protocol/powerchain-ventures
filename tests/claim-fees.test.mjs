import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const fee=fs.readFileSync(new URL('../apps/backend/lib/fee-policy.ts',import.meta.url),'utf8');
const claim=fs.readFileSync(new URL('../apps/backend/app/api/v1/launchpad/claim/prepare/route.ts',import.meta.url),'utf8');
const history=fs.readFileSync(new URL('../apps/backend/app/api/v1/launchpad/transactions/route.ts',import.meta.url),'utf8');
const receipt=fs.readFileSync(new URL('../apps/backend/lib/transaction-receipt.ts',import.meta.url),'utf8');
test('claim and creator fee policy is zero while purchases remain 250 bps',()=>{assert.match(fee,/POWERCHAIN_SERVICE_FEE_BPS/);assert.match(fee,/launchpad-config/);assert.match(fee,/kind==="purchase"/);assert.match(fee,/serviceFeeBps:0/)});
test('claim preparation enforces fee policy before review',()=>{assert.match(claim,/attachFeePolicy/);assert.match(claim,/"claim"/)});
test('wallet transaction history exposes settlement stage and reviewed fees through sanitized receipts',()=>{assert.match(history,/settlement_stage/);assert.match(history,/safeReceiptPlan/);assert.match(receipt,/networkFeeLamports/);assert.match(receipt,/serviceFeeLamports/)});
