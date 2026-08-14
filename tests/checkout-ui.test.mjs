import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";

const files=[
 "apps/frontend/components/checkout/checkout.tsx",
 "apps/frontend/components/checkout/payment-form.tsx",
 "apps/frontend/components/checkout/payment-methods.tsx",
 "apps/frontend/components/checkout/credit-card.tsx",
 "apps/frontend/components/checkout/onramp.tsx",
];

test("PowerChain checkout component stack exists",()=>{for(const f of files)assert.ok(existsSync(f),f)});
test("checkout uses PowerChain branding only",()=>{const text=files.map(f=>readFileSync(f,"utf8")).join("\n");assert.match(text,/PowerChain Checkout/);assert.doesNotMatch(text,/PowerPay Checkout|Powered by PowerPay/i)});
test("card option does not collect raw card secrets",()=>{const text=readFileSync("apps/frontend/components/checkout/payment-form.tsx","utf8");assert.doesNotMatch(text,/<input[^>]+(?:card|cvv|expiry|pan)/i);assert.match(text,/PCI-safe by design/)});
test("checkout exposes verified completion receipt and recovery-friendly actions",()=>{const success=readFileSync("apps/frontend/components/checkout/checkout-success.tsx","utf8"),form=readFileSync("apps/frontend/components/checkout/payment-form.tsx","utf8");assert.match(success,/Purchase successful/);assert.match(success,/View transaction receipt/);assert.match(success,/explorer\.solana\.com\/tx/);assert.match(form,/onSettled/)});
test("unconfigured card and onramp methods are visibly fail-closed",()=>{const text=["apps/frontend/components/checkout/payment-form.tsx","apps/frontend/components/checkout/onramp.tsx"].map(f=>readFileSync(f,"utf8")).join("\n");assert.match(text,/Setup required/);assert.match(text,/provider not configured/i)});
