import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=rel=>fs.readFileSync(path.join(root,rel),"utf8");

test("topbar release text is config driven",()=>{
  const config=read("apps/frontend/config/topbar.ts");
  const component=read("apps/frontend/components/topbar.tsx");
  assert.match(config,/releaseLabel: "RC\.1"/);
  assert.match(config,/enabled: true/);
  assert.match(component,/TOPBAR_CONFIG/);
  assert.match(component,/NEXT_PUBLIC_TOPBAR_ENABLED|topbarEnabled/);
});

test("information and alarm primitives exist",()=>{
  assert.match(
    read("packages/ui/src/information.tsx"),
    /export function Information/,
  );
  assert.match(
    read("packages/ui/src/alarms.tsx"),
    /export function Alarm/,
  );
  assert.match(
    read("apps/frontend/components/ui/information.tsx"),
    /@powerchain\/ui/,
  );
});

test("network configuration contains Solana and Sui",()=>{
  const source=read("apps/frontend/data/networks.ts");
  assert.match(source,/solana-mainnet/);
  assert.match(source,/sui-mainnet/);
  assert.match(source,/settlementEnabled: false/);
});

test("cluster components are reusable",()=>{
  for(const rel of [
    "apps/frontend/components/clusters/cluster-icon.tsx",
    "apps/frontend/components/clusters/cluster-badge.tsx",
    "apps/frontend/components/clusters/cluster-card.tsx",
    "apps/frontend/components/clusters/cluster-selector.tsx",
  ]){
    assert.equal(fs.existsSync(path.join(root,rel)),true,`${rel} missing`);
  }
});
