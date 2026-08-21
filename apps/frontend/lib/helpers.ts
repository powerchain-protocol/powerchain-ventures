export async function safeJson<T>(response:Response):Promise<T|null>{try{return await response.json() as T}catch{return null}}
export function absoluteApiPath(base:string,path:string){return `${base.replace(/\/$/,"")}/${path.replace(/^\//,"")}`}
