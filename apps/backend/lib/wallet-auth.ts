import {
  createHmac,
  createPublicKey,
  randomBytes,
  timingSafeEqual,
  verify,
} from "node:crypto";
import {
  PublicKey,
} from "@solana/web3.js";
import {
  PowerChainError,
} from "@powerchain/utils/utils/errors";

const CHALLENGE_COOKIE =
  "pc_wallet_auth_challenge";
const SESSION_COOKIE =
  "pc_wallet_session";

type WalletChallenge = {
  address: string;
  nonce: string;
  issuedAt: string;
  expiresAt: string;
  requestId: string;
  cluster: "mainnet-beta" | "devnet";
  uri: string;
  message: string;
};

export type WalletSession = {
  wallet: string;
  chain: "solana";
  issuedAt: string;
  expiresAt: string;
};

function secret() {
  const value =
    process.env.BETTER_AUTH_SECRET?.trim();
  if (!value || value.length < 32) {
    throw new PowerChainError(
      "CONFIGURATION_ERROR",
      "BETTER_AUTH_SECRET must contain at least 32 characters",
    );
  }
  return value;
}

function encode(value: unknown): string {
  return Buffer.from(
    JSON.stringify(value),
    "utf8",
  ).toString("base64url");
}

function decode<T>(value: string): T {
  return JSON.parse(
    Buffer.from(value, "base64url").toString("utf8"),
  ) as T;
}

function mac(payload: string): string {
  return createHmac(
    "sha256",
    secret(),
  )
    .update(payload)
    .digest("base64url");
}

function signPayload(value: unknown): string {
  const payload = encode(value);
  return `${payload}.${mac(payload)}`;
}

function readSigned<T>(
  value: string | null,
): T | null {
  if (!value) return null;
  const dot = value.lastIndexOf(".");
  if (dot < 1) return null;

  const payload = value.slice(0, dot);
  const supplied = value.slice(dot + 1);
  const expected = mac(payload);

  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (
    a.length !== b.length ||
    !timingSafeEqual(a, b)
  ) {
    return null;
  }

  return decode<T>(payload);
}

