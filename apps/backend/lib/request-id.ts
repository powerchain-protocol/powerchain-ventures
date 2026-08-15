const REQUEST_ID_RE = /^[A-Za-z0-9._:-]{8,128}$/;

export function resolveRequestId(headers: Headers): string {
  const incoming = headers.get("x-request-id")?.trim();
  if (incoming && REQUEST_ID_RE.test(incoming)) return incoming;
  return crypto.randomUUID();
}
