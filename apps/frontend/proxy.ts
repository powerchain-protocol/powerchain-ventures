import {NextRequest,NextResponse} from "next/server";
const AUTH_COOKIES=["pc_auth_access","pc_auth_refresh"];
export function proxy(request:NextRequest){
 const hasSession=AUTH_COOKIES.some(name=>Boolean(request.cookies.get(name)?.value));
 const url=request.nextUrl.clone();
 if(request.nextUrl.pathname==="/"&&!request.cookies.get("pc_onboarding")?.value){url.pathname="/onboarding";return NextResponse.redirect(url)}
 if(!hasSession){url.pathname="/auth/sign-in";url.searchParams.set("next",request.nextUrl.pathname);return NextResponse.redirect(url)}
 return NextResponse.next();
}
export const config={matcher:["/","/dashboard/:path*","/create/:path*","/account/:path*"]};
