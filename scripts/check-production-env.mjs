const env=process.env;
const errors=[];
const sol=/^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

const required=(name)=>{
  const value=env[name]?.trim();
  if(!value) errors.push(`${name} is required`);
  return value??'';
};
const url=(name,{https=true}={})=>{
  const value=required(name);
  if(!value)return;
  try{
    const parsed=new URL(value);
    if(!['http:','https:'].includes(parsed.protocol))errors.push(`${name} must use http or https`);
    if(https&&env.NODE_ENV==='production'&&parsed.protocol!=='https:')errors.push(`${name} must use https in production`);
  }catch{errors.push(`${name} must be a valid URL`)}
};
const positiveInt=(name,{min=1,max=Number.MAX_SAFE_INTEGER}={})=>{
  const raw=required(name);
  if(!raw)return;
  if(!/^\d+$/.test(raw)){errors.push(`${name} must be an integer`);return;}
  const value=Number(raw);
  if(!Number.isSafeInteger(value)||value<min||value>max)errors.push(`${name} must be between ${min} and ${max}`);
};
const positiveDecimal=(name,{requiredValue=true}={})=>{
  const raw=env[name]?.trim()??'';
  if(!raw){if(requiredValue)errors.push(`${name} is required`);return null;}
  if(!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(raw)){errors.push(`${name} must be a positive decimal`);return null;}
  const value=Number(raw);
  if(!Number.isFinite(value)||value<=0){errors.push(`${name} must be greater than zero`);return null;}
  return value;
};
const isoDate=(name,{requiredValue=false}={})=>{
  const raw=env[name]?.trim()??'';
  if(!raw){if(requiredValue)errors.push(`${name} is required`);return null;}
  const value=Date.parse(raw);
  if(!Number.isFinite(value))errors.push(`${name} must be an ISO-8601 date/time`);
  return Number.isFinite(value)?value:null;
};

if((env.NODE_ENV??'production')!=='production')errors.push('NODE_ENV must be production for this preflight');
url('NEXT_PUBLIC_APP_URL');
url('NEXT_PUBLIC_CHECKOUT_URL');
url('NEXT_PUBLIC_SOLANA_RPC_URL');
url('SOLANA_RPC_URL');
url('SUPABASE_URL');
url('POWERCHAIN_TRANSACTION_BUILDER_URL');
url('BACKEND_ORIGIN');

const canonicalFeeWallet='FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy';
if((env.POWERCHAIN_TREASURY_WALLET??canonicalFeeWallet).trim()!==canonicalFeeWallet)errors.push('POWERCHAIN_TREASURY_WALLET must equal the canonical PowerChain fee wallet');
if((env.POWERCHAIN_TREASURY_WALLET??canonicalFeeWallet).trim()==='11111111111111111111111111111111')errors.push('POWERCHAIN_TREASURY_WALLET must not be the Solana System Program');
if((env.SUPABASE_SERVICE_ROLE_KEY??'').length<20)errors.push('SUPABASE_SERVICE_ROLE_KEY is missing or too short');
if((env.POWERCHAIN_TRANSACTION_BUILDER_API_KEY??'').length<20)errors.push('POWERCHAIN_TRANSACTION_BUILDER_API_KEY is missing or too short');

const reconciliationSecret=env.CRON_SECRET||env.RECONCILIATION_SECRET||'';
if(reconciliationSecret.length<32)errors.push('CRON_SECRET or RECONCILIATION_SECRET must be at least 32 characters');
if(!(env.ALLOWED_ORIGINS??'').trim())errors.push('ALLOWED_ORIGINS is required');
const allowedOrigins=new Set((env.ALLOWED_ORIGINS??'').split(',').map(v=>v.trim()).filter(Boolean).map(v=>{try{return new URL(v).origin}catch{return v}}));
for(const [name,value] of [["NEXT_PUBLIC_APP_URL",env.NEXT_PUBLIC_APP_URL],["NEXT_PUBLIC_CHECKOUT_URL",env.NEXT_PUBLIC_CHECKOUT_URL]]) {
  if(value){try{if(!allowedOrigins.has(new URL(value).origin))errors.push(`ALLOWED_ORIGINS must include ${name}`)}catch{}}
}
if(env.VERCEL==='1'&&(env.BACKEND_ORIGIN??'').includes('localhost'))errors.push('BACKEND_ORIGIN must not point to localhost on Vercel');

