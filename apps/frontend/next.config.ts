import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@powerchain/components", "@powerchain/api-client", "@powerchain/config", "@powerchain/types"]
};
export default nextConfig;
