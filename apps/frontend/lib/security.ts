export function isBrowserSafeRpcUrl(value:string){try{const url=new URL(value);return (url.protocol==="https:"||url.protocol==="http:")&&!url.searchParams.has("api-key")&&!url.searchParams.has("token")}catch{return false}}
export function isSafeReturnPath(value:string|null){return Boolean(value&&value.startsWith("/")&&!value.startsWith("//"))}
