import { sha256Hex } from "@powerchain/token-data";

export async function settlementIdForMutation(mutationId: string): Promise<string> {
  const digest = await sha256Hex(`settlement:${mutationId}`);
  return `set_${digest.slice(0, 32)}`;
}

export async function outboxEventId(type: string, aggregateId: string): Promise<string> {
  const digest = await sha256Hex(`${type}:${aggregateId}`);
  return `evt_${digest.slice(0, 32)}`;
}
