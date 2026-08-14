import test from 'node:test'; import assert from 'node:assert/strict';
import {buildQuote,calculateServiceFee,resolveSalePhase,normalizeWalletList,vestedBaseUnits,claimableBaseUnits,assertAllocationAvailable,validateSaleTiming,validateSaleEconomics,assertTransactionReview,resolveActivationPhase} from '../packages/domain/dist/index.js';
test('service fee is exactly 2.5% rounded up in integer units',()=>{assert.equal(calculateServiceFee(1000000n),25000n);assert.equal(calculateServiceFee(1n),1n)});
test('quote uses deterministic integer arithmetic',()=>{assert.deepEqual(buildQuote({usdMicros:250000000n,priceUsdMicros:25000n,decimals:9}),{tokenBaseUnits:10000000000000n,serviceFeeUsdMicros:6250000n,totalUsdMicros:256250000n})});
test('sale lifecycle resolves time boundaries',()=>{const c={phase:'public',startsAt:'2026-08-01T00:00:00Z',endsAt:'2026-08-31T00:00:00Z',claimStartsAt:'2026-09-01T00:00:00Z'};assert.equal(resolveSalePhase(c,new Date('2026-07-01')),'scheduled');assert.equal(resolveSalePhase(c,new Date('2026-08-13')),'public');assert.equal(resolveSalePhase(c,new Date('2026-08-31T12:00:00Z')),'ended');assert.equal(resolveSalePhase(c,new Date('2026-09-02')),'claimable')});
test('wallet list rejects malformed addresses and removes duplicates',()=>{const w='11111111111111111111111111111111';assert.deepEqual(normalizeWalletList([w,w]),[w]);assert.throws(()=>normalizeWalletList(['bad']))});
test('linear vesting respects cliff and claimed amount',()=>{const s={totalBaseUnits:1000n,claimedBaseUnits:100n,startsAt:'2026-01-01T00:00:00Z',cliffAt:'2026-02-01T00:00:00Z',endsAt:'2026-03-01T00:00:00Z'};assert.equal(vestedBaseUnits(s,new Date('2026-01-15')),0n);assert.equal(vestedBaseUnits(s,new Date('2026-03-02')),1000n);assert.equal(claimableBaseUnits(s,new Date('2026-03-02')),900n)});
test('allocation cannot oversell',()=>{assert.doesNotThrow(()=>assertAllocationAvailable(1000n,600n,400n));assert.throws(()=>assertAllocationAvailable(1000n,600n,401n))});

test("sale timing requires start < end <= claim start", () => {
  assert.doesNotThrow(() => validateSaleTiming("2026-09-01T00:00:00Z","2026-09-02T00:00:00Z","2026-09-02T00:00:00Z"));
  assert.throws(() => validateSaleTiming("2026-09-02T00:00:00Z","2026-09-01T00:00:00Z","2026-09-03T00:00:00Z"));
});

test("sale economics rejects inverted wallet limits", () => {
  assert.doesNotThrow(() => validateSaleEconomics({priceUsdMicros:10_000n,allocationBaseUnits:1_000_000n,minPurchaseUsdMicros:50_000_000n,maxPurchaseUsdMicros:100_000_000n}));
  assert.throws(() => validateSaleEconomics({priceUsdMicros:10_000n,allocationBaseUnits:1_000_000n,minPurchaseUsdMicros:100_000_000n,maxPurchaseUsdMicros:50_000_000n}));
});

test("transaction review verifies exact fee total", () => {
  const address="11111111111111111111111111111111";
  const plan={id:"review-1",cluster:"devnet",feePayer:address,instructions:[{index:0,programId:address,programName:"System",accounts:[],dataBase64:"",summary:"Review test"}],fees:{networkFeeLamports:5000n,serviceFeeLamports:0n,rentLamports:0n,totalLamports:5000n},recipients:[]};
  assert.doesNotThrow(() => assertTransactionReview(plan));
  assert.throws(() => assertTransactionReview({...plan,fees:{...plan.fees,totalLamports:4999n}}));
});


test("purchase validation uses each Token-2022 mint decimals", async () => {
  const {validatePurchase}=await import('../packages/domain/dist/index.js');
  const config={id:"x",name:"x",symbol:"X",mint:"11111111111111111111111111111111",tokenProgram:"token-2022",decimals:6,phase:"public",startsAt:"2026-08-01T00:00:00Z",endsAt:"2026-08-31T00:00:00Z",claimStartsAt:"2026-09-01T00:00:00Z",priceUsdMicros:1_000_000n,allocationBaseUnits:10_000_000n,minPurchaseUsdMicros:1_000_000n,maxPurchaseUsdMicros:10_000_000n,eligibility:"public"};
  assert.equal(validatePurchase(config,1_000_000n,0n,new Date("2026-08-14T00:00:00Z")).tokenBaseUnits,1_000_000n);
});

test("transaction review rejects expired or reordered plans", () => {
 const address="11111111111111111111111111111111";
 const base={id:"r",cluster:"devnet",feePayer:address,instructions:[{index:0,programId:address,programName:"System",accounts:[],dataBase64:"",summary:"x"}],fees:{networkFeeLamports:1n,serviceFeeLamports:0n,rentLamports:0n,totalLamports:1n},recipients:[]};
 assert.throws(()=>assertTransactionReview({...base,expiresAt:"2026-01-01T00:00:00Z"},new Date("2026-08-14T00:00:00Z")));
 assert.throws(()=>assertTransactionReview({...base,instructions:[{...base.instructions[0],index:1}]}));
});

test("Solana transaction message extraction excludes compact signature bytes", async () => {
  const {transactionMessageBytes}=await import('../packages/solana/dist/index.js');
  const message=Uint8Array.from([1,2,3,4,5,6]);
  const serialized=new Uint8Array(1+64+message.length);
  serialized[0]=1;
  serialized.fill(9,1,65);
  serialized.set(message,65);
  assert.deepEqual([...transactionMessageBytes(serialized)],[...message]);
  assert.throws(()=>transactionMessageBytes(Uint8Array.from([1,2,3])));
});

test("activation respects restricted eligibility and sale window",()=>{
 assert.equal(resolveActivationPhase("public","2026-08-20T00:00:00Z","2026-08-30T00:00:00Z",new Date("2026-08-14T00:00:00Z")),"scheduled");
 assert.equal(resolveActivationPhase("allowlist","2026-08-01T00:00:00Z","2026-08-30T00:00:00Z",new Date("2026-08-14T00:00:00Z")),"private");
 assert.equal(resolveActivationPhase("trusted","2026-08-01T00:00:00Z","2026-08-30T00:00:00Z",new Date("2026-08-14T00:00:00Z")),"private");
 assert.throws(()=>resolveActivationPhase("public","2026-08-01T00:00:00Z","2026-08-10T00:00:00Z",new Date("2026-08-14T00:00:00Z")));
});
