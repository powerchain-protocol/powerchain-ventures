import {
  renderContactEmail,
  type ContactEmailData,
  type RenderedEmail,
} from "@powerchain/mail";

type MailProvider = "disabled" | "resend";

function provider(): MailProvider {
  const value =
    process.env.MAIL_PROVIDER?.trim().toLowerCase() ||
    "disabled";
  return value === "resend" ? "resend" : "disabled";
}

export function mailStatus() {
  return {
    provider: provider(),
    configured:
      provider() === "resend" &&
      Boolean(process.env.RESEND_API_KEY?.trim()) &&
      Boolean(process.env.MAIL_FROM?.trim()),
  };
}

export async function sendRenderedMail(input: {
  to: string[];
  replyTo?: string;
  email: RenderedEmail;
}) {
  const status = mailStatus();
  if (!status.configured) {
    throw new Error("Mail provider is not configured");
  }

  const apiKey = process.env.RESEND_API_KEY!.trim();
  const from = process.env.MAIL_FROM!.trim();

  const response = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: input.to,
        subject: input.email.subject,
        html: input.email.html,
        text: input.email.text,
        ...(input.replyTo
          ? { reply_to: input.replyTo }
          : {}),
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const text =
      await response.text().catch(() => "");
    throw new Error(
      `Mail delivery failed (${response.status})${
        text ? `: ${text.slice(0, 200)}` : ""
      }`,
    );
  }

  return response.json() as Promise<{
    id?: string;
  }>;
}

export async function sendContactMail(
  data: ContactEmailData,
) {
  const to = (process.env.MAIL_CONTACT_TO ?? "")
    .split(",")
    .map(value => value.trim())
    .filter(Boolean);

  if (!to.length) {
    throw new Error(
      "MAIL_CONTACT_TO is not configured",
    );
  }

  return sendRenderedMail({
    to,
    replyTo: data.email,
    email: renderContactEmail(data),
  });
}
