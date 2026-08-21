import type { Metadata } from "next";
import "./style.css";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { ThemeScript } from "@/components/provider/theme-script";
import { AppContextProvider } from "@/context/app-context";
import { SITE } from "@/constants/site";

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning><head><ThemeScript /></head><body><a className="skip-link" href="#main-content">Skip to main content</a><ThemeProvider><AppContextProvider>{children}</AppContextProvider></ThemeProvider></body></html>;
}
