export function formatUnits(value:string|bigint,decimals:number,maxFraction=6){
 const raw=typeof value==="bigint"?value:BigInt(value||"0");const scale=10n**BigInt(decimals);const whole=raw/scale;const remainder=raw%scale;
 if(!remainder||maxFraction<=0)return whole.toLocaleString("en-US");
 const fraction=remainder.toString().padStart(decimals,"0").slice(0,Math.min(decimals,maxFraction)).replace(/0+$/g,"");
 return fraction?`${whole.toLocaleString("en-US")}.${fraction}`:whole.toLocaleString("en-US");
}
export function formatUsdMicros(value:string|bigint){
 const raw=typeof value==="bigint"?value:BigInt(value||"0");const whole=raw/1_000_000n;const cents=(raw%1_000_000n)/10_000n;
 return `$${whole.toLocaleString("en-US")}.${cents.toString().padStart(2,"0")}`;
}
export function parseUsdToMicros(value:string){
 if(!/^\d+(?:\.\d{0,6})?$/.test(value.trim()))return null;const [whole,fraction=""]=value.trim().split(".");
 return BigInt(whole)*1_000_000n+BigInt((fraction+"000000").slice(0,6));
}
export function shortAddress(value:string){return value.length>18?`${value.slice(0,8)}…${value.slice(-8)}`:value}
export function parseUnits(value:string,decimals:number){const clean=value.trim();if(!/^\d+(?:\.\d+)?$/.test(clean))return null;const [whole,fraction=""]=clean.split(".");if(fraction.length>decimals)return null;return BigInt(whole)*10n**BigInt(decimals)+BigInt((fraction+"0".repeat(decimals)).slice(0,decimals)||"0")}
export function formatUsdNumber(value:number|null|undefined){if(value==null||!Number.isFinite(value))return "—";return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:value<1?6:2}).format(value)}
