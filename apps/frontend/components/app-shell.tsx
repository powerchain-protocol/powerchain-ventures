import Link from "next/link";
import { PowerChainLogo } from "./logo";
import { WalletButton } from "./wallet-button";
import { NetworkStatus } from "./launchpad/network-status";
import { AppNavigation } from "./navigation/app-navigation";
import { MobileBottomNav } from "./mobile/mobile-bottom-nav";
import { AuthButton } from "./auth/auth-button";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="app-header">
        <Link href="/" aria-label="PowerChain Launchpad home">
          <PowerChainLogo />
        </Link>
        <AppNavigation />
        <div className="header-actions">
          <NetworkStatus compact />
          <WalletButton />
          <AuthButton />
        </div>
      </header>
      {children}
      <MobileBottomNav />
      <footer>
        <PowerChainLogo compact />
        <span>PowerChain Launchpad™ 1.0.0</span>
        <span>Solana • Token-2022 • PWRC</span>
      </footer>
    </>
  );
}
