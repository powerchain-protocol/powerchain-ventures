import { InfoPage } from "../../components/content/info-page";

export const metadata = { title: "Settings" };

export default function Page() {
  return (
    <InfoPage
      eyebrow={"Preferences"}
      title={"Settings"}
      intro={"Manage local Launchpad preferences without exposing wallet private keys or server credentials."}
      sections={[
        {
                "title": "Network",
                "body": "The active browser network comes from the public Solana runtime configuration. Production mainnet must use an approved browser-safe RPC endpoint."
        },
        {
                "title": "Wallet",
                "body": "Wallet connections use the Solana wallet-standard ecosystem. Disconnecting clears the active connection but never transfers custody to PowerChain.",
                "href": "/wallet",
                "hrefLabel": "Wallet Center"
        },
        {
                "title": "Account",
                "body": "Account identity and wallet custody remain separate. Creator-account actions are available from the Account page.",
                "href": "/account",
                "hrefLabel": "Account settings"
        }
]}
    />
  );
}
