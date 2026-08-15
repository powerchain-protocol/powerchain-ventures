import {
  POWERCHAIN_PUBLIC_RUNTIME_DEFAULTS,
  type PublicRuntimeConfigContract,
} from "@powerchain/token-data";

export function getPublicRuntimeConfig(): PublicRuntimeConfigContract {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() ?? "";

  return {
    ...POWERCHAIN_PUBLIC_RUNTIME_DEFAULTS,
    apiBaseUrl,
    appUrl,
  };
}
