import { EmailButton, EmailTemplate } from "./email-template.js";
import type { AuthEmailData } from "./types.js";

const copy = {
  "confirm-email": {
    eyebrow: "Confirm account",
    title: "Confirm your PowerChain email",
    action: "Confirm email",
  },
  "password-reset": {
    eyebrow: "Account recovery",
    title: "Reset your PowerChain password",
    action: "Reset password",
  },
  "security-notice": {
    eyebrow: "Security notice",
    title: "New PowerChain account activity",
    action: "Review account",
  },
} as const;

export function AuthEmailTemplate({ data }: { data: AuthEmailData }) {
  const content = copy[data.kind];
  return (
    <EmailTemplate eyebrow={content.eyebrow} title={content.title}>
      <p>
        {data.displayName ? `Hello ${data.displayName},` : "Hello,"}
      </p>
      <p>
        This message relates to your PowerChain Launchpad account for{" "}
        <strong>{data.email}</strong>.
      </p>
      {data.ipHint ? <p>Activity source: {data.ipHint}</p> : null}
      {data.actionUrl ? (
        <EmailButton href={data.actionUrl}>{content.action}</EmailButton>
      ) : null}
      <p style={{ marginTop: 22 }}>
        If you did not request this action, you can ignore this message or
        contact PowerChain support.
      </p>
    </EmailTemplate>
  );
}
