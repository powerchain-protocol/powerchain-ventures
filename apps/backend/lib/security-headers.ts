import { POWERCHAIN_SECURITY_POLICY } from "@powerchain/token-data";

export function powerChainSecurityHeaders(): Record<string, string> {
  return {
    "X-Content-Type-Options": POWERCHAIN_SECURITY_POLICY.headers.contentTypeOptions,
    "Referrer-Policy": POWERCHAIN_SECURITY_POLICY.headers.referrerPolicy,
    "X-Frame-Options": POWERCHAIN_SECURITY_POLICY.headers.frameOptions,
    "Permissions-Policy": POWERCHAIN_SECURITY_POLICY.headers.permissionsPolicy,
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
  };
}

export function applyPowerChainSecurityHeaders(headers: Headers): Headers {
  for (const [key, value] of Object.entries(powerChainSecurityHeaders())) {
    headers.set(key, value);
  }
  return headers;
}
