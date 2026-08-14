import { InfoPage } from "../../components/content/info-page";

export const metadata = { title: "Security" };

export default function Page() {
  return (
    <InfoPage
      eyebrow={"Trust & safety"}
      title={"Security"}
      intro={"PowerChain Launchpad is designed around explicit wallet approval, server-owned settlement rules and fail-closed production configuration."}
      sections={[
        {
                "title": "Non-custodial",
                "body": "The application never asks for a seed phrase or private key. Wallets sign locally."
        },
        {
                "title": "Exact transaction review",
                "body": "Purchases, claims and creator lifecycle actions are reviewed before signing and verified against confirmed Solana transaction evidence.",
                "href": "/review",
                "hrefLabel": "Transaction review"
        },
        {
                "title": "Server secrets",
                "body": "Database credentials, provider API keys, quote authority keys and transaction-builder secrets remain server-only."
        }
]}
    />
  );
}
