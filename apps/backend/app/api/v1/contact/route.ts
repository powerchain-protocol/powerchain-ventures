import { errorFromUnknown, json, readJson, requestId } from "../../../../lib/http";
import { sendContactMail, mailStatus } from "../../../../lib/mail-service";
import { enforceRateLimit } from "../../../../lib/rate-limit-response";
import {
  optionalString,
  requireString,
  validateEmail,
} from "../../../../lib/validate";

type ContactBody = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  company?: string;
  website?: string;
};

export async function GET() {
  return json({
    ok: true,
    contact: {
      mailConfigured: mailStatus().configured,
      maxMessageLength: 4_000,
      categories: [
        "Product question",
        "Launch support",
        "Technical issue",
        "Partnership",
        "Security",
        "Other",
      ],
    },
  });
}

export async function POST(request: Request) {
  const id = requestId(request);

  try {
    const limited = await enforceRateLimit(request, "contact", 8);
    if (limited) return limited;

    const body = await readJson<ContactBody>(request);

    // Honeypot. Automated submissions receive a generic success response.
    if (optionalString(body.website, "website", 200)) {
      return json({ ok: true, message: "Message received." }, {}, id);
    }

    const name = requireString(body.name, "name", 100);
    const email = validateEmail(body.email);
    const subject = requireString(body.subject, "subject", 120);
    const message = requireString(body.message, "message", 4_000);
    optionalString(body.company, "company", 120);

    await sendContactMail({
      name,
      email,
      subject,
      message,
      requestId: id,
    });

    return json(
      {
        ok: true,
        message: "Your message has been sent to PowerChain support.",
      },
      {},
      id,
    );
  } catch (error) {
    return errorFromUnknown(error, id);
  }
}
