import { json } from "../../../../../lib/http";
import {
  rpcEndpoints,
} from "../../../../../lib/solana-rpc";
import {
  websocketTransportStatus,
} from "../../../../../lib/solana-websocket";

export async function GET() {
  return json({
    ok: true,
    transport: {
      http: {
        rpcEndpoints: rpcEndpoints(),
        fallback: "ordered",
      },
      websocket: websocketTransportStatus(),
    },
  });
}
