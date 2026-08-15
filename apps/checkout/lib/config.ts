export type CheckoutConfig = {
  checkoutUrl: string;
  launchpadUrl: string;
  solanaCluster:
    | "devnet"
    | "mainnet-beta";
  solanaRpcUrl: string;
};

export function checkoutConfig(): CheckoutConfig {
  const checkoutUrl =
    process.env
      .NEXT_PUBLIC_CHECKOUT_URL ||
    "http://localhost:3002";
  const launchpadUrl =
    process.env
      .NEXT_PUBLIC_LAUNCHPAD_URL ||
    "http://localhost:3000";
  const cluster =
    process.env
      .NEXT_PUBLIC_SOLANA_CLUSTER ===
    "devnet"
      ? "devnet"
      : "mainnet-beta";
  const rpc =
    process.env
      .NEXT_PUBLIC_SOLANA_RPC_URL ||
    "http://localhost:3001/api/v1/solana/rpc";

  return {
    checkoutUrl,
    launchpadUrl,
    solanaCluster:
      cluster,
    solanaRpcUrl:
      rpc,
  };
}
