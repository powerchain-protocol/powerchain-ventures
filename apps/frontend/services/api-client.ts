import {
  fetchJsonWithPolicy,
  type FetchJsonOptions,
} from "@powerchain/utils/http";

export class ApiClient {
  request<TResponse>(
    url: string,
    options: FetchJsonOptions = {},
  ): Promise<TResponse> {
    return fetchJsonWithPolicy<TResponse>(
      url,
      options,
    );
  }

  get<T>(
    url: string,
    options: Omit<
      FetchJsonOptions,
      "method"
    > = {},
  ): Promise<T> {
    return this.request<T>(
      url,
      {
        ...options,
        method: "GET",
        retries:
          options.retries ?? 1,
      },
    );
  }

  post<
    TResponse,
    TBody extends object,
  >(
    url: string,
    body: TBody,
    options: Omit<
      FetchJsonOptions,
      "method" | "body"
    > = {},
  ): Promise<TResponse> {
    return this.request<TResponse>(
      url,
      {
        ...options,
        method: "POST",
        headers: {
          "content-type":
            "application/json",
          ...(options.headers ?? {}),
        },
        body: JSON.stringify(body),
        retries:
          options.retries ?? 0,
      },
    );
  }

  delete<
    TResponse,
    TBody extends object,
  >(
    url: string,
    body: TBody,
    options: Omit<
      FetchJsonOptions,
      "method" | "body"
    > = {},
  ): Promise<TResponse> {
    return this.request<TResponse>(
      url,
      {
        ...options,
        method: "DELETE",
        headers: {
          "content-type":
            "application/json",
          ...(options.headers ?? {}),
        },
        body: JSON.stringify(body),
        retries: 0,
      },
    );
  }
}

export const apiClient =
  new ApiClient();
