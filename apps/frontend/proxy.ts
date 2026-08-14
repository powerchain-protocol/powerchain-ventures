import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIES = ["pc_auth_access", "pc_auth_refresh"];
const PROTECTED_PREFIXES = ["/dashboard", "/create", "/account"];
const MOBILE_USER_AGENT = /Android|iPhone|iPod|Mobile|IEMobile|Opera Mini/i;

function isMobileRequest(request: NextRequest): boolean {
  return MOBILE_USER_AGENT.test(request.headers.get("user-agent") ?? "");
}

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasSession = AUTH_COOKIES.some((name) => Boolean(request.cookies.get(name)?.value));

  if (
    pathname === "/" &&
    isMobileRequest(request) &&
    !request.cookies.get("pc_onboarding")?.value
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  if (isProtected(pathname) && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/create/:path*", "/account/:path*"],
};
