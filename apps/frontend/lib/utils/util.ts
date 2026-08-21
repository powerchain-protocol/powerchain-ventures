export function clamp(value:number,min:number,max:number){return Math.min(max,Math.max(min,value))}
export function toSlug(value:string){return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
export function noop(){return undefined}
