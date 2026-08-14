export const TOKEN_2022_PROGRAM_ID = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
export function explorerTx(signature: string, cluster: "devnet"|"mainnet-beta" = "devnet") {
  const suffix = cluster === "devnet" ? "?cluster=devnet" : "";
  return `https://explorer.solana.com/tx/${encodeURIComponent(signature)}${suffix}`;
}
export async function rpcCall<T>(rpcUrl: string, method: string, params: unknown[] = [], timeoutMs = 10_000): Promise<T> {
  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(rpcUrl, {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:1,method,params}),signal:controller.signal});
    if (!res.ok) throw new Error(`RPC HTTP ${res.status}`);
    const json = await res.json() as {result?:T;error?:{message?:string}};
    if (json.error) throw new Error(json.error.message ?? "RPC error");
    if (json.result === undefined) throw new Error("RPC result missing");
    return json.result;
  } finally { clearTimeout(timer); }
}

function readCompactU16(bytes: Uint8Array, offset = 0) {
  let value = 0, shift = 0, index = offset;
  for (let i = 0; i < 3; i++) {
    if (index >= bytes.length) throw new Error("transaction_shortvec_truncated");
    const byte = bytes[index++]!;
    value |= (byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) return {value, next: index};
    shift += 7;
  }
  throw new Error("transaction_shortvec_invalid");
}

/** Returns the exact serialized Solana message, excluding transaction signatures. */
export function transactionMessageBytes(serialized: Uint8Array) {
  if (serialized.length < 2) throw new Error("transaction_too_short");
  const signatures = readCompactU16(serialized, 0);
  if (signatures.value < 1 || signatures.value > 64) throw new Error("transaction_signature_count_invalid");
  const messageOffset = signatures.next + (signatures.value * 64);
  if (messageOffset >= serialized.length) throw new Error("transaction_message_missing");
  return serialized.slice(messageOffset);
}
