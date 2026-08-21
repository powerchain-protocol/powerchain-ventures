import { Logo } from "@powerchain/components/logo";
import { RegisterForm } from "@/components/auth/register-form";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RegisterPage() {
  return <main className="auth-shell"><section className="auth-visual"><Logo tone="light"/><div className="auth-quote"><span className="eyebrow eyebrow-light">PowerChain Ventures</span><h2>Configure with intelligence. Sign with authority.</h2><p>Account access controls the operating workspace. Private keys remain in the wallet and are never stored by PowerChain.</p></div><small>Better Auth · Turnstile-ready · Wallet-controlled execution</small></section><section className="auth-panel"><div style={{position:"absolute",top:20,right:20}}><ThemeToggle/></div><RegisterForm/></section></main>;
}
