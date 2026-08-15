import type {
  Metadata,
} from "next";
import "./styles.css";
import {
  Providers,
} from "./providers";

export const metadata:
  Metadata = {
  title: {
    default:
      "PowerChain Checkout",
    template:
      "%s · PowerChain Checkout",
  },
  description:
    "Secure PowerChain Launchpad payment and Solana purchase review.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
