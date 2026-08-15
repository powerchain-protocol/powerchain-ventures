import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const failures=[];

for(const rel of [
  "apps/backend/lib/better-auth.ts",
  "apps/backend/lib/wallet-auth.ts",
  "apps/backend/app/api/auth/[...all]/route.ts",
  "apps/backend/app/api/v1/auth/wallet/challenge/route.ts",
  "apps/backend/app/api/v1/auth/wallet/verify/route.ts",
  "apps/frontend/lib/auth-client.ts",
  "apps/frontend/hooks/use-solana-login.ts",
  "apps/frontend/hooks/use-users.ts",
  "apps/frontend/types/accounts.ts",
  "apps/frontend/data/assets.ts",
  "apps/frontend/types/charts.ts",
  "apps/frontend/components/ui/charts.tsx",
  "apps/frontend/components/ui/invoice.tsx",
  "apps/frontend/components/web3/asset-icon.tsx",
  "database/migrations/034_better_auth_wallet_accounts.sql",
  "apps/frontend/components/topbar.tsx",
  "apps/frontend/config/topbar.ts",
  "apps/frontend/components/ui/information.tsx",
  "apps/frontend/components/ui/alarms.tsx",
  "apps/frontend/data/networks.ts",
  "apps/frontend/components/clusters/cluster-selector.tsx",
  "apps/backend/lib/account-session.ts",
  "apps/backend/app/api/v1/account/wallets/route.ts",
  "apps/frontend/components/account/account-security.tsx",
  "apps/frontend/data/network-capabilities.ts",
  "apps/frontend/components/ui/states.tsx",
]){
  if(!fs.existsSync(path.join(root,rel))){
    failures.push(`missing ${rel}`);
  }
}

const frontendPackage=JSON.parse(
  fs.readFileSync(path.join(root,"apps/frontend/package.json"),"utf8")
);
const backendPackage=JSON.parse(
  fs.readFileSync(path.join(root,"apps/backend/package.json"),"utf8")
);

if(frontendPackage.dependencies?.["better-auth"]!=="1.6.25"){
  failures.push("frontend better-auth dependency is not pinned to 1.6.25");
}
if(backendPackage.dependencies?.["better-auth"]!=="1.6.25"){
  failures.push("backend better-auth dependency is not pinned to 1.6.25");
}
if(frontendPackage.dependencies?.["@web3icons/react"]!=="4.1.19"){
  failures.push("@web3icons/react dependency is not pinned to 4.1.19");
}
if(frontendPackage.dependencies?.["@mysten/dapp-kit-react"]!=="2.1.14"){
  failures.push("@mysten/dapp-kit-react dependency is not pinned to 2.1.14");
}
if(frontendPackage.dependencies?.["@mysten/sui"]!=="2.22.0"){
  failures.push("@mysten/sui dependency is not pinned to 2.22.0");
}

const walletAuth=fs.readFileSync(
  path.join(root,"apps/backend/lib/wallet-auth.ts"),
  "utf8",
);
for(const value of [
  "createHmac",
  "timingSafeEqual",
  "verify(",
  "Expiration Time:",
  "This does not authorize a transaction",
]){
  if(!walletAuth.includes(value)){
    failures.push(`wallet auth missing ${value}`);
  }
}

const frontendEnv=fs.readFileSync(
  path.join(root,"apps/frontend/.env.example"),
  "utf8",
);
for(const secret of [
  "BETTER_AUTH_SECRET",
  "GOOGLE_CLIENT_SECRET",
  "GITHUB_CLIENT_SECRET",
  "DISCORD_CLIENT_SECRET",
]){
  if(frontendEnv.includes(secret)){
    failures.push(`frontend exposes ${secret}`);
  }
}

console.log(JSON.stringify({
  ok:failures.length===0,
  failures,
},null,2));

if(failures.length)process.exit(1);
