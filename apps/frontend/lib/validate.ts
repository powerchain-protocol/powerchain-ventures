const SOLANA=/^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
export function isSolanaAddress(value:string){return SOLANA.test(value.trim())}
export function validateWalletAddress(value:string){const out=value.trim();if(!isSolanaAddress(out))throw new Error("Invalid Solana wallet address");return out}
export function validateUsdMicros(value:string){if(!/^[1-9][0-9]*$/.test(value))throw new Error("Amount must be a positive integer in USD micros");return BigInt(value)}
export function validateSignature(value:string){const out=value.trim();if(!/^[1-9A-HJ-NP-Za-km-z]{80,100}$/.test(out))throw new Error("Invalid Solana transaction signature");return out}
