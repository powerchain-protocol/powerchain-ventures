import {
  POWERCHAIN_PUBLIC_RUNTIME_DEFAULTS,
  type PublicRuntimeConfigContract,
} from "@powerchain/token-data";

export function getMobilePublicRuntimeConfig(): PublicRuntimeConfigContract {
  return {
    ...POWERCHAIN_PUBLIC_RUNTIME_DEFAULTS,
    apiBaseUrl: process.env.EXPO_PUBLIC_API_URL?.trim() ?? "",
    appUrl: process.env.EXPO_PUBLIC_WEB_URL?.trim() ?? "",
  };
}
