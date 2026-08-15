import { EmailTemplate } from "./email-template.js";
import type { ContactEmailData } from "./types.js";

export function ContactEmailTemplate({
  data,
}: {
  data: ContactEmailData;
}) {
  return (
    <EmailTemplate
      eyebrow="PowerChain Launchpad"
      title={`Contact request: ${data.subject}`}
      footer={`Request ID: ${data.requestId ?? "not supplied"}`}
    >
      <p><strong>From:</strong> {data.name} &lt;{data.email}&gt;</p>
      <p style={{ whiteSpace: "pre-wrap" }}>{data.message}</p>
    </EmailTemplate>
  );
}
