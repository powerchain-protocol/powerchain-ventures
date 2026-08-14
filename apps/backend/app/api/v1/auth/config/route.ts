import { authEnabled } from "../../../../../lib/auth";
import { json } from "../../../../../lib/http";
export async function GET(){return json({ok:true,auth:{enabled:authEnabled(),provider:"Supabase Auth",methods:["email-password"],walletConnectionSeparate:true}})}
