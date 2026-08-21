"use client";

import { createContext, useContext, useMemo } from "react";
import { authClient } from "@/lib/auth-client";

type AuthUser = { id: string; name: string; email: string; image?: string | null } | null;
type AuthResult = { ok: true } | { ok: false; error: string };
type AuthContextValue = {
  user: AuthUser;
  loading: boolean;
  configured: boolean;
  turnstileRequired: boolean;
  login: (email: string, password: string, captchaToken?: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string, captchaToken?: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const configured = Boolean(process.env.NEXT_PUBLIC_AUTH_URL || process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL);
const turnstileRequired = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

function captchaHeaders(captchaToken?: string) {
  return captchaToken ? { "x-captcha-response": captchaToken } : undefined;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const sessionUser = session?.user;
  const user: AuthUser = sessionUser?.email
    ? { id: sessionUser.id, name: sessionUser.name || sessionUser.email.split("@")[0], email: sessionUser.email, image: sessionUser.image }
    : null;

  async function login(email: string, password: string, captchaToken?: string): Promise<AuthResult> {
    if (!configured) return { ok: false, error: "Account authentication is not configured for this deployment." };
    if (!email || !password) return { ok: false, error: "Enter your email and password." };
    if (turnstileRequired && !captchaToken) return { ok: false, error: "Complete the security check before signing in." };
    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
      fetchOptions: { headers: captchaHeaders(captchaToken) }
    });
    if (error) return { ok: false, error: error.message || "Unable to sign in." };
    return { ok: true };
  }

  async function register(name: string, email: string, password: string, captchaToken?: string): Promise<AuthResult> {
    if (!configured) return { ok: false, error: "Account authentication is not configured for this deployment." };
    if (name.trim().length < 2) return { ok: false, error: "Enter your name." };
    if (password.length < 12) return { ok: false, error: "Use a password with at least 12 characters." };
    if (turnstileRequired && !captchaToken) return { ok: false, error: "Complete the security check before creating an account." };
    const { error } = await authClient.signUp.email({
      name: name.trim(),
      email,
      password,
      fetchOptions: { headers: captchaHeaders(captchaToken) }
    });
    if (error) return { ok: false, error: error.message || "Unable to create account." };
    return { ok: true };
  }

  async function logout() {
    await authClient.signOut();
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading: isPending,
    configured,
    turnstileRequired,
    login,
    register,
    logout
  }), [user, isPending]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
