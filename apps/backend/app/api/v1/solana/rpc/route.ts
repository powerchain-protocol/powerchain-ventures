import { error, json, readJson, requestId } from "../../../../../lib/http";
import { solanaRpc } from "../../../../../lib/solana-rpc";

export const dynamic = "force-dynamic";

type JsonRpcRequest = {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: unknown[];
};

const METHOD = /^[A-Za-z][A-Za-z0-9]{1,63}$/;

export async function POST(request: Request) {
  const id = requestId(request);

  try {
    const body = await readJson<JsonRpcRequest>(request);
    if (body.jsonrpc !== undefined && body.jsonrpc !== "2.0") {
      return json(
        {
          jsonrpc: "2.0",
          id: body.id ?? null,
          error: { code: -32600, message: "Invalid JSON-RPC version" },
        },
        { status: 400 },
        id,
      );
    }

    const method = body.method?.trim() ?? "";
    if (!METHOD.test(method)) {
      return json(
        {
          jsonrpc: "2.0",
          id: body.id ?? null,
          error: { code: -32600, message: "Invalid JSON-RPC method" },
        },
        { status: 400 },
        id,
      );
    }

    const response = await solanaRpc<unknown>(
      method,
      Array.isArray(body.params) ? body.params : [],
    );

    return json(
      {
        jsonrpc: "2.0",
        id: body.id ?? null,
        result: response.result,
      },
      {
        headers: {
          "x-powerchain-rpc-endpoint": response.endpoint,
          "x-powerchain-rpc-latency-ms": String(response.latencyMs),
        },
      },
      id,
    );
  } catch (cause) {
    return json(
      {
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32000,
          message:
            cause instanceof Error ? cause.message : "RPC unavailable",
        },
      },
      { status: 503 },
      id,
    );
  }
}

export function GET() {
  return error(
    "BAD_REQUEST",
    "Solana JSON-RPC proxy accepts POST requests only",
    405,
  );
}
