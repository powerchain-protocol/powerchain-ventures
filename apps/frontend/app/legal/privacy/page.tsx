import { InfoPage } from "../../../components/content/info-page";

export const metadata = { title: "Privacy notice" };

export default function Page() {
  return (
    <InfoPage
      eyebrow={"Legal"}
      title={"Privacy notice"}
      intro={"PowerChain processes only the information required to operate accounts, secure requests and provide Launchpad functionality. Wallet private keys and seed phrases are never collected."}
      sections={[
        {
                "title": "Wallet data",
                "body": "Public wallet addresses and on-chain activity may be displayed because they are part of the Solana ledger. Connecting a wallet does not grant PowerChain custody."
        },
        {
                "title": "Account data",
                "body": "If you create an account, account identifiers and profile metadata may be stored to provide creator functionality and session security."
        },
        {
                "title": "Operational data",
                "body": "Security logs, request identifiers and rate-limit metadata may be retained to protect the service and investigate failures."
        }
]}
    />
  );
}
