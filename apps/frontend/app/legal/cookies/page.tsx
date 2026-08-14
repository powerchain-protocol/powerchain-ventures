import { InfoPage } from "../../../components/content/info-page";

export const metadata = { title: "Cookie notice" };

export default function Page() {
  return (
    <InfoPage
      eyebrow={"Legal"}
      title={"Cookie notice"}
      intro={"PowerChain uses a small set of essential browser cookies and local state for secure sessions and product continuity."}
      sections={[
        {
                "title": "Authentication",
                "body": "HttpOnly session cookies may be used for authenticated account routes."
        },
        {
                "title": "Onboarding",
                "body": "A first-run onboarding cookie records completion on mobile so the flow is not shown repeatedly."
        },
        {
                "title": "Preferences",
                "body": "Local browser storage may retain non-secret interface preferences or unfinished creator drafts."
        }
]}
    />
  );
}
