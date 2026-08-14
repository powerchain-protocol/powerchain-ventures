import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');

test('native launchpad program has explicit operation routing and no fabricated program id',()=>{
 const lib=read('programs/launchpad/src/lib.rs'),processor=read('programs/launchpad/src/processor.rs'),constants=read('packages/config/src/constants.ts');
 assert.match(processor,/InitializeSale/);assert.match(processor,/Purchase/);assert.match(processor,/Claim/);assert.match(processor,/SetPaused/);assert.match(processor,/CompleteSale/);
 assert.match(constants,/POWERCHAIN_LAUNCHPAD_PROGRAM_ID: string \| null = null/);assert.doesNotMatch(lib,/declare_id!/);
});

test('purchase requires buyer and quote-authority signatures plus canonical fee wallet',()=>{
 const processor=read('programs/launchpad/src/processor.rs'),client=read('packages/program-client/src/instructions.ts');
 assert.match(processor,/require_signer\(buyer\)/);assert.match(processor,/require_signer\(quote_authority\)/);assert.match(processor,/sale_state\.quote_authority/);assert.match(processor,/require_fee_wallet\(fee_wallet\)/);
 assert.match(client,/quoteAuthorityWallet:true|meta\(input\.quoteAuthorityWallet,true,false\)/);assert.match(client,/POWERCHAIN_FEE_WALLET_ADDRESS/);
});

test('program separates claim-delivery from vesting and supports immediate completion',()=>{
 const state=read('programs/launchpad/src/state.rs'),processor=read('programs/launchpad/src/processor.rs'),migration=read('database/migrations/024_launchpad_program_operations.sql');
 assert.match(state,/delivery_on_claim: bool/);assert.match(processor,/!sale_state\.delivery_on_claim/);assert.match(processor,/!state\.delivery_on_claim \|\| state\.claimed_base_units == state\.sold_base_units/);
 assert.match(migration,/if delivery='claim' then/);
});

test('program operation APIs persist PDA and operation evidence',()=>{
 for(const p of ['apps/backend/app/api/v1/launchpad/program/status/route.ts','apps/backend/app/api/v1/launchpad/program/operations/route.ts','apps/backend/app/api/v1/launchpad/program/operations/prepare/route.ts','apps/backend/app/api/v1/launchpad/program/operations/confirm/route.ts'])assert.ok(fs.existsSync(p),p);
 const migration=read('database/migrations/024_launchpad_program_operations.sql');assert.match(migration,/launchpad_program_operations/);assert.match(migration,/sale_pda/);assert.match(migration,/participant_pda/);
});

test('mobile creator UX exposes pause resume and bottom navigation',()=>{
 const dashboard=read('apps/frontend/components/launchpad/creator-dashboard.tsx'),styles=read('apps/frontend/app/styles.css');
 assert.match(dashboard,/"pause"\|"resume"/);assert.match(dashboard,/program\/operations\/prepare/);assert.match(styles,/\.mobile-bottom-nav/);assert.match(styles,/@media\(max-width:720px\)/);
});

test('program validates Token-2022 vault binding and non-default quote authority on chain',()=>{
 const processor=read('programs/launchpad/src/processor.rs');
 assert.match(processor,/require_token_mint_owner\(mint, token_program\)/);
 assert.match(processor,/require_token_account_mint\(vault, token_program, mint\.key\)/);
 assert.match(processor,/Pubkey::default\(\)/);
});
