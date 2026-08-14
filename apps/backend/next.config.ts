import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

const appRoot = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(appRoot, "../..");

// Load the monorepo-root .env* files before backend modules read process.env.
// This keeps one canonical environment source for frontend and backend.
loadEnvConfig(monorepoRoot, process.env.NODE_ENV !== "production");

const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Cache-Control", value: "no-store, max-age=0" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
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
  turbopack: { root: monorepoRoot },
  outputFileTracingIncludes: { "/api/v1/openapi": ["./openapi/powerchain-launchpad.openapi.yaml"] },
  transpilePackages: ["@powerchain/solana", "@powerchain/launchpad-config", "@powerchain/utils", "@powerchain/integrations", "@powerchain/launchpad-program-client"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
