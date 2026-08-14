import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const appRoot = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(appRoot, "../..");


// Next.js loads apps/frontend/.env.local and apps/frontend/.env* automatically.
// Keep local development zero-config even when a developer has not created
// .env.local yet. These values are public and intentionally non-secret.
// Production/Vercel remains strict below and does not receive these defaults.
if (process.env.NODE_ENV !== "production") {
  process.env.NEXT_PUBLIC_APP_URL ||= "http://localhost:3000";
  process.env.NEXT_PUBLIC_SOLANA_CLUSTER ||= "devnet";
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||= "https://api.devnet.solana.com";
}

const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";
const strictBuildEnv = process.env.POWERCHAIN_STRICT_BUILD_ENV === "1" || isVercel;

function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

function validateBackendOrigin(): void {
  const configured = process.env.BACKEND_ORIGIN;
  if (!configured) {
    if (strictBuildEnv) {
      throw new Error("[PowerChain] BACKEND_ORIGIN is required for strict/Vercel production builds.");
    }
    return;
  }

  const origin = normalizeOrigin(configured);
  let parsed: URL;
  try {
    parsed = new URL(origin);
  } catch {
    throw new Error("[PowerChain] BACKEND_ORIGIN must be an absolute http(s) URL.");
  }
  if (!/^https?:$/.test(parsed.protocol)) {
    throw new Error("[PowerChain] BACKEND_ORIGIN must use http or https.");
  }
  if (isVercel && /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(parsed.hostname)) {
    throw new Error("[PowerChain] BACKEND_ORIGIN cannot point to localhost on Vercel.");
  }
  if (isVercel && parsed.protocol !== "https:") {
    throw new Error("[PowerChain] BACKEND_ORIGIN must use HTTPS on Vercel.");
  }
  void origin;
}

validateBackendOrigin();

function validatePublicSolanaRuntime(): void {
  const cluster = process.env.NEXT_PUBLIC_SOLANA_CLUSTER;
  const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
  if (!cluster) {
    if (strictBuildEnv) throw new Error("[PowerChain] NEXT_PUBLIC_SOLANA_CLUSTER is required for strict/Vercel builds.");
    return;
  }
  if (cluster !== "devnet" && cluster !== "mainnet-beta") {
    throw new Error("[PowerChain] NEXT_PUBLIC_SOLANA_CLUSTER must be devnet or mainnet-beta.");
  }
  if (!rpc) {
    if (strictBuildEnv) throw new Error("[PowerChain] NEXT_PUBLIC_SOLANA_RPC_URL is required for strict/Vercel builds.");
    return;
  }
  let parsed: URL;
  try {
    parsed = new URL(rpc);
  } catch {
    throw new Error("[PowerChain] NEXT_PUBLIC_SOLANA_RPC_URL must be an absolute URL.");
  }
  if (strictBuildEnv && parsed.protocol !== "https:") {
    throw new Error("[PowerChain] NEXT_PUBLIC_SOLANA_RPC_URL must use HTTPS for strict production builds.");
  }
  if (
    strictBuildEnv &&
    cluster === "mainnet-beta" &&
    ["api.mainnet.solana.com", "api.mainnet-beta.solana.com"].includes(parsed.hostname)
  ) {
    throw new Error("[PowerChain] Production mainnet requires a dedicated browser-safe Solana RPC endpoint.");
  }
}

validatePublicSolanaRuntime();

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  { key: "X-Frame-Options", value: "DENY" },
  ...(isProduction ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }] : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  typedRoutes: true,
  productionBrowserSourceMaps: false,
  ...(!isVercel ? { output: "standalone" as const } : {}),
  outputFileTracingRoot: monorepoRoot,
  transpilePackages: ["@powerchain/launchpad-config", "@powerchain/utils", "@powerchain/integrations"],
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/manifest.webmanifest", headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }] },
      { source: "/assets/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
