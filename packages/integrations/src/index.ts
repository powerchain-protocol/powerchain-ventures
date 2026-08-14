export const HELIUS_MAINNET_RPC_BASE = "https://mainnet.helius-rpc.com/" as const;
export const HELIUS_API_BASE = "https://api.helius.xyz" as const;
export const BIRDEYE_API_BASE = "https://public-api.birdeye.so" as const;

export type FetchLike = typeof fetch;
export type IntegrationRequestOptions = { fetcher?: FetchLike; timeoutMs?: number };

async function fetchJson<T>(url:string, init:RequestInit, options:IntegrationRequestOptions={}):Promise<T>{
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),options.timeoutMs??8000);
  try{const r=await (options.fetcher??fetch)(url,{...init,signal:controller.signal,cache:"no-store"}); const text=await r.text(); if(!r.ok)throw new Error(`integration_http_${r.status}:${text.slice(0,200)}`); return JSON.parse(text) as T}finally{clearTimeout(timer)}
}

export function heliusRpcUrl(apiKey:string,base:string=HELIUS_MAINNET_RPC_BASE){if(!apiKey.trim())throw new Error("helius_api_key_required");const u=new URL(base);u.searchParams.set("api-key",apiKey.trim());return u.toString()}
export async function heliusRpc<T>(input:{apiKey:string;method:string;params?:unknown[];rpcBase?:string},options:IntegrationRequestOptions={}){
  const body={jsonrpc:"2.0",id:crypto.randomUUID(),method:input.method,params:input.params??[]};
  const result=await fetchJson<{result?:T;error?:{code:number;message:string}}>(heliusRpcUrl(input.apiKey,input.rpcBase),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)},options);
  if(result.error)throw new Error(`helius_rpc_${result.error.code}:${result.error.message}`); if(result.result===undefined)throw new Error("helius_rpc_missing_result"); return result.result;
}
export function birdeyeHeaders(apiKey:string){if(!apiKey.trim())throw new Error("birdeye_api_key_required");return {accept:"application/json","X-API-KEY":apiKey.trim(),"x-chain":"solana"}}
export async function birdeyePrice(input:{apiKey:string;mint:string;baseUrl?:string},options:IntegrationRequestOptions={}){
  const u=new URL("/defi/price",input.baseUrl??BIRDEYE_API_BASE);u.searchParams.set("address",input.mint);u.searchParams.set("include_liquidity","true");
  return fetchJson<{success?:boolean;data?:{value?:number;updateUnixTime?:number;liquidity?:number}|null}>(u.toString(),{headers:birdeyeHeaders(input.apiKey)},options);
}
export async function birdeyeTokenOverview(input:{apiKey:string;mint:string;baseUrl?:string},options:IntegrationRequestOptions={}){
  const u=new URL("/defi/token_overview",input.baseUrl??BIRDEYE_API_BASE);u.searchParams.set("address",input.mint);u.searchParams.set("frames","1h,24h");u.searchParams.set("ui_amount_mode","raw");
  return fetchJson<{success?:boolean;data?:Record<string,unknown>|null}>(u.toString(),{headers:birdeyeHeaders(input.apiKey)},options);
}
