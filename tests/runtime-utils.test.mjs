import test from 'node:test';
import assert from 'node:assert/strict';
import { parseRetryAfterMs, retryDelayMs } from '../packages/utils/dist/http.js';
import { isUsableSolanaWalletAddress, requireUsableSolanaWalletAddress } from '../packages/utils/dist/helpers.js';
import { getServerRuntimeConfig } from '../packages/config/dist/runtime.js';
import { getDeploymentReadiness } from '../packages/config/dist/deployment.js';

test('retry-after seconds are bounded and parsed in milliseconds', () => {
  assert.equal(parseRetryAfterMs('2', 0), 2000);
  assert.equal(parseRetryAfterMs('9999', 0), 120000);
  assert.equal(parseRetryAfterMs('nope', 0), null);
  assert.ok(retryDelayMs(2) >= 1000);
});

test('mainnet server runtime config requires RPC redundancy', () => {
  const env = {
    NODE_ENV: 'production', NEXT_PUBLIC_APP_URL: 'https://launchpad.example', BACKEND_ORIGIN: 'https://api.example',
    NEXT_PUBLIC_SOLANA_CLUSTER: 'mainnet-beta', NEXT_PUBLIC_SOLANA_RPC_URL: 'https://browser-rpc.example', SOLANA_RPC_URL: 'https://rpc.example', SUPABASE_URL: 'https://db.example',
    POWERCHAIN_TREASURY_WALLET: 'FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy', POWERCHAIN_QUOTE_AUTHORITY_WALLET: 'FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy', POWERCHAIN_LAUNCHPAD_PROGRAM_ID: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb', POWERCHAIN_TRANSACTION_BUILDER_URL: 'https://builder.example',
    ALLOWED_ORIGINS: 'https://launchpad.example'
  };
  assert.throws(() => getServerRuntimeConfig(env), /at least two/);
  assert.equal(getServerRuntimeConfig({...env, SOLANA_RPC_FALLBACK_URL:'https://rpc2.example'}).rpcUrls.length, 2);
  assert.equal(getServerRuntimeConfig({...env, HELIUS_API_KEY:'helius-secret', HELIUS_RPC_URL:'https://mainnet.helius-rpc.com/'}).rpcUrls.length, 2);
  assert.throws(() => getServerRuntimeConfig({...env, SOLANA_RPC_URL:'https://mainnet.helius-rpc.com/?api-key=first', HELIUS_API_KEY:'second', HELIUS_RPC_URL:'https://mainnet.helius-rpc.com/'}), /at least two/);
});


test('mainnet deployment readiness requires real deployment addresses and rejects System Program treasury', () => {
  const base = {
    NEXT_PUBLIC_SOLANA_CLUSTER: 'mainnet-beta',
    SOLANA_RPC_URL: 'https://rpc-a.example',
    SOLANA_RPC_FALLBACK_URL: 'https://rpc-b.example',
    POWERCHAIN_TRANSACTION_BUILDER_URL: 'https://builder.example',
    POWERCHAIN_TRANSACTION_BUILDER_API_KEY: 'x'.repeat(32),
    SUPABASE_URL: 'https://db.example',
    SUPABASE_SERVICE_ROLE_KEY: 'x'.repeat(32),
    POWERCHAIN_PRESALE_MINT: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
    POWERCHAIN_PRESALE_VAULT_TOKEN_ACCOUNT: 'airGefMqLgmzgTim1p8LXWDhHqWFJ3DSVpbHgZ1WyrZ',
    POWERCHAIN_PRESALE_VAULT_AUTHORITY: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    POWERCHAIN_QUOTE_AUTHORITY_WALLET: 'FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy',
  };
  const missing = getDeploymentReadiness(base);
  assert.equal(missing.configured, false);
  assert.equal(missing.treasuryConfigured, true);
  assert.ok(missing.missing.includes('POWERCHAIN_LAUNCHPAD_PROGRAM_ID'));

  const invalid = getDeploymentReadiness({...base, POWERCHAIN_TREASURY_WALLET:'11111111111111111111111111111111'});
  assert.equal(invalid.configured, false);
  assert.ok(invalid.invalid.some(v => v.includes('system_program_is_not_a_treasury')));
});


test('wallet helper rejects System Program placeholder as an operational wallet', () => {
  assert.equal(isUsableSolanaWalletAddress('11111111111111111111111111111111'), false);
  assert.equal(isUsableSolanaWalletAddress('airGefMqLgmzgTim1p8LXWDhHqWFJ3DSVpbHgZ1WyrZ'), true);
  assert.throws(() => requireUsableSolanaWalletAddress('11111111111111111111111111111111', 'treasury'), /configured Solana wallet/);
});
