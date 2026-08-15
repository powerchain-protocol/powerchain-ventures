import { renderToStaticMarkup } from "react-dom/server";
import { AuthEmailTemplate } from "./auth-email-template.js";
import { ContactEmailTemplate } from "./contact-email-template.js";
import type {
  AuthEmailData,
  ContactEmailData,
  RenderedEmail,
} from "./types.js";

function document(html: string): string {
  return `<!doctype html>${html}`;
}

export function renderContactEmail(
  data: ContactEmailData,
): RenderedEmail {
  return {
    subject: `[PowerChain] ${data.subject}`,
    html: document(
      renderToStaticMarkup(<ContactEmailTemplate data={data} />),
    ),
    text: [
      `PowerChain contact request: ${data.subject}`,
      `From: ${data.name} <${data.email}>`,
      "",
      data.message,
      "",
      `Request ID: ${data.requestId ?? "not supplied"}`,
    ].join("\n"),
  };
}

export function renderAuthEmail(
  data: AuthEmailData,
): RenderedEmail {
  const labels = {
    "confirm-email": "Confirm your PowerChain email",
    "password-reset": "Reset your PowerChain password",
    "security-notice": "PowerChain account security notice",
  } as const;

  return {
    subject: labels[data.kind],
    html: document(
      renderToStaticMarkup(<AuthEmailTemplate data={data} />),
    ),
    text: [
      labels[data.kind],
      data.displayName ? `Hello ${data.displayName},` : "Hello,",
      `Account: ${data.email}`,
      data.actionUrl ? `Action: ${data.actionUrl}` : "",
      data.ipHint ? `Activity source: ${data.ipHint}` : "",
    ].filter(Boolean).join("\n"),
  };
}
