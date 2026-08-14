import { PowerChainError } from "@powerchain/utils/utils/errors";

const ACCESS_COOKIE = "pc_auth_access";
const REFRESH_COOKIE = "pc_auth_refresh";
const secure = () => process.env.NODE_ENV === "production";

export type PowerChainAuthUser = {
  id: string;
  email: string | null;
  displayName: string | null;
  createdAt: string | null;
  emailConfirmedAt: string | null;
};

type SupabaseUser = {
  id?: string;
  email?: string;
  created_at?: string;
  email_confirmed_at?: string;
  user_metadata?: Record<string, unknown>;
};

type SupabaseSession = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: SupabaseUser | null;
};

function authBase() {
  const value = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "");
  if (!value) throw new PowerChainError("CONFIGURATION_ERROR", "SUPABASE_URL is not configured");
  return value;
}

function anonKey() {
  const value = process.env.SUPABASE_PUBLISHABLE_KEY?.trim() || process.env.SUPABASE_ANON_KEY?.trim();
  if (!value) throw new PowerChainError("CONFIGURATION_ERROR", "SUPABASE_PUBLISHABLE_KEY is not configured");
  return value;
}

export function authEnabled() {
  return process.env.POWERCHAIN_AUTH_ENABLED !== "false" && Boolean(process.env.SUPABASE_URL?.trim() && (process.env.SUPABASE_PUBLISHABLE_KEY?.trim() || process.env.SUPABASE_ANON_KEY?.trim()));
}

export function authRedirectUrl() {
  const explicit = process.env.POWERCHAIN_AUTH_REDIRECT_URL?.trim();
  if (explicit) return explicit;
  const app = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/+$/, "");
  return app ? `${app}/auth/callback` : undefined;
}

function headers(token?: string) {
  const result = new Headers({ apikey: anonKey(), "content-type": "application/json" });
  if (token) result.set("authorization", `Bearer ${token}`);
  return result;
}

async function authRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const requestHeaders = headers();
  new Headers(init.headers).forEach((value, name) => requestHeaders.set(name, value));
  const response = await fetch(`${authBase()}/auth/v1/${path}`, { ...init, headers: requestHeaders, cache: "no-store" });
  const text = await response.text();
  const data = text ? JSON.parse(text) as T & { message?: string; error_description?: string; msg?: string } : {} as T;
  if (!response.ok) {
    const message = (data as { message?: string; error_description?: string; msg?: string }).msg || (data as { message?: string }).message || (data as { error_description?: string }).error_description || "Authentication request failed";
    const code = response.status === 400 || response.status === 422 ? "BAD_REQUEST" : response.status === 401 ? "UNAUTHORIZED" : "INTERNAL_ERROR";
    throw new PowerChainError(code, message);
  }
  return data;
}

function serializeCookie(name: string, value: string, maxAge: number) {
  const parts = [`${name}=${encodeURIComponent(value)}`, "Path=/", "HttpOnly", "SameSite=Lax", `Max-Age=${Math.max(0, Math.floor(maxAge))}`];
  if (secure()) parts.push("Secure");
  return parts.join("; ");
}

export function clearAuthCookies(headers = new Headers()) {
  headers.append("set-cookie", serializeCookie(ACCESS_COOKIE, "", 0));
  headers.append("set-cookie", serializeCookie(REFRESH_COOKIE, "", 0));
  return headers;
}

export function applySessionCookies(session: SupabaseSession, headers = new Headers()) {
  if (!session.access_token || !session.refresh_token) throw new PowerChainError("UNAUTHORIZED", "Authentication session is incomplete");
  headers.append("set-cookie", serializeCookie(ACCESS_COOKIE, session.access_token, Math.max(60, session.expires_in ?? 3600)));
  headers.append("set-cookie", serializeCookie(REFRESH_COOKIE, session.refresh_token, 60 * 60 * 24 * 30));
  return headers;
}

export function readCookie(request: Request, name: string) {
  const raw = request.headers.get("cookie") ?? "";
  for (const pair of raw.split(";")) {
    const index = pair.indexOf("=");
    if (index < 0) continue;
    if (pair.slice(0, index).trim() === name) return decodeURIComponent(pair.slice(index + 1).trim());
  }
  return null;
}

