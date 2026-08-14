const url=()=>process.env.SUPABASE_URL?.replace(/\/$/,"");
const key=()=>process.env.SUPABASE_SERVICE_ROLE_KEY;
export function databaseConfigured(){return Boolean(url()&&key())}
async function request<T>(path:string,init:RequestInit={}):Promise<T>{const base=url(),token=key();if(!base||!token)throw new Error("database_not_configured");const headers=new Headers(init.headers);headers.set("apikey",token);headers.set("authorization",`Bearer ${token}`);headers.set("content-type","application/json");const r=await fetch(`${base}/rest/v1/${path}`,{...init,headers,cache:"no-store"});const text=await r.text();if(!r.ok)throw new Error(`database_${r.status}:${text.slice(0,300)}`);return (text?JSON.parse(text):null) as T}
export function select<T>(table:string,query:string){return request<T[]>(`${table}?${query}`)}
export function insert<T>(table:string,body:unknown){return request<T[]>(table,{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify(body)})}
export function patch<T>(table:string,query:string,body:unknown){return request<T[]>(`${table}?${query}`,{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify(body)})}

export function rpc<T>(fn:string,body:unknown){return request<T>(`rpc/${fn}`,{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify(body)})}
