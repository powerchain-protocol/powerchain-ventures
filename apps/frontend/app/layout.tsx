import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { ThemeScript } from "@/components/provider/theme-script";
import { WalletProvider } from "@/components/provider/wallet-provider";
import { EmbeddedWalletProvider } from "@/components/provider/embedded-wallet-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { AppContextProvider } from "@/context/app-context";
import { SITE } from "@/constants/site";

export const metadata: Metadata = {
  title: { default: `${SITE.name} — Tokenized Renewables`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  icons: { icon: "/assets/logo-dark.png" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning><head><ThemeScript /></head><body><a className="skip-link" href="#main-content">Skip to main content</a><ThemeProvider><AppContextProvider><AuthProvider><EmbeddedWalletProvider><WalletProvider>{children}</WalletProvider></EmbeddedWalletProvider></AuthProvider></AppContextProvider></ThemeProvider></body></html>;
}
