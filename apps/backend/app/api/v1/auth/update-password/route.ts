import { resolveSession, updatePassword } from "../../../../../lib/auth";
import { errorFromUnknown, json, readJson, requestId } from "../../../../../lib/http";
import { validatePassword } from "../../../../../lib/validate";
export async function POST(request:Request){const id=requestId(request);try{const session=await resolveSession(request);if(!session.authenticated||!session.accessToken)return json({ok:false,error:{code:"UNAUTHORIZED",message:"Sign in again before changing your password"}},{status:401,headers:session.headers},id);const body=await readJson<{password?:string}>(request);await updatePassword(session.accessToken,validatePassword(body.password));return json({ok:true,message:"Password updated."},{headers:session.headers},id)}catch(error){return errorFromUnknown(error,id)}}
