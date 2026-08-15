import "./styles.css";
import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "PowerChain Launchpad",
    template: "%s | PowerChain Launchpad",
  },
  description:
    "Create, participate in, claim from and manage Solana Token-2022 token sales with PowerChain Launchpad.",
  applicationName: "PowerChain Launchpad",
  category: "finance",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/assets/brand/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/assets/brand/favicon-64.png",
        sizes: "64x64",
        type: "image/png",
      },
    ],
    apple: "/assets/brand/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "PowerChain Launchpad",
    title: "PowerChain Launchpad",
    description:
      "Production-oriented Solana Token-2022 token sales, claims and creator operations.",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F9F7" },
    { media: "(prefers-color-scheme: dark)", color: "#111315" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
