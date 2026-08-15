import Link from "next/link";
import { AuthButton } from "./auth/auth-button";
import { NetworkStatus } from "./launchpad/network-status";
import { PowerChainLogo } from "./logo";
import { MobileBottomNav } from "./mobile/mobile-bottom-nav";
import { AppNavigation } from "./navigation/app-navigation";
import { MultichainWalletControls } from "./wallet/multichain-wallet-controls";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Topbar />
      <header className="app-header">
        <Link
          href="/"
          className="app-header-brand"
          aria-label="PowerChain Launchpad home"
        >
          <PowerChainLogo priority />
        </Link>

        <AppNavigation />

        <div className="header-actions">
          <NetworkStatus compact />
          <Link className="header-create-link" href="/create">
            Create sale
          </Link>
          <MultichainWalletControls />
          <AuthButton />
        </div>
      </header>

      {children}
      <MobileBottomNav />

      <footer className="app-footer">
        <Link href="/" aria-label="PowerChain Launchpad home">
          <PowerChainLogo compact />
        </Link>
        <span>PowerChain Launchpad™ 1.0.0</span>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link href="/docs">Docs</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/security">Security</Link>
          <Link href="/legal">Legal</Link>
          <Link href="/settings">Settings</Link>
        </nav>
      </footer>
    </>
  );
}
