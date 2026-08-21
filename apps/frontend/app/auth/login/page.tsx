import { Logo } from "@powerchain/components/logo";
import { LoginForm } from "@/components/auth/login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { WalletConnectModal } from "@/components/wallet/wallet-connect-modal";

export default function LoginPage() {
  return <main className="auth-shell"><section className="auth-visual"><Logo tone="light"/><div className="auth-quote"><span className="eyebrow eyebrow-light">PowerChain Launchpad</span><h2>Launch with intelligence. Execute with control.</h2><p>AI can analyze, prepare, and coordinate. PowerChain validates and orchestrates. Only an authorized wallet can sign.</p></div><small>Wallet-controlled · Solana-native · On-chain settlement</small></section><section className="auth-panel"><div style={{position:"absolute",top:20,right:20}}><ThemeToggle/></div><LoginForm/></section><WalletConnectModal/></main>;
}
