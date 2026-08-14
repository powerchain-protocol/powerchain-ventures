type RpcEnvelope<T>={result?:T;error?:{code?:number;message?:string}};
export type RpcAttempt={url:string;latencyMs:number;ok:boolean;error?:string};
function heliusRpcUrl(){
 const key=process.env.HELIUS_API_KEY?.trim();
 if(!key)return undefined;
 const base=process.env.HELIUS_RPC_URL?.trim()||"https://mainnet.helius-rpc.com/";
 try{
  const url=new URL(base);
  url.searchParams.set("api-key",key);
  return url.toString();
 }catch{throw new Error("HELIUS_RPC_URL must be a valid URL")}
}
function rpcIdentity(value:string){try{const u=new URL(value);u.search="";u.hash="";return `${u.origin}${u.pathname}`.replace(/\/$/,"")}catch{return value}}
function configuredUrls(){
 const values=[process.env.SOLANA_RPC_URL,heliusRpcUrl(),process.env.SOLANA_RPC_FALLBACK_URL,...(process.env.SOLANA_RPC_FALLBACK_URLS??"").split(",")]
  .map(v=>v?.trim()).filter((v):v is string=>Boolean(v));
 const byIdentity=new Map<string,string>();for(const value of values)if(!byIdentity.has(rpcIdentity(value)))byIdentity.set(rpcIdentity(value),value);return [...byIdentity.values()];
}
function safeRpcLabel(value:string){try{const u=new URL(value);if(u.searchParams.has("api-key"))u.searchParams.set("api-key","REDACTED");return u.toString()}catch{return "configured-rpc"}}
export function rpcEndpoints(){return configuredUrls().map((url,index)=>({url:safeRpcLabel(url),index,primary:index===0}))}
export async function solanaRpc<T>(method:string,params:unknown[]=[]):Promise<{result:T;endpoint:string;latencyMs:number;attempts:RpcAttempt[]}>{
 const urls=configuredUrls();if(!urls.length)throw new Error("SOLANA_RPC_URL not configured");const attempts:RpcAttempt[]=[];let last="rpc_unavailable";
 for(const url of urls){const started=Date.now();const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),8_000);try{
  const r=await fetch(url,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:crypto.randomUUID(),method,params}),signal:controller.signal,cache:"no-store"});
  const latencyMs=Date.now()-started;if(!r.ok){last=`RPC HTTP ${r.status}`;attempts.push({url:safeRpcLabel(url),latencyMs,ok:false,error:last});continue}
  const j=await r.json() as RpcEnvelope<T>;if(j.error){last=j.error.message??`RPC error ${j.error.code??"unknown"}`;attempts.push({url:safeRpcLabel(url),latencyMs,ok:false,error:last});continue}
  if(j.result===undefined){last="RPC response missing result";attempts.push({url:safeRpcLabel(url),latencyMs,ok:false,error:last});continue}
  attempts.push({url:safeRpcLabel(url),latencyMs,ok:true});return {result:j.result,endpoint:safeRpcLabel(url),latencyMs,attempts};
 }catch(e){const latencyMs=Date.now()-started;last=e instanceof Error?e.message:"RPC request failed";attempts.push({url:safeRpcLabel(url),latencyMs,ok:false,error:last})}finally{clearTimeout(timer)}}
 throw Object.assign(new Error(last),{attempts});
}
export async function rpcHealth(){
 try{const health=await solanaRpc<string>("getHealth");return {ok:health.result==="ok",endpoint:health.endpoint,latencyMs:health.latencyMs,attempts:health.attempts}}
 catch(e){return {ok:false,error:e instanceof Error?e.message:"RPC unavailable",attempts:(e as {attempts?:RpcAttempt[]})?.attempts??[]}}
}
