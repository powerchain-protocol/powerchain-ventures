# GET /api/v1/public-data/health

Returns current validation status for the public-data layer.

Success: `200 OK`

Validation failure: `503 Service Unavailable`

The response is `no-store` and includes the PowerChain release and schema version headers.
