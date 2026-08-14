export type EmbeddedWalletStatus = "unavailable" | "ready" | "connecting" | "connected" | "error";
export type EmbeddedWalletProvider = "browser" | "passkey" | "custodial-adapter";
export type EmbeddedWalletDescriptor = { id:string; name:string; provider:EmbeddedWalletProvider; status:EmbeddedWalletStatus; address?:string; description:string };
export type EmbeddedWalletSession = { providerId:string; address:string; connectedAt:string };
