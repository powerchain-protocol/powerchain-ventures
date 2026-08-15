# API Problem Responses

PowerChain backend helpers use a typed JSON problem contract for operational failures.

Example shape:

```json
{
  "type": "about:blank",
  "title": "Service unavailable",
  "status": 503,
  "code": "PUBLIC_DATA_UNAVAILABLE",
  "detail": "Public data is temporarily unavailable",
  "requestId": "request-id",
  "release": "1.0.0"
}
```

Problem responses use `application/problem+json`, `Cache-Control: no-store`, and `X-Request-ID`.

Error responses must never include stack traces, provider keys, authentication tokens, cookies, signing material, or raw internal exception objects.
