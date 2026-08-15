async function read<T>(
  response: Response,
): Promise<T> {
  const body =
    await response
      .json()
      .catch(
        () => null,
      );

  if (!response.ok) {
    throw new Error(
      body?.error?.message ??
        body?.message ??
        `Request failed (${response.status})`,
    );
  }

  return body as T;
}

export async function getJson<T>(
  path: string,
) {
  return read<T>(
    await fetch(
      path,
      {
        cache: "no-store",
        credentials:
          "include",
      },
    ),
  );
}

export async function postJson<
  T,
  B extends object,
>(
  path: string,
  body: B,
  options: {
    idempotencyKey?:
      string;
  } = {},
) {
  return read<T>(
    await fetch(
      path,
      {
        method: "POST",
        headers: {
          "content-type":
            "application/json",
          ...(options.idempotencyKey
            ? {
                "idempotency-key":
                  options.idempotencyKey,
              }
            : {}),
        },
        credentials:
          "include",
        body:
          JSON.stringify(
            body,
          ),
      },
    ),
  );
}
