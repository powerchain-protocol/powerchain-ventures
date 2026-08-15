export type FetchLike = typeof fetch;

export type IntegrationRequestOptions = {
  fetcher?: FetchLike;
  timeoutMs?: number;
};

export async function fetchIntegrationJson<T>(
  url: string,
  init: RequestInit = {},
  options: IntegrationRequestOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? 8_000,
  );

  try {
    const response = await (options.fetcher ?? fetch)(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(
        `integration_http_${response.status}:${text.slice(0, 240)}`,
      );
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      throw new Error("integration_invalid_json");
    }
  } finally {
    clearTimeout(timer);
  }
}
