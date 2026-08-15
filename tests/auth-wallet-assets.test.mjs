import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=rel=>fs.readFileSync(path.join(root,rel),"utf8");

test("Better Auth and social login are wired",()=>{
  const auth=read("apps/backend/lib/better-auth.ts");
  assert.match(auth,/betterAuth\(/);
  assert.match(auth,/socialProviders/);
  assert.match(auth,/google/);
  assert.match(auth,/github/);
  assert.match(auth,/discord/);
  assert.match(read("apps/frontend/lib/auth-client.ts"),/createAuthClient/);
});

test("Solana login verifies a dedicated signed message",()=>{
  const source=read("apps/backend/lib/wallet-auth.ts");
  assert.match(source,/createHmac/);
  assert.match(source,/timingSafeEqual/);
  assert.match(source,/createPublicKey/);
  assert.match(source,/verify\(/);
  assert.match(source,/This does not authorize a transaction/);
});

test("web3 icons package is used for token, network and wallet icons",()=>{
  const source=read("apps/frontend/components/web3/asset-icon.tsx");
  assert.match(source,/@web3icons\/react\/dynamic/);
  assert.match(source,/TokenIcon/);
  assert.match(source,/NetworkIcon/);
  assert.match(source,/WalletIcon/);
});

test("asset registry includes PWRC SOL USDC and SUI",()=>{
  const source=read("apps/frontend/data/assets.ts");
  for(const symbol of ["PWRC","SOL","USDC","SUI"]){
    assert.match(source,new RegExp(`symbol: "${symbol}"`));
  }
});

test("SUI settlement is fail closed until adapter is configured",()=>{
  const source=read("apps/frontend/types/payments.ts");
  assert.match(source,/asset: "SUI"/);
  assert.match(source,/enabled: false/);
  assert.match(source,/Launchpad settlement requires Sui finality and delivery verification/);
});


test("Mysten dApp Kit provides real Sui wallet connectivity",()=>{
  const config=read("apps/frontend/lib/sui-dapp-kit.ts");
  const provider=read("apps/frontend/context/sui-wallet-provider.tsx");
  assert.match(config,/@mysten\/dapp-kit-react/);
  assert.match(config,/SuiGrpcClient/);
  assert.match(config,/fullnode\.mainnet\.sui\.io/);
  assert.match(provider,/DAppKitProvider/);
});

test("USDC wallet integration uses Circle canonical addresses",()=>{
  const source=read("packages/config/src/assets.ts");
  assert.match(source,/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/);
  assert.match(source,/4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU/);
  assert.match(source,/dba34672e30cb065/);
});

test("checkout keeps USDC and SUI disabled until settlement adapters exist",()=>{
  const source=read("apps/frontend/types/payments.ts");
  assert.match(source,/asset: "USDC"[\s\S]*enabled: false/);
  assert.match(source,/asset: "SUI"[\s\S]*enabled: false/);
});
