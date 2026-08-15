import { json } from "../../../../../lib/http";
import { mailStatus } from "../../../../../lib/mail-service";

export async function GET() {
  const status = mailStatus();
  return json({
    ok: true,
    mail: {
      configured: status.configured,
      provider: status.provider,
    },
  });
}
