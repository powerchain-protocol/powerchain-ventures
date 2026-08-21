const cache=new Map<string,{expires:number;value:unknown}>();
export function getCached<T>(key:string):T|undefined{const item=cache.get(key);if(!item)return undefined;if(item.expires<Date.now()){cache.delete(key);return undefined}return item.value as T}
export function setCached<T>(key:string,value:T,ttlMs:number){cache.set(key,{value,expires:Date.now()+ttlMs})}
