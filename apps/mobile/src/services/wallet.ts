import { Linking, Platform } from "react-native";
import { mobileEnv } from "@/lib/env";
export type MobileWalletSession={address:string;provider:"phantom"|"solflare"|"backpack"|"watch";canSign:boolean};
export function validateSolanaAddress(value:string){return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value.trim())}
export async function openWalletProvider(provider:"phantom"|"solflare"|"backpack"){
  const urls={phantom:"https://phantom.app/",solflare:"https://solflare.com/",backpack:"https://backpack.app/"}; await Linking.openURL(urls[provider]);
}
export async function requestTransactionSigning(_base64:string):Promise<never>{
  throw new Error(Platform.OS === "android" ? "Native Solana signing adapter is not configured. Install the approved Mobile Wallet Adapter provider in this production build." : "Native Solana signing adapter is not configured. Use an approved iOS wallet deep-link/Wallet Standard adapter in this production build.");
}
export const walletNetwork={cluster:mobileEnv.solanaCluster,rpcUrl:mobileEnv.solanaRpcUrl};
