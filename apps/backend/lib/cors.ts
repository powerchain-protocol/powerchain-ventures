const METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS";
const HEADERS = [
  "authorization",
  "content-type",
  "idempotency-key",
  "x-request-id",
  "x-wallet-address",
].join(",");

function normalizeOrigin(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (!["http:", "https:"].includes(url.protocol)) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function configuredCorsOrigins(
  env: NodeJS.ProcessEnv = process.env,
): Set<string> {
  const values = [
    ...(env.ALLOWED_ORIGINS ?? "").split(","),
    env.NEXT_PUBLIC_APP_URL ?? "",
  ];

  const origins = values
    .map(value => normalizeOrigin(value))
    .filter((value): value is string => Boolean(value));

  return new Set(origins);
}

export function corsHeadersFor(
  origin: string | null,
  allowed = configuredCorsOrigins(),
): Headers {
  const headers = new Headers({
    "access-control-allow-methods": METHODS,
    "access-control-allow-headers": HEADERS,
    "access-control-max-age": "600",
    "access-control-expose-headers":
      "x-request-id,x-powerchain-release,x-powerchain-rpc-endpoint,x-powerchain-rpc-latency-ms",
    vary: "origin",
  });

  const normalized = origin ? normalizeOrigin(origin) : null;
  if (normalized && allowed.has(normalized)) {
    headers.set("access-control-allow-origin", normalized);
  }

  return headers;
}

export function isCorsOriginAllowed(
  origin: string | null,
  allowed = configuredCorsOrigins(),
): boolean {
  if (!origin) return true;
  const normalized = normalizeOrigin(origin);
  return Boolean(normalized && allowed.has(normalized));
}