export function toPublicUser(user?: SupabaseUser | null): PowerChainAuthUser | null {
  if (!user?.id) return null;
  const displayName = typeof user.user_metadata?.display_name === "string" ? user.user_metadata.display_name : typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null;
  return { id: user.id, email: user.email ?? null, displayName, createdAt: user.created_at ?? null, emailConfirmedAt: user.email_confirmed_at ?? null };
}

export async function signInWithPassword(email: string, password: string) {
  return authRequest<SupabaseSession>("token?grant_type=password", { method: "POST", body: JSON.stringify({ email, password }) });
}

export async function signUpWithPassword(email: string, password: string, displayName?: string) {
  const redirect = authRedirectUrl();
  const suffix = redirect ? `?redirect_to=${encodeURIComponent(redirect)}` : "";
  return authRequest<SupabaseSession>(`signup${suffix}`, { method: "POST", body: JSON.stringify({ email, password, data: displayName ? { display_name: displayName } : {} }) });
}

export async function verifyTokenHash(tokenHash: string, type: "email" | "recovery" | "invite" | "email_change") {
  return authRequest<SupabaseSession>("verify", { method: "POST", body: JSON.stringify({ token_hash: tokenHash, type }) });
}

export async function updatePassword(accessToken: string, password: string) {
  return authRequest<SupabaseUser>("user", { method: "PUT", headers: headers(accessToken), body: JSON.stringify({ password }) });
}

export async function requestPasswordReset(email: string) {
  const redirect = authRedirectUrl();
  const suffix = redirect ? `?redirect_to=${encodeURIComponent(redirect)}` : "";
  await authRequest(`recover${suffix}`, { method: "POST", body: JSON.stringify({ email }) });
}

export async function getUser(accessToken: string) {
  return authRequest<SupabaseUser>("user", { method: "GET", headers: headers(accessToken) });
}

export async function refreshSession(refreshToken: string) {
  return authRequest<SupabaseSession>("token?grant_type=refresh_token", { method: "POST", body: JSON.stringify({ refresh_token: refreshToken }) });
}

export async function signOut(accessToken?: string | null) {
  if (!accessToken) return;
  try { await authRequest("logout", { method: "POST", headers: headers(accessToken) }); } catch { /* cookies are still cleared locally */ }
}

export async function resolveSession(request: Request): Promise<{ user: PowerChainAuthUser | null; headers: Headers; authenticated: boolean; accessToken: string | null }> {
  const responseHeaders = new Headers();
  // Native/mobile clients use a Supabase access token in Authorization rather than
  // browser cookies. The token is still verified against Supabase Auth before use.
  const authorization = request.headers.get("authorization")?.trim() ?? "";
  const bearer = authorization.toLowerCase().startsWith("bearer ") ? authorization.slice(7).trim() : "";
  if (bearer) {
    try {
      const user = await getUser(bearer);
      return { user: toPublicUser(user), headers: responseHeaders, authenticated: true, accessToken: bearer };
    } catch {
      return { user: null, headers: responseHeaders, authenticated: false, accessToken: null };
    }
  }
  const access = readCookie(request, ACCESS_COOKIE);
  const refresh = readCookie(request, REFRESH_COOKIE);
  if (access) {
    try { return { user: toPublicUser(await getUser(access)), headers: responseHeaders, authenticated: true, accessToken: access }; } catch { /* try refresh */ }
  }
  if (refresh) {
    try {
      const session = await refreshSession(refresh);
      applySessionCookies(session, responseHeaders);
      return { user: toPublicUser(session.user), headers: responseHeaders, authenticated: Boolean(session.user), accessToken: session.access_token ?? null };
    } catch {
      clearAuthCookies(responseHeaders);
    }
  }
  return { user: null, headers: responseHeaders, authenticated: false, accessToken: null };
}

export const authCookieNames = { access: ACCESS_COOKIE, refresh: REFRESH_COOKIE } as const;
