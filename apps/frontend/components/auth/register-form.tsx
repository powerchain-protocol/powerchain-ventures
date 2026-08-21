"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRightIcon, PersonIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth-provider";
import { Turnstile } from "./turnstile";

export function RegisterForm() {
  const { register, configured, turnstileRequired } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaAttempt, setCaptchaAttempt] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setSubmitting(true);
    try {
      const result = await register(name, email, password, captchaToken || undefined);
      if (!result.ok) {
        setError(result.error);
        if (siteKey) { setCaptchaToken(""); setCaptchaAttempt((value) => value + 1); }
        return;
      }
      window.location.href = "/dashboard";
    } finally { setSubmitting(false); }
  }

  return <div className="auth-card">
    <span className="eyebrow"><PersonIcon/> Create account</span>
    <h1 className="section-title" style={{fontSize:"42px"}}>Operate launches with controlled access.</h1>
    <p className="body-copy">Create an application account. Wallet signing remains separate and always requires the authorized wallet.</p>
    <form onSubmit={submit}>
      <label>Name<input value={name} onChange={(event)=>setName(event.target.value)} type="text" placeholder="Your name" autoComplete="name" required/></label>
      <label>Email<input value={email} onChange={(event)=>setEmail(event.target.value)} type="email" placeholder="you@company.com" autoComplete="email" required/></label>
      <label>Password<input value={password} onChange={(event)=>setPassword(event.target.value)} type="password" placeholder="At least 12 characters" autoComplete="new-password" minLength={12} maxLength={128} required/></label>
      <label>Confirm password<input value={confirm} onChange={(event)=>setConfirm(event.target.value)} type="password" placeholder="Repeat password" autoComplete="new-password" minLength={12} maxLength={128} required/></label>
      {siteKey ? <Turnstile key={captchaAttempt} siteKey={siteKey} onToken={setCaptchaToken}/> : null}
      {error ? <div className="form-error" role="alert">{error}</div> : null}
      <Button size="lg" type="submit" disabled={submitting || !configured || (turnstileRequired && !captchaToken)}>{submitting ? "Creating account…" : "Create account"}{!submitting ? <ArrowRightIcon/> : null}</Button>
      <p className="auth-switch">Already have an account? <Link href="/auth/login">Sign in</Link></p>
    </form>
  </div>;
}
