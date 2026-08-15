import {
  createDAppKit,
} from "@mysten/dapp-kit-react";
import {
  SuiGrpcClient,
} from "@mysten/sui/grpc";

const mainnetUrl =
  process.env.NEXT_PUBLIC_SUI_GRPC_URL?.trim() ||
  "https://fullnode.mainnet.sui.io:443";

const testnetUrl =
  process.env.NEXT_PUBLIC_SUI_TESTNET_GRPC_URL?.trim() ||
  "https://fullnode.testnet.sui.io:443";

export const suiDAppKit =
  createDAppKit({
    networks: [
      "mainnet",
      "testnet",
    ],
    createClient(network) {
      return new SuiGrpcClient({
        network,
        baseUrl:
          network === "mainnet"
            ? mainnetUrl
            : testnetUrl,
      });
    },
  });

declare module "@mysten/dapp-kit-react" {
  interface Register {
    dAppKit: typeof suiDAppKit;
  }
}