const cluster=env.NEXT_PUBLIC_SOLANA_CLUSTER;
if(!['devnet','mainnet-beta'].includes(cluster??''))errors.push('NEXT_PUBLIC_SOLANA_CLUSTER must be devnet or mainnet-beta');
if(cluster==='mainnet-beta'&&!sol.test(env.POWERCHAIN_LAUNCHPAD_PROGRAM_ID??''))errors.push('POWERCHAIN_LAUNCHPAD_PROGRAM_ID must be the real deployed Solana program address');
const heliusRpc=env.HELIUS_API_KEY?.trim()?(env.HELIUS_RPC_URL?.trim()||'https://mainnet.helius-rpc.com/'):undefined;
const rpcIdentity=(value)=>{try{const u=new URL(value);u.search='';u.hash='';return `${u.origin}${u.pathname}`.replace(/\/$/,'')}catch{return value}};
const rpcMap=new Map();for(const value of [env.SOLANA_RPC_URL,heliusRpc,env.SOLANA_RPC_FALLBACK_URL,...(env.SOLANA_RPC_FALLBACK_URLS??'').split(',')].map(v=>v?.trim()).filter(Boolean)){const id=rpcIdentity(value);if(!rpcMap.has(id))rpcMap.set(id,value)}
const rpcUrls=[...rpcMap.values()];
for(const rpc of rpcUrls){try{const u=new URL(rpc);if(env.NODE_ENV==='production'&&u.protocol!=='https:')errors.push('all server-side Solana RPC endpoints must use https in production')}catch{errors.push(`invalid Solana RPC endpoint: ${rpc}`)}}
if(cluster==='mainnet-beta'&&rpcUrls.length<2)errors.push('mainnet-beta requires at least two server-side Solana RPC endpoints');
const sharedMainnetHosts=new Set(['api.mainnet.solana.com','api.mainnet-beta.solana.com']);
if(cluster==='mainnet-beta'&&rpcUrls.some(v=>{try{return sharedMainnetHosts.has(new URL(v).hostname)}catch{return false}}))errors.push('mainnet-beta production must use dedicated server-side RPC endpoints');
if(cluster==='mainnet-beta'){try{if(sharedMainnetHosts.has(new URL(env.NEXT_PUBLIC_SOLANA_RPC_URL??'').hostname))errors.push('NEXT_PUBLIC_SOLANA_RPC_URL must use a dedicated browser-safe RPC endpoint on mainnet')}catch{}}

positiveInt('RATE_LIMIT_REQUESTS_PER_MINUTE',{min:1,max:10000});
positiveInt('QUOTE_TTL_SECONDS',{min:15,max:900});
positiveDecimal('POWERCHAIN_PRESALE_ALLOCATION_TOKENS');
const price=positiveDecimal('POWERCHAIN_PRESALE_PRICE_USD');
const minPurchase=positiveDecimal('POWERCHAIN_PRESALE_MIN_PURCHASE_USD');
const maxPurchase=positiveDecimal('POWERCHAIN_PRESALE_MAX_PURCHASE_USD');
if(minPurchase!==null&&maxPurchase!==null&&minPurchase>maxPurchase)errors.push('POWERCHAIN_PRESALE_MIN_PURCHASE_USD must be <= POWERCHAIN_PRESALE_MAX_PURCHASE_USD');
if(price!==null&&price>1_000_000)errors.push('POWERCHAIN_PRESALE_PRICE_USD is implausibly large');

const startsAt=isoDate('POWERCHAIN_PRESALE_STARTS_AT',{requiredValue:true});
const endsAt=isoDate('POWERCHAIN_PRESALE_ENDS_AT',{requiredValue:true});
const claimStartsAt=isoDate('POWERCHAIN_PRESALE_CLAIM_STARTS_AT',{requiredValue:true});
if(startsAt!==null&&endsAt!==null&&startsAt>=endsAt)errors.push('POWERCHAIN_PRESALE_STARTS_AT must be before POWERCHAIN_PRESALE_ENDS_AT');
if(endsAt!==null&&claimStartsAt!==null&&claimStartsAt<endsAt)errors.push('POWERCHAIN_PRESALE_CLAIM_STARTS_AT must be >= POWERCHAIN_PRESALE_ENDS_AT');

for(const name of ['POWERCHAIN_PRESALE_MINT','POWERCHAIN_PRESALE_VAULT_TOKEN_ACCOUNT','POWERCHAIN_PRESALE_VAULT_AUTHORITY','POWERCHAIN_QUOTE_AUTHORITY_WALLET']){
  const value=env[name]?.trim();
  if(cluster==='mainnet-beta'&&!value)errors.push(`${name} is required for mainnet production`);
  if(value&&!sol.test(value))errors.push(`${name} must be a valid Solana address when configured`);
}




if((env.POWERCHAIN_RUNTIME_PERSISTENCE??"").trim()!=="database"){
  errors.push("POWERCHAIN_RUNTIME_PERSISTENCE must be database in production");
}

for(const [name,min,max] of [
  ["SETTLEMENT_WORKER_BATCH_SIZE",1,500],
  ["SETTLEMENT_OUTBOX_FAILED_TOLERANCE",0,1000],
  ["SETTLEMENT_OUTBOX_MAX_PENDING_AGE_MS",30000,3600000],
]){
  const raw=(env[name]??"").trim();
  if(!raw)continue;
  const value=Number(raw);
  if(!Number.isInteger(value)||value<min||value>max){
    errors.push(`${name} must be an integer between ${min} and ${max}`);
  }
}

