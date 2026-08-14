import {error} from "./http";
import {consumeRateLimit} from "./rate-limit";

export async function enforceRateLimit(req:Request,scope:string,limit?:number):Promise<Response|null>{
  const result=await consumeRateLimit(req,scope,limit);
  if(result.allowed)return null;
  const retry=Math.max(1,Math.ceil((Date.parse(result.resetAt)-Date.now())/1000));
  const response=error("RATE_LIMITED","Too many requests",429);
  response.headers.set("retry-after",String(retry));
  response.headers.set("x-ratelimit-remaining","0");
  response.headers.set("x-ratelimit-reset",result.resetAt);
  return response;
}
