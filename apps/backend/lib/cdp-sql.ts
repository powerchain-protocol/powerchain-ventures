import { generateJwt } from "@coinbase/cdp-sdk/auth";
import { PowerChainError } from "@powerchain/utils/utils/errors";
import { isSolanaAddress } from "./policy";

const CDP_HOST = "api.cdp.coinbase.com";
const CDP_PATH = "/platform/v2/data/query/run";
const CDP_URL = `https://${CDP_HOST}${CDP_PATH}`;
export const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
export const TOKEN_2022_PROGRAM_ID = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";

export type CdpSqlMetadata = { cached?: boolean; executionTimestamp?: string; executionTimeMs?: number; rowCount?: number };
export type CdpSqlResult<T> = { result: T[]; schema?: { columns?: Array<{name:string;type:string}> }; metadata?: CdpSqlMetadata };

function env(name:string){return (process.env[name]??"").trim()}
export function cdpSqlConfigured(){return Boolean(env("CDP_API_KEY_ID") && env("CDP_API_KEY_SECRET"))}
export function cdpSqlRequired(){return /^(1|true|yes)$/i.test(env("CDP_SQL_REQUIRED"))}

async function bearerToken(){
 const apiKeyId=env("CDP_API_KEY_ID"), apiKeySecret=env("CDP_API_KEY_SECRET");
 if(!apiKeyId||!apiKeySecret) throw new PowerChainError("CONFIGURATION_ERROR","Coinbase CDP SQL API is not configured");
 return generateJwt({apiKeyId,apiKeySecret,requestMethod:"POST",requestHost:CDP_HOST,requestPath:CDP_PATH,expiresIn:120});
}

export async function runCdpSql<T extends Record<string,unknown>>(sql:string,maxAgeMs=5000):Promise<CdpSqlResult<T>>{
 if(!/^\s*select\b/i.test(sql)) throw new PowerChainError("BAD_REQUEST","CDP SQL integration only permits SELECT queries");
 if(sql.length>10_000) throw new PowerChainError("BAD_REQUEST","CDP SQL query is too long");
 const token=await bearerToken();
 const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),12_000);
 try{
  const response=await fetch(CDP_URL,{method:"POST",headers:{authorization:`Bearer ${token}`,"content-type":"application/json"},body:JSON.stringify({sql,cache:{maxAgeMs:Math.max(750,Math.min(900_000,maxAgeMs))}}),signal:controller.signal,cache:"no-store"});
  const body=await response.json().catch(()=>({})) as CdpSqlResult<T>&{error?:unknown;message?:string};
  if(!response.ok) throw new PowerChainError("RPC_UNAVAILABLE",body.message||`CDP SQL API returned HTTP ${response.status}`,{details:{status:response.status}});
  if(!Array.isArray(body.result)) throw new PowerChainError("RPC_UNAVAILABLE","CDP SQL API returned an invalid result");
  return body;
 }catch(error){
  if(error instanceof PowerChainError) throw error;
  throw new PowerChainError("RPC_UNAVAILABLE",error instanceof Error?`CDP SQL API unavailable: ${error.message}`:"CDP SQL API unavailable",{cause:error});
 }finally{clearTimeout(timer)}
}

function address(value:string,label:string){const v=value.trim();if(!isSolanaAddress(v))throw new PowerChainError("BAD_REQUEST",`${label} must be a valid Solana address`);return v}
function boundedInt(value:string|null,fallback:number,min:number,max:number){const n=value?Number(value):fallback;return Number.isInteger(n)&&n>=min&&n<=max?n:fallback}
export function analyticsBounds(url:URL){return {days:boundedInt(url.searchParams.get("days"),7,1,90),limit:boundedInt(url.searchParams.get("limit"),100,1,500)}}

export function mintTransfersSql(mintValue:string,days:number,limit:number){const mint=address(mintValue,"mint");return `SELECT block_time, tx_id, instruction_id, source, destination, source_owner, destination_owner, amount FROM solana.transfers WHERE mint = '${mint}' AND block_time >= now() - INTERVAL ${days} DAY AND action = 1 ORDER BY block_time DESC LIMIT ${limit}`}
export function mintVolumeSql(mintValue:string,days:number){const mint=address(mintValue,"mint");return `SELECT toDate(block_time) AS day, count() AS transfer_count, sum(amount) AS volume_base_units FROM solana.transfers WHERE mint = '${mint}' AND block_time >= now() - INTERVAL ${days} DAY AND action = 1 GROUP BY day ORDER BY day DESC`}
export function walletTransfersSql(walletValue:string,days:number,limit:number){const wallet=address(walletValue,"wallet");return `SELECT block_time, tx_id, instruction_id, mint, source_owner, destination_owner, amount FROM solana.transfers WHERE (source_owner = '${wallet}' OR destination_owner = '${wallet}') AND block_time >= now() - INTERVAL ${days} DAY AND action = 1 ORDER BY block_time DESC LIMIT ${limit}`}
export function tokenInstructionsSql(programValue:string,days:number,limit:number,instruction="transferChecked"){
 const program=programValue==="token"?TOKEN_PROGRAM_ID:programValue==="token-2022"?TOKEN_2022_PROGRAM_ID:address(programValue,"program");
 const allowed=new Set(["transfer","transferChecked","mintTo","mintToChecked","burn","burnChecked","initializeAccount","initializeMint","closeAccount"]);if(!allowed.has(instruction))throw new PowerChainError("BAD_REQUEST","Unsupported instruction filter");
 return `SELECT block_time, tx_id, instruction_id, instruction_name, executing_account, accounts, account_owners, args FROM solana.instructions WHERE executing_account = '${program}' AND instruction_name = '${instruction}' AND block_time >= now() - INTERVAL ${days} DAY AND action = 1 ORDER BY block_time DESC LIMIT ${limit}`
}
export function transferContextSql(mintValue:string,days:number,limit:number){const mint=address(mintValue,"mint");return `SELECT t.block_time, t.tx_id, t.instruction_id, t.mint, t.source_owner, t.destination_owner, t.amount, i.instruction_name, i.executing_account, i.accounts, i.args FROM solana.transfers AS t JOIN solana.instructions AS i ON t.instruction_id = i.instruction_id WHERE t.mint = '${mint}' AND t.block_time >= now() - INTERVAL ${days} DAY AND t.action = 1 AND i.action = 1 ORDER BY t.block_time DESC LIMIT ${limit}`}
