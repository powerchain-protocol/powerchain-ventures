"use client";

import {
  LinkedWallets,
} from "./linked-wallets";
import {
  Card,
  CardBody,
  CardHeader,
} from "../ui/card";
import {
  Information,
} from "../ui/information";
import {
  Badge,
} from "../ui/badge";
import {
  useAuth,
} from "../../context/auth-context";

export function AccountSecurity() {
  const auth = useAuth();

  return (
    <div className="account-security-grid">
      <Card>
        <CardHeader
          eyebrow="Session"
          title="Account security"
          description="Authentication state and linked identity controls."
          action={
            <Badge
              tone={
                auth.authenticated
                  ? "success"
                  : "neutral"
              }
            >
              {auth.authenticated
                ? "Authenticated"
                : "Signed out"}
            </Badge>
          }
        />

        <CardBody>
          <Information
            title="Wallet custody remains separate"
            tone="info"
            compact
          >
            Account authentication never grants PowerChain custody of wallet private keys or seed phrases.
          </Information>
        </CardBody>
      </Card>

      {auth.authType === "account" ||
      auth.authType === "linked-wallet" ? (
        <Card>
          <CardHeader
            eyebrow="Wallet identity"
            title="Linked wallets"
            description="Wallets linked to this account through verified ownership."
          />
          <CardBody>
            <LinkedWallets />
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}
