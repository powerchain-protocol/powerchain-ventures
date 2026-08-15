export const CCTP_V2_SOLANA_DOMAIN =
  5 as const;

export const CCTP_V2_SOLANA_MESSAGE_TRANSMITTER_PROGRAM_ID =
  "CCTPV2Sm4AdWt5296sk4P66VBZ7bEhcARwFaaS9YPbeC" as const;

export const CCTP_V2_SOLANA_TOKEN_MESSENGER_MINTER_PROGRAM_ID =
  "CCTPV2vPZJS2u2BBsUoscuikbYjnpFmbFsvVuJdgUMQe" as const;

export type CctpEnvironment =
  | "mainnet"
  | "testnet";

export type CctpMessageStatus =
  | "pending"
  | "complete"
  | "failed";

export function cctpIrisBaseUrl(
  environment:
    CctpEnvironment,
) {
  return environment ===
    "mainnet"
    ? "https://iris-api.circle.com"
    : "https://iris-api-sandbox.circle.com";
}

export async function fetchCctpV2Messages(
  input: {
    environment:
      CctpEnvironment;
    sourceDomain: number;
    transactionHash: string;
    apiKey?: string;
    signal?: AbortSignal;
  },
) {
  if (
    !Number.isInteger(
      input.sourceDomain,
    ) ||
    input.sourceDomain <
      0
  ) {
    throw new Error(
      "invalid_cctp_source_domain",
    );
  }

  if (
    !input.transactionHash
      .trim()
  ) {
    throw new Error(
      "cctp_transaction_hash_required",
    );
  }

  const url =
    new URL(
      `/v2/messages/${input.sourceDomain}`,
      cctpIrisBaseUrl(
        input.environment,
      ),
    );

  url.searchParams.set(
    "transactionHash",
    input.transactionHash,
  );

  const init:
    RequestInit = {
    cache: "no-store",
    ...(input.signal
      ? {
          signal:
            input.signal,
        }
      : {}),
    ...(input.apiKey
      ? {
          headers: {
            authorization:
              `Bearer ${input.apiKey}`,
          },
        }
      : {}),
  };

  const response =
    await fetch(
      url,
      init,
    );

  if (!response.ok) {
    throw new Error(
      `cctp_iris_${response.status}`,
    );
  }

  return response.json() as
    Promise<{
      messages?: Array<{
        message?: string;
        attestation?: string;
        status?: string;
        eventNonce?: string;
      }>;
    }>;
}
