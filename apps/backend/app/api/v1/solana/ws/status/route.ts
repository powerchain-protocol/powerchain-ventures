import { json } from "../../../../../../lib/http";
import {
  websocketTransportStatus,
} from "../../../../../../lib/solana-websocket";

export async function GET() {
  return json({
    ok: true,
    websocket: websocketTransportStatus(),
  });
}
