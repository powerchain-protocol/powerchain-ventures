import path from "node:path";
import {
  fileURLToPath,
} from "node:url";
import type {
  NextConfig,
} from "next";

const appRoot =
  path.dirname(
    fileURLToPath(
      import.meta.url,
    ),
  );
const monorepoRoot =
  path.resolve(
    appRoot,
    "../..",
  );

if (
  process.env.NODE_ENV !==
  "production"
) {
  process.env
    .NEXT_PUBLIC_CHECKOUT_URL ||=
    "http://localhost:3002";
  process.env
    .NEXT_PUBLIC_LAUNCHPAD_URL ||=
    "http://localhost:3000";
  process.env
    .NEXT_PUBLIC_SOLANA_CLUSTER ||=
    "mainnet-beta";
  process.env
    .NEXT_PUBLIC_SOLANA_RPC_URL ||=
    "http://localhost:3001/api/v1/solana/rpc";
}

const production =
  process.env.NODE_ENV ===
  "production";
const strict =
  process.env
    .POWERCHAIN_STRICT_BUILD_ENV ===
    "1" ||
  process.env.VERCEL === "1";

function requireUrl(
  key: string,
  value:
    | string
    | undefined,
) {
  if (!value) {
    if (strict) {
      throw new Error(
        `[PowerChain Checkout] ${key} is required`,
      );
    }
    return;
  }

  const url =
    new URL(value);

  if (
    strict &&
    url.protocol !== "https:"
  ) {
    throw new Error(
      `[PowerChain Checkout] ${key} must use HTTPS in production`,
    );
  }
}

requireUrl(
  "NEXT_PUBLIC_CHECKOUT_URL",
  process.env
    .NEXT_PUBLIC_CHECKOUT_URL,
);
requireUrl(
  "NEXT_PUBLIC_LAUNCHPAD_URL",
  process.env
    .NEXT_PUBLIC_LAUNCHPAD_URL,
);
requireUrl(
  "BACKEND_ORIGIN",
  process.env.BACKEND_ORIGIN,
);

const securityHeaders = [
  {
    key:
      "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value:
      "strict-origin-when-cross-origin",
  },
  {
    key:
      "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key:
      "Cross-Origin-Opener-Policy",
    value:
      "same-origin-allow-popups",
  },
  {
    key:
      "X-Frame-Options",
    value: "DENY",
  },
  ...(production
    ? [
        {
          key:
            "Strict-Transport-Security",
          value:
            "max-age=31536000; includeSubDomains",
        },
      ]
    : []),
];

const config: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  typedRoutes: true,
  productionBrowserSourceMaps:
    false,
  outputFileTracingRoot:
    monorepoRoot,
  transpilePackages: [
    "@powerchain/launchpad-config",
    "@powerchain/utils",
    "@powerchain/integrations",
    "@powerchain/ui",
  ],
  experimental: {
    optimizePackageImports: [
      "@powerchain/ui",
      "@powerchain/utils",
      "@web3icons/react",
    ],
    turbopackFileSystemCacheForDev:
      true,
    turbopackFileSystemCacheForBuild:
      true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers:
          securityHeaders,
      },
    ];
  },
};

export default config;
