import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
const read=(p)=>fs.readFileSync(p,"utf8");
test("mobile page is keyboard-aware and refreshable",()=>{const s=read("apps/mobile/src/components/page.tsx");assert.match(s,/KeyboardAvoidingView/);assert.match(s,/RefreshControl/);});
test("mobile buttons provide haptics and accessibility state",()=>{const s=read("apps/mobile/src/components/ui.tsx");assert.match(s,/Haptics\.selectionAsync/);assert.match(s,/accessibilityState/);});
test("mobile GET api uses bounded retry and timeout",()=>{const s=read("apps/mobile/src/lib/api.ts");assert.match(s,/method === "GET" \? 2 : 1/);assert.match(s,/apiTimeoutMs/);assert.match(s,/NETWORK_UNAVAILABLE/);});
test("mobile environment documents timeout",()=>{assert.match(read("apps/mobile\/.env.example"),/EXPO_PUBLIC_API_TIMEOUT_MS=12000/);});
