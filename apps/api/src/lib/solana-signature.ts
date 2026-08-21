import bs58 from "bs58";
export function decodeBase58Signature(signature: string) {
  const decoded = bs58.decode(signature);
  if (decoded.length !== 64) throw new Error("Invalid Ed25519 signature length");
  return decoded;
}
