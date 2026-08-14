import { InfoPage } from "../../components/content/info-page";

export const metadata = { title: "Vesting" };

export default function Page() {
  return (
    <InfoPage
      eyebrow={"Claims"}
      title={"Vesting"}
      intro={"PowerChain supports delayed claims, cliffs and linear vesting without treating a wallet signature as settlement."}
      sections={[
        {
                "title": "Claim schedule",
                "body": "Each entitlement is derived from the canonical purchase and configured claim start, cliff and duration."
        },
        {
                "title": "Claimable amount",
                "body": "The claim flow displays purchased, vested, previously claimed and currently available amounts.",
                "href": "/claims",
                "hrefLabel": "Open claims"
        },
        {
                "title": "No PowerChain claim fee",
                "body": "Claims charge 0% PowerChain service fee. Normal Solana network or account costs can still apply."
        }
]}
    />
  );
}