function cookie(
  name: string,
  value: string,
  maxAge: number,
) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${Math.max(0, Math.floor(maxAge))}`,
  ];
  if (process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }
  return parts.join("; ");
}

function readCookie(
  request: Request,
  name: string,
) {
  const raw =
    request.headers.get("cookie") ?? "";

  for (const part of raw.split(";")) {
    const [key, ...rest] =
      part.trim().split("=");
    if (key === name) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return null;
}

function canonicalAppUrl(): string {
  const value =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "http://localhost:3000";
  return new URL(value).origin;
}

function cluster():
  | "mainnet-beta"
  | "devnet" {
  return process.env
    .NEXT_PUBLIC_SOLANA_CLUSTER === "devnet"
    ? "devnet"
    : "mainnet-beta";
}

export function createWalletChallenge(input: {
  address: string;
  requestId: string;
}) {
  const address =
    new PublicKey(input.address).toBase58();
  const issued = new Date();
  const expires =
    new Date(issued.getTime() + 5 * 60_000);
  const nonce =
    randomBytes(18).toString("base64url");
  const uri = canonicalAppUrl();
  const network = cluster();

  const message = [
    "PowerChain Launchpad wallet sign-in",
    "",
    `Wallet: ${address}`,
    `URI: ${uri}`,
    "Version: 1",
    `Chain: solana:${network}`,
    `Nonce: ${nonce}`,
    `Issued At: ${issued.toISOString()}`,
    `Expiration Time: ${expires.toISOString()}`,
    `Request ID: ${input.requestId}`,
    "",
    "Sign this message to prove wallet ownership. This does not authorize a transaction or transfer assets.",
  ].join("\n");

  const challenge: WalletChallenge = {
    address,
    nonce,
    issuedAt: issued.toISOString(),
    expiresAt: expires.toISOString(),
    requestId: input.requestId,
    cluster: network,
    uri,
    message,
  };

  return {
    challenge,
    cookie: cookie(
      CHALLENGE_COOKIE,
      signPayload(challenge),
      5 * 60,
    ),
  };
}

export function verifyWalletChallenge(input: {
  request: Request;
  address: string;
  message: string;
  signatureBase64: string;
}): WalletSession {
  const address =
    new PublicKey(input.address).toBase58();
  const signed = readCookie(
    input.request,
    CHALLENGE_COOKIE,
  );
  const challenge =
    readSigned<WalletChallenge>(signed);

  if (!challenge) {
    throw new PowerChainError(
      "UNAUTHORIZED",
      "Wallet sign-in challenge is missing or invalid",
    );
  }

  if (
    challenge.address !== address ||
    challenge.message !== input.message
  ) {
    throw new PowerChainError(
      "UNAUTHORIZED",
      "Wallet sign-in challenge does not match this request",
    );
  }

  if (
    challenge.uri !== canonicalAppUrl() ||
    challenge.cluster !== cluster()
  ) {
    throw new PowerChainError(
      "UNAUTHORIZED",
      "Wallet sign-in challenge is bound to a different deployment",
    );
  }

  const now = Date.now();
  const issued = Date.parse(
    challenge.issuedAt,
  );
  const expires = Date.parse(
    challenge.expiresAt,
  );

  if (
    !Number.isFinite(issued) ||
    !Number.isFinite(expires) ||
    now < issued - 30_000 ||
    now > expires
  ) {
    throw new PowerChainError(
      "UNAUTHORIZED",
      "Wallet sign-in challenge has expired",
    );
  }

  let signature: Buffer;
  try {
    signature = Buffer.from(
      input.signatureBase64,
      "base64",
    );
  } catch {
    throw new PowerChainError(
      "BAD_REQUEST",
      "Wallet signature is invalid",
    );
  }

  if (signature.length !== 64) {
    throw new PowerChainError(
      "BAD_REQUEST",
      "Wallet signature must be a 64-byte Ed25519 signature",
    );
  }

  const publicKey =
    new PublicKey(address).toBytes();

  // SubjectPublicKeyInfo prefix for an Ed25519 raw public key.
  const spkiPrefix = Buffer.from(
    "302a300506032b6570032100",
    "hex",
  );
  const key = createPublicKey({
    key: Buffer.concat([
      spkiPrefix,
      Buffer.from(publicKey),
    ]),
    format: "der",
    type: "spki",
  });

  const valid = verify(
    null,
    Buffer.from(input.message, "utf8"),
    key,
    signature,
  );

  if (!valid) {
    throw new PowerChainError(
      "UNAUTHORIZED",
      "Wallet signature verification failed",
    );
  }

  const issuedAt =
    new Date().toISOString();
  const expiresAt =
    new Date(
      Date.now() + 7 * 24 * 60 * 60_000,
    ).toISOString();

  return {
    wallet: address,
    chain: "solana",
    issuedAt,
    expiresAt,
  };
}

export function walletSessionCookie(
  session: WalletSession,
) {
  return cookie(
    SESSION_COOKIE,
    signPayload(session),
    7 * 24 * 60 * 60,
  );
}

export function clearWalletAuthCookies(
  headers = new Headers(),
) {
  headers.append(
    "set-cookie",
    cookie(CHALLENGE_COOKIE, "", 0),
  );
  headers.append(
    "set-cookie",
    cookie(SESSION_COOKIE, "", 0),
  );
  return headers;
}

export function readWalletSession(
  request: Request,
): WalletSession | null {
  const value = readSigned<WalletSession>(
    readCookie(
      request,
      SESSION_COOKIE,
    ),
  );
  if (!value) return null;
  if (
    value.chain !== "solana" ||
    Date.now() >
      Date.parse(value.expiresAt)
  ) {
    return null;
  }
  return value;
}
