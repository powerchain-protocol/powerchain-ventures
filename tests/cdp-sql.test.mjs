import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../apps/backend/lib/cdp-sql.ts',import.meta.url),'utf8');
test('CDP SQL uses request-bound JWT and fixed read-only endpoint',()=>{assert.match(source,/generateJwt/);assert.match(source,/requestMethod:"POST"/);assert.match(source,/\/platform\/v2\/data\/query\/run/);assert.match(source,/only permits SELECT/)});
test('CDP Solana queries scope active rows and time ranges',()=>{assert.match(source,/solana\.transfers/);assert.match(source,/solana\.instructions/);assert.match(source,/action = 1/);assert.match(source,/INTERVAL \$\{days\} DAY/)});
test('CDP query inputs are bounded and Solana addresses validated',()=>{assert.match(source,/isSolanaAddress/);assert.match(source,/boundedInt/);assert.match(source,/1,90/);assert.match(source,/1,500/);assert.match(source,/Unsupported instruction filter/)});
