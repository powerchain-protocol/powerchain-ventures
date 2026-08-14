import {error,json,readJson,requestId} from "../../../../lib/http";
import {parsePositiveBigInt,quote} from "../../../../lib/policy";
export const runtime="nodejs";
type Body={usdMicros?:string;priceUsdMicros?:string;decimals?:number};
export async function POST(request:Request){const id=requestId(request);try{const body=await readJson<Body>(request);const usd=parsePositiveBigInt(body.usdMicros,"usdMicros");const price=parsePositiveBigInt(body.priceUsdMicros,"priceUsdMicros");const decimals=body.decimals??9;if(!Number.isInteger(decimals)||decimals<0||decimals>18)return error("BAD_REQUEST","invalid decimals",400);const result=quote(usd,price,decimals);const expiresAt=new Date(Date.now()+60_000).toISOString();return json({ok:true,requestId:id,quote:{...Object.fromEntries(Object.entries(result).map(([k,v])=>[k,v.toString()])),serviceFeeBps:250,expiresAt}});}catch(e){return error("BAD_REQUEST",e instanceof Error?e.message:"invalid request",400)}}
