import {createHash} from "node:crypto";
import {rpc} from "./supabase-rest";

export type RateLimitResult={allowed:boolean;remaining:number;resetAt:string};

function subjectFromRequest(req:Request):string{
  const real=req.headers.get("x-real-ip")?.trim();
  const forwarded=req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const raw=real||forwarded||"unknown";
  return createHash("sha256").update(raw).digest("hex");
}

export async function consumeRateLimit(req:Request,scope:string,limit?:number):Promise<RateLimitResult>{
  const configured=Number(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE??"60");
  const requested=limit??configured;
  const safeLimit=Number.isInteger(requested)&&requested>0&&requested<=10_000?requested:60;
  const rows=await rpc<Array<{allowed:boolean;remaining:number;reset_at:string}>>("launchpad_consume_rate_limit",{
    p_scope:scope,p_subject_hash:subjectFromRequest(req),p_limit:safeLimit,p_window_seconds:60
  });
  const row=rows[0];
  if(!row) throw new Error("rate_limit_result_missing");
  return {allowed:Boolean(row.allowed),remaining:Number(row.remaining),resetAt:String(row.reset_at)};
}
