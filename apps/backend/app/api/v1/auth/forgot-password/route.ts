import { authEnabled, requestPasswordReset } from "../../../../../lib/auth";
import { errorFromUnknown, json, readJson, requestId } from "../../../../../lib/http";
import { enforceRateLimit } from "../../../../../lib/rate-limit-response";
import { validateEmail } from "../../../../../lib/validate";
export async function POST(request:Request){const id=requestId(request);try{if(!authEnabled())return json({ok:false,error:{code:"CONFIGURATION_ERROR",message:"Account authentication is not configured"}},{status:503},id);const limited=await enforceRateLimit(request,"auth-password-reset",5);if(limited)return limited;const body=await readJson<{email?:string}>(request);await requestPasswordReset(validateEmail(body.email));return json({ok:true,message:"If an account exists, a recovery email has been sent."},{},id)}catch(error){return errorFromUnknown(error,id)}}
