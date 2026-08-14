import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('frontend status and wallet types are centralized',()=>{
 const status=fs.readFileSync('apps/frontend/types/status.ts','utf8');
 const wallets=fs.readFileSync('apps/frontend/types/wallets.ts','utf8');
 assert.match(status,/SettlementStatus/);
 assert.match(status,/describeNetworkStatus/);
 assert.match(status,/describeWalletStatus/);
 assert.match(wallets,/WalletProviderOption/);
 assert.match(wallets,/shortenWalletAddress/);
});

test('wallet modal exposes non-custodial review safety',()=>{
 const modal=fs.readFileSync('apps/frontend/components/wallet/wallet-connect-modal.tsx','utf8');
 assert.match(modal,/never requests private keys/);
 assert.match(modal,/review screen/);
 assert.match(modal,/aria-modal="true"/);
});
