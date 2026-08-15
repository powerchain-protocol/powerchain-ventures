import { isAllowedOrigin } from "@powerchain/token-data";
import { checkRateLimit, rateLimitHeaders } from "./rate-limit";
import { requestIdentity } from "./request-identity";
import { problemResponse } from "./problem-response";

export function guardPublicRequest(
  request: Request,
  options: {
    allowedOrigins?: readonly string[];
    bucket?: "public-metadata" | "public-health";
  } = {},
): Response | null {
  const allowedOrigins = options.allowedOrigins ?? [];
  const origin = request.headers.get("origin");

  if (allowedOrigins.length && !isAllowedOrigin(origin, allowedOrigins)) {
    return problemResponse(request, {
      code: "INVALID_REQUEST",
      status: 403,
      title: "Origin not allowed",
      detail: "The request origin is not allowed.",
    });
  }

  const result = checkRateLimit(
    options.bucket ?? "public-metadata",
    requestIdentity(request),
  );

  if (!result.allowed) {
    const response = problemResponse(request, {
      code: "RATE_LIMITED",
      status: 429,
      title: "Too many requests",
      detail: "The request rate limit has been exceeded.",
      retryAfterSeconds: result.retryAfterSeconds,
    });

    const headers = new Headers(response.headers);
    for (const [key, value] of Object.entries(rateLimitHeaders(result))) {
      headers.set(key, value);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  return null;
}
