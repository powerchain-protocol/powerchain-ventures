import { InfoPage } from "../../components/content/info-page";

export const metadata = { title: "Launchpad documentation" };

export default function Page() {
  return (
    <InfoPage
      eyebrow={"Documentation"}
      title={"Launchpad documentation"}
      intro={"Understand the PowerChain Launchpad lifecycle, wallet flows, Token-2022 execution and operational boundaries."}
      sections={[
        {
                "title": "Sales and checkout",
                "body": "Browse public sales, review exact quote terms and approve the final Solana transaction only after checking recipients, amounts and fees.",
                "href": "/sales",
                "hrefLabel": "Open sales"
        },
        {
                "title": "Creator operations",
                "body": "Creator tools cover Token-2022 validation, timing, eligibility, vesting, activation and lifecycle controls.",
                "href": "/create",
                "hrefLabel": "Create a sale"
        },
        {
                "title": "Wallet and claims",
                "body": "The Wallet Center remains non-custodial. Claims expose vested and currently claimable balances before signing.",
                "href": "/wallet",
                "hrefLabel": "Open Wallet Center"
        }
]}
    />
  );
}
