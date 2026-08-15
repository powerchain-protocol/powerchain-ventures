import type {
  Metadata,
} from "next";
import {
  AccountSecurity,
} from "../../components/account/account-security";

export const metadata: Metadata = {
  title: "Account",
  description:
    "Manage PowerChain account security and linked wallets.",
};

export default function AccountPage() {
  return (
    <main className="page account-page">
      <header className="page-heading">
        <span className="eyebrow">
          Account
        </span>
        <h1>
          Security and wallet identity
        </h1>
        <p>
          Review your PowerChain account session and verified wallet links.
        </p>
      </header>

      <AccountSecurity />
    </main>
  );
}
