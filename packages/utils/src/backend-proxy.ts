const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
]);

function normalizeOrigin(
  raw: string,
  production: boolean,
) {
  const url =
    new URL(raw.trim());

  if (
    url.protocol !== "http:" &&
    url.protocol !== "https:"
  ) {
    throw new Error(
      "Backend origin must use http or https",
    );
  }

  if (
    production &&
    url.protocol !== "https:"
  ) {
    throw new Error(
      "Production backend origins must use https",
    );
  }

  return url.origin;
}

export function backendOrigins(
  env: {
    BACKEND_ORIGIN?: string;
    BACKEND_FALLBACK_ORIGINS?: string;
    NODE_ENV?: string;
  } = process.env,
) {
  const primary =
    env.BACKEND_ORIGIN?.trim() ||
    "http://localhost:3001";

  const fallbacks =
    (
      env.BACKEND_FALLBACK_ORIGINS ??
      ""
    )
      .split(",")
      .map(
        value =>
          value.trim(),
      )
      .filter(Boolean);

  return [
    ...new Set(
      [
        primary,
        ...fallbacks,
      ].map(value =>
        normalizeOrigin(
          value,
          env.NODE_ENV ===
            "production",
        ),
      ),
    ),
  ];
}

function requestHeaders(
  request: Request,
) {
  const headers =
    new Headers();

  request.headers.forEach(
    (value, key) => {
      const lower =
        key.toLowerCase();

      if (
        HOP_BY_HOP.has(
          lower,
        ) ||
        lower === "host" ||
        lower ===
          "content-length"
      ) {
        return;
      }

      headers.append(
        key,
        value,
      );
    },
  );

  const incoming =
    new URL(request.url);

  headers.set(
    "x-forwarded-proto",
    incoming.protocol.replace(
      ":",
      "",
    ),
  );

  return headers;
}

function responseHeaders(
  source: Headers,
) {
  const headers =
    new Headers();

  source.forEach(
    (value, key) => {
      if (
        !HOP_BY_HOP.has(
          key.toLowerCase(),
        )
      ) {
        headers.append(
          key,
          value,
        );
      }
    },
  );

  return headers;
}

function canFailOver(
  request: Request,
) {
  if (
    request.method ===
      "GET" ||
    request.method ===
      "HEAD"
  ) {
    return true;
  }

  return Boolean(
    request.headers
      .get(
        "idempotency-key",
      )
      ?.trim(),
  );
}

export async function forwardBackendRequest(
  request: Request,
  pathSegments: readonly string[],
  options: {
    prefix?: string;
    timeoutMs?: number;
  } = {},
) {
  const incoming =
    new URL(request.url);
  const origins =
    backendOrigins();
  const safeFailover =
    canFailOver(request);
  const prefix =
    options.prefix ??
    "/api/v1";

  const body =
    request.method ===
      "GET" ||
    request.method ===
      "HEAD"
      ? undefined
      : await request.arrayBuffer();

  let lastError =
    "Backend is unavailable";

  for (
    let index = 0;
    index < origins.length;
    index += 1
  ) {
    const controller =
      new AbortController();

    const timer =
      setTimeout(
        () =>
          controller.abort(),
        options.timeoutMs ??
          10_000,
      );

    try {
      const path =
        pathSegments
          .map(
            segment =>
              encodeURIComponent(
                segment,
              ),
          )
          .join("/");

      const target =
        new URL(
          `${prefix}/${path}`,
          origins[index]!,
        );

      target.search =
        incoming.search;

      const upstream =
        await fetch(
          target,
          {
            method:
              request.method,
            headers:
              requestHeaders(
                request,
              ),
            ...(body !==
            undefined
              ? { body }
              : {}),
            redirect:
              "manual",
            cache:
              "no-store",
            signal:
              controller.signal,
          },
        );

      if (
        upstream.status >=
          500 &&
        safeFailover &&
        index <
          origins.length - 1
      ) {
        lastError =
          `Backend ${
            index + 1
          } returned ${
            upstream.status
          }`;
        continue;
      }

      const headers =
        responseHeaders(
          upstream.headers,
        );

      headers.set(
        "x-powerchain-backend-index",
        String(index),
      );
      headers.set(
        "x-powerchain-backend-fallback",
        index > 0
          ? "true"
          : "false",
      );

      return new Response(
        upstream.body,
        {
          status:
            upstream.status,
          statusText:
            upstream.statusText,
          headers,
        },
      );
    } catch (cause) {
      lastError =
        cause instanceof Error &&
        cause.name ===
          "AbortError"
          ? "Backend request timed out"
          : cause instanceof
              Error
            ? cause.message
            : "Backend is unreachable";

      if (
        !safeFailover ||
        index >=
          origins.length - 1
      ) {
        break;
      }
    } finally {
      clearTimeout(timer);
    }
  }

  return Response.json(
    {
      ok: false,
      error: {
        code:
          "BACKEND_UNAVAILABLE",
        message:
          lastError,
      },
    },
    {
      status: 503,
      headers: {
        "cache-control":
          "no-store",
        "retry-after": "2",
      },
    },
  );
}
