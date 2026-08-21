"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRightIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth-provider";
import { Turnstile } from "./turnstile";
import { useWallet } from "../provider/wallet-provider";

export function LoginForm() {
  const { login, configured, turnstileRequired } = useAuth();
  const wallet = useWallet();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaAttempt, setCaptchaAttempt] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await login(email, password, captchaToken || undefined);
      if (!result.ok) {
        setError(result.error);
        if (siteKey) { setCaptchaToken(""); setCaptchaAttempt((value) => value + 1); }
        return;
      }
      const requested = new URLSearchParams(window.location.search).get("next");
      const destination = requested && requested.startsWith("/") && !requested.startsWith("//") ? requested : "/dashboard";
      window.location.assign(destination);
    } finally { setSubmitting(false); }
  }

  return <div className="auth-card">
    <span className="eyebrow"><LockClosedIcon/> Secure access</span>
    <h1 className="section-title" style={{fontSize:"42px"}}>Sign in to PowerChain Ventures.</h1>
    <p className="body-copy">Manage launches, authorities, participants, treasury, vesting, claims, analytics, and wallet-controlled execution.</p>
    {!configured ? <div className="auth-config-note">Better Auth is not configured. Set <code>NEXT_PUBLIC_AUTH_URL</code>, <code>BETTER_AUTH_URL</code>, <code>BETTER_AUTH_SECRET</code>, and the Prisma database environment.</div> : null}
    <form onSubmit={submit}>
      <label>Email<input value={email} onChange={(event)=>setEmail(event.target.value)} type="email" placeholder="you@company.com" autoComplete="email" required/></label>
      <label>Password<input value={password} onChange={(event)=>setPassword(event.target.value)} type="password" placeholder="••••••••••••" autoComplete="current-password" required/></label>
      {siteKey ? <Turnstile key={captchaAttempt} siteKey={siteKey} onToken={setCaptchaToken}/> : null}
      {error ? <div className="form-error" role="alert">{error}</div> : null}
      <Button size="lg" type="submit" disabled={submitting || !configured || (turnstileRequired && !captchaToken)}>{submitting ? "Signing in…" : "Sign in"}{!submitting ? <ArrowRightIcon/> : null}</Button>
      <p className="auth-switch">New to PowerChain Ventures? <Link href="/auth/register">Create an account</Link></p>
      <div className="auth-divider"><span>wallet</span></div>
      <Button variant="outline" size="lg" type="button" onClick={()=>wallet.setModalOpen(true)}>Connect wallet</Button>
    </form>
    <p className="body-copy" style={{fontSize:"11px",marginTop:"16px"}}>Wallet connection is separate from account authentication. A connected wallet does not create an authenticated application session and PowerChain never requests a seed phrase or private key.</p>
  </div>;
}
