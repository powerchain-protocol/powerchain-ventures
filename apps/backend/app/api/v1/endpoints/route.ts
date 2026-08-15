import {
  API_ENDPOINTS,
  API_V1_PREFIX,
} from "@powerchain/launchpad-config/endpoints";
import { json } from "../../../../lib/http";

export async function GET() {
  return json({
    ok: true,
    api: {
      version: "v1",
      prefix: API_V1_PREFIX,
      endpoints: API_ENDPOINTS,
    },
  });
}
