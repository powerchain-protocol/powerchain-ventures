import { clearAuthCookies, readCookie, signOut, authCookieNames } from "../../../../../lib/auth";
import { json, requestId } from "../../../../../lib/http";
export async function POST(request:Request){const id=requestId(request);const access=readCookie(request,authCookieNames.access);await signOut(access);const headers=clearAuthCookies();return json({ok:true},{headers},id)}
