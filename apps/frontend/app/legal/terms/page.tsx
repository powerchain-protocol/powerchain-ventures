import { InfoPage } from "../../../components/content/info-page";

export const metadata = { title: "Terms of use" };

export default function Page() {
  return (
    <InfoPage
      eyebrow={"Legal"}
      title={"Terms of use"}
      intro={"Using PowerChain Launchpad means you are responsible for reviewing the sale, network, wallet and transaction details before signing."}
      sections={[
        {
                "title": "No custody",
                "body": "PowerChain does not take custody of your wallet credentials. You remain responsible for wallet access and approvals."
        },
        {
                "title": "Token-sale risk",
                "body": "Token sales and digital assets can be volatile and may carry technical, market and regulatory risk. Verify each project independently."
        },
        {
                "title": "Transaction finality",
                "body": "A submitted signature is not treated as settlement by PowerChain until required Solana and backend verification succeeds."
        }
]}
    />
  );
}
