import {
  authPool,
} from "./better-auth";

export type LinkedWalletRecord = {
  address: string;
  chain: "solana" | "sui";
  provider: string;
  lastAuthenticatedAt: string | null;
  createdAt: string;
};

export async function recordWalletIdentity(input: {
  wallet: string;
  chain?: "solana" | "sui";
  authUserId?: string | null;
  provider?: string;
}) {
  if (!authPool) return;

  await authPool.query(
    `
      insert into powerchain_wallet_accounts
        (
          wallet_address,
          chain,
          auth_user_id,
          provider,
          last_authenticated_at
        )
      values ($1, $2, $3, $4, now())
      on conflict (chain, wallet_address)
      do update set
        auth_user_id =
          coalesce(
            excluded.auth_user_id,
            powerchain_wallet_accounts.auth_user_id
          ),
        provider = excluded.provider,
        last_authenticated_at = now(),
        updated_at = now()
    `,
    [
      input.wallet,
      input.chain ?? "solana",
      input.authUserId ?? null,
      input.provider ?? "wallet-signature",
    ],
  );
}

export async function walletsForUser(
  authUserId: string,
): Promise<LinkedWalletRecord[]> {
  if (!authPool) return [];

  const result = await authPool.query<{
    wallet_address: string;
    chain: "solana" | "sui";
    provider: string;
    last_authenticated_at: Date | null;
    created_at: Date;
  }>(
    `
      select
        wallet_address,
        chain,
        provider,
        last_authenticated_at,
        created_at
      from powerchain_wallet_accounts
      where auth_user_id = $1
      order by updated_at desc
    `,
    [authUserId],
  );

  return result.rows.map(row => ({
    address: row.wallet_address,
    chain: row.chain,
    provider: row.provider,
    lastAuthenticatedAt:
      row.last_authenticated_at?.toISOString() ?? null,
    createdAt: row.created_at.toISOString(),
  }));
}

export async function unlinkWallet(input: {
  authUserId: string;
  chain: "solana" | "sui";
  wallet: string;
}) {
  if (!authPool) return false;

  const result = await authPool.query(
    `
      delete from powerchain_wallet_accounts
      where
        auth_user_id = $1
        and chain = $2
        and wallet_address = $3
    `,
    [
      input.authUserId,
      input.chain,
      input.wallet,
    ],
  );

  return (result.rowCount ?? 0) > 0;
}
