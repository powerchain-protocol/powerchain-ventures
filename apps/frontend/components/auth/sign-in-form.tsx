"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../context/auth-context";
import { Button, ButtonLink } from "../ui/button";
import { FormField } from "../ui/form-field";
import { Form, FormActions } from "../ui/forms";
import { PasswordField } from "./password-field";
import { SocialLogin } from "./social-login";
import { SolanaLoginButton } from "./solana-login-button";

export function SignInForm() {
  const { signIn, configured } = useAuth();
  const router = useRouter();
  const query = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const result = await signIn(email, password);
    setBusy(false);

    if (!result.ok) {
      setError(result.message ?? "Unable to sign in");
      return;
    }

    if (remember) {
      localStorage.setItem("powerchain.auth.last-email", email.trim());
    }

    router.replace(query.get("next") || "/dashboard");
    router.refresh();
  }

  return (
    <Form className="auth-form auth-form-modern" onSubmit={submit}>
      <FormField
        name="email"
        label="Email address"
        type="email"
        autoComplete="email"
        inputMode="email"
        value={email}
        onChange={event => setEmail(event.target.value)}
        placeholder="you@example.com"
        required
      />

      <PasswordField
        value={password}
        onChange={setPassword}
      />

      <div className="auth-form-meta auth-form-meta-modern">
        <label className="auth-check">
          <input
            type="checkbox"
            checked={remember}
            onChange={event => setRemember(event.target.checked)}
          />
          <span>Remember email on this device</span>
        </label>
        <Link href="/auth/forgot-password">Forgot password?</Link>
      </div>

      {error ? (
        <div className="auth-alert error" role="alert">
          {error}
        </div>
      ) : null}

      {!configured ? (
        <div className="auth-alert warning">
          Account authentication is not configured on this deployment.
        </div>
      ) : null}

      <FormActions>
        <Button
          type="submit"
          block
          size="lg"
          disabled={busy || !configured}
        >
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </FormActions>

      <div className="auth-divider"><span>or</span></div>

      <SocialLogin />

      <SolanaLoginButton />

      <p className="auth-switch">
        New to PowerChain?{" "}
        <Link href="/auth/sign-up">Create account</Link>
      </p>

      <p className="auth-privacy-note">
        Account authentication and wallet custody are separate. PowerChain
        never receives your wallet private keys.
      </p>
    </Form>
  );
}