const quoteKeypairRaw=env.POWERCHAIN_QUOTE_AUTHORITY_KEYPAIR_JSON?.trim()??'';
if(!quoteKeypairRaw){
  errors.push('POWERCHAIN_QUOTE_AUTHORITY_KEYPAIR_JSON is required for purchase construction');
}else{
  try{
    const key=JSON.parse(quoteKeypairRaw);
    if(!Array.isArray(key)||key.length!==64||key.some(v=>!Number.isInteger(v)||v<0||v>255))errors.push('POWERCHAIN_QUOTE_AUTHORITY_KEYPAIR_JSON must be a JSON array of exactly 64 byte values');
  }catch{
    errors.push('POWERCHAIN_QUOTE_AUTHORITY_KEYPAIR_JSON must be valid JSON');
  }
}

const pythFeed=env.PYTH_SOL_USD_FEED_ID?.trim()??'';
const pythKey=env.PYTH_API_KEY?.trim()??'';
if(Boolean(pythFeed)!==Boolean(pythKey))errors.push('PYTH_SOL_USD_FEED_ID and PYTH_API_KEY must be configured together');
if(pythFeed&&!/^(?:0x)?[0-9a-fA-F]{64}$/.test(pythFeed))errors.push('PYTH_SOL_USD_FEED_ID must be a 32-byte hex feed ID');
const birdeyeKey=env.BIRDEYE_API_KEY?.trim()??'';
const cmcKey=env.COINMARKETCAP_API_KEY?.trim()??'';
if(!((pythFeed&&pythKey)||birdeyeKey||cmcKey))errors.push('At least one SOL/USD market source must be configured: Pyth, Birdeye or CoinMarketCap');
if(pythKey&&pythKey.length<8)errors.push('PYTH_API_KEY appears too short');
if(cmcKey&&cmcKey.length<8)errors.push('COINMARKETCAP_API_KEY appears too short');

if(env.HELIUS_API_KEY&&env.HELIUS_API_KEY.trim().length<8)errors.push('HELIUS_API_KEY appears too short');
if(env.HELIUS_RPC_URL){try{const u=new URL(env.HELIUS_RPC_URL);if(env.NODE_ENV==='production'&&u.protocol!=='https:')errors.push('HELIUS_RPC_URL must use https in production')}catch{errors.push('HELIUS_RPC_URL must be a valid URL')}}
if(env.BIRDEYE_API_KEY&&env.BIRDEYE_API_KEY.trim().length<8)errors.push('BIRDEYE_API_KEY appears too short');
if(env.BIRDEYE_BASE_URL){try{const u=new URL(env.BIRDEYE_BASE_URL);if(env.NODE_ENV==='production'&&u.protocol!=='https:')errors.push('BIRDEYE_BASE_URL must use https in production')}catch{errors.push('BIRDEYE_BASE_URL must be a valid URL')}}
if(env.DATABASE_URL){try{const u=new URL(env.DATABASE_URL);if(!['postgres:','postgresql:'].includes(u.protocol))errors.push('DATABASE_URL must use postgresql:// or postgres://')}catch{errors.push('DATABASE_URL must be a valid PostgreSQL URL')}}

const cdpId=env.CDP_API_KEY_ID?.trim()??'';
const cdpSecret=env.CDP_API_KEY_SECRET?.trim()??'';
if(Boolean(cdpId)!==Boolean(cdpSecret))errors.push('CDP_API_KEY_ID and CDP_API_KEY_SECRET must be configured together');
if(env.CDP_SQL_REQUIRED==='true'&&(!cdpId||!cdpSecret))errors.push('CDP_SQL_REQUIRED=true requires CDP_API_KEY_ID and CDP_API_KEY_SECRET');
if(env.CDP_SQL_REQUIRED&&!['true','false'].includes(env.CDP_SQL_REQUIRED))errors.push('CDP_SQL_REQUIRED must be true or false');
const cdpOnrampEnabled=env.CDP_ONRAMP_ENABLED==='true';
if(env.CDP_ONRAMP_ENABLED&&!['true','false'].includes(env.CDP_ONRAMP_ENABLED))errors.push('CDP_ONRAMP_ENABLED must be true or false');
if(cdpOnrampEnabled&&(!cdpId||!cdpSecret))errors.push('CDP_ONRAMP_ENABLED=true requires CDP_API_KEY_ID and CDP_API_KEY_SECRET');
if(cdpOnrampEnabled){try{const u=new URL(env.CDP_ONRAMP_REDIRECT_URL||'');if(u.protocol!=='https:')errors.push('CDP_ONRAMP_REDIRECT_URL must use HTTPS in production')}catch{errors.push('CDP_ONRAMP_REDIRECT_URL must be an absolute URL when Onramp is enabled')}}

if(errors.length){console.error(JSON.stringify({ok:false,errors},null,2));process.exit(1)}
console.log(JSON.stringify({
  ok:true,
  cluster,
  appUrl:env.NEXT_PUBLIC_APP_URL,
  checkoutUrl:env.NEXT_PUBLIC_CHECKOUT_URL,
  rpcEndpoints:rpcUrls.length,
  rpcFallbacks:Math.max(0,rpcUrls.length-1),
  presaleAllocationTokens:env.POWERCHAIN_PRESALE_ALLOCATION_TOKENS,
  cdpSqlRequired:env.CDP_SQL_REQUIRED==='true'
},null,2));
