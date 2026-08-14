import { InfoPage } from "../../components/content/info-page";

export const metadata = { title: "Eligibility" };

export default function Page() {
  return (
    <InfoPage
      eyebrow={"Participation"}
      title={"Eligibility"}
      intro={"Eligibility is evaluated before restricted-sale participation and again where required by the sale policy."}
      sections={[
        {
                "title": "Public sales",
                "body": "Public sales accept valid connected Solana wallets while still enforcing sale timing, allocation and wallet purchase limits."
        },
        {
                "title": "Allowlists and trusted wallets",
                "body": "Restricted sales require the wallet to satisfy the configured trusted-wallet or allowlist rule. Invalid or duplicate imported records never become eligible automatically."
        },
        {
                "title": "Before signing",
                "body": "Eligibility does not replace transaction review. Always verify the exact sale, amount, fee recipient and network before approval.",
                "href": "/sales",
                "hrefLabel": "Browse sales"
        }
]}
    />
  );
}
