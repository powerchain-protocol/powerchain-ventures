import type {
  HealthState,
  LaunchAuthoritySummary,
  LaunchHealthReport,
  LaunchHealthSignal,
  LaunchOperationsOverview,
  LaunchTimelineItem,
  LaunchTreasurySummary
} from "@powerchain/types";
import { env } from "../env/index.js";
import { AppError } from "../common/errors.js";
import { createId } from "../common/ids.js";
import { launchRepository } from "../repositories/launch-repository.js";
import { buildReadiness } from "./readiness-service.js";

async function database() { return (await import("../lib/prisma.js")).prisma; }

type LaunchView = {
  id: string; slug: string; name: string; status: string; category?: string | null;
  raisedUsd: number; targetUsd: number; participants: number; allocatedTokens: number;
  readiness: number; health: HealthState; tokenMint?: string | null; treasuryWallet?: string | null; settlementAsset?: string | null;
  phases?: Array<{ id?: string; name?: string; price: number; allocation: number; minContribution?: number | null; maxContribution?: number | null; startsAt?: string | null; endsAt?: string | null; status?: string }>;
};

function asLaunchView(value: unknown): LaunchView { return value as LaunchView; }

const rank: Record<HealthState, number> = { HEALTHY: 0, WATCH: 1, ATTENTION: 2, CRITICAL: 3 };
function worst(states: HealthState[]): HealthState {
  return states.reduce<HealthState>((current, next) => rank[next] > rank[current] ? next : current, "HEALTHY");
}

export async function getLaunchAuthorities(launchId: string): Promise<LaunchAuthoritySummary[]> {
  const launch = await launchRepository.findById(launchId);
  if (!launch) throw new AppError("launch_not_found", "Launch not found.", 404);
  const view = asLaunchView(launch);
  if (env.POWERCHAIN_DATA_MODE === "mock") {
    return [
      { type: "TOKEN_MINT", address: view.tokenMint ?? null, controlType: view.tokenMint ? "mint-configured" : "unconfigured", revoked: false },
      { type: "SALE_CONFIGURATION", address: null, controlType: "authorized-wallet", revoked: false },
      { type: "TREASURY", address: view.treasuryWallet ?? null, controlType: view.treasuryWallet ? "wallet-or-multisig" : "unconfigured", revoked: false },
      { type: "VESTING", address: env.POWERCHAIN_LAUNCHPAD_PROGRAM_ID || null, controlType: "program-controlled", revoked: false }
    ];
  }
  const prisma = await database();
  const row = await prisma.launch.findUnique({ where: { id: view.id }, select: { authorities: { orderBy: { type: "asc" } } } });
  return (row?.authorities ?? []).map((authority) => ({
    type: authority.type,
    address: authority.address,
    controlType: authority.controlType,
    revoked: authority.revoked,
    verifiedAt: authority.verifiedAt?.toISOString() ?? null
  }));
}

export async function getLaunchTreasury(launchId: string): Promise<LaunchTreasurySummary> {
  const launch = await launchRepository.findById(launchId);
  if (!launch) throw new AppError("launch_not_found", "Launch not found.", 404);
  const view = asLaunchView(launch);
  if (env.POWERCHAIN_DATA_MODE === "mock") {
    return {
      launchId: view.id,
      settlementAsset: view.settlementAsset ?? "USDC",
      treasuryWallet: view.treasuryWallet ?? null,
      totalRaised: Number(view.raisedUsd || 0),
      pendingSettlement: 0,
      settled: Number(view.raisedUsd || 0),
      reconciled: Number(view.raisedUsd || 0),
      failed: 0
    };
  }
  const prisma = await database();
  const [participations, settlements] = await Promise.all([
    prisma.participation.aggregate({ where: { launchId: view.id, status: "CONFIRMED" }, _sum: { contribution: true } }),
    prisma.settlement.findMany({ where: { launchId: view.id }, select: { netAmount: true, status: true } })
  ]);
  let pendingSettlement = 0, settled = 0, reconciled = 0, failed = 0;
  for (const settlement of settlements) {
    const amount = Number(settlement.netAmount);
    if (settlement.status === "PENDING" || settlement.status === "SUBMITTED") pendingSettlement += amount;
    if (settlement.status === "CONFIRMED" || settlement.status === "RECONCILED") settled += amount;
    if (settlement.status === "RECONCILED") reconciled += amount;
    if (settlement.status === "FAILED") failed += amount;
  }
  return {
    launchId: view.id,
    settlementAsset: view.settlementAsset ?? "USDC",
    treasuryWallet: view.treasuryWallet ?? null,
    totalRaised: Number(participations._sum.contribution ?? 0),
    pendingSettlement,
    settled,
    reconciled,
    failed
  };
}

export async function getLaunchTimeline(launchId: string): Promise<LaunchTimelineItem[]> {
  const launch = await launchRepository.findById(launchId);
  if (!launch) throw new AppError("launch_not_found", "Launch not found.", 404);
  const view = asLaunchView(launch);
  if (env.POWERCHAIN_DATA_MODE === "mock") {
    const items: LaunchTimelineItem[] = [{ id: createId(), kind: "configuration", title: "Launch configuration created", status: "complete", at: null }];
    for (const phase of view.phases ?? []) items.push({ id: phase.id || createId(), kind: "phase", title: phase.name || "Sale phase", status: phase.status || "DRAFT", at: phase.startsAt ?? null, metadata: { endsAt: phase.endsAt ?? null, allocation: phase.allocation, price: phase.price } });
    if (view.status === "LIVE") items.push({ id: createId(), kind: "launch", title: "Launch activated", status: "LIVE", at: null });
    return items;
  }
  const prisma = await database();
  const row = await prisma.launch.findUnique({
    where: { id: view.id },
    select: {
      createdAt: true,
      status: true,
      phases: { orderBy: [{ startsAt: "asc" }, { createdAt: "asc" }], select: { id: true, name: true, status: true, startsAt: true, endsAt: true, price: true, allocation: true } },
      transactions: { orderBy: { createdAt: "desc" }, take: 50, select: { id: true, kind: true, status: true, signature: true, createdAt: true } },
      settlements: { orderBy: { createdAt: "desc" }, take: 25, select: { id: true, status: true, asset: true, netAmount: true, txSignature: true, createdAt: true } },
      auditEvents: { orderBy: { createdAt: "desc" }, take: 50, select: { id: true, action: true, resource: true, createdAt: true, metadata: true } }
    }
  });
  if (!row) return [];
  const items: LaunchTimelineItem[] = [
    { id: `${view.id}:created`, kind: "configuration", title: "Launch configuration created", status: "complete", at: row.createdAt.toISOString() }
  ];
  for (const phase of row.phases) items.push({ id: phase.id, kind: "phase", title: phase.name, status: phase.status, at: phase.startsAt?.toISOString() ?? null, metadata: { endsAt: phase.endsAt?.toISOString() ?? null, price: Number(phase.price), allocation: Number(phase.allocation) } });
  for (const tx of row.transactions) items.push({ id: tx.id, kind: "transaction", title: tx.kind.replaceAll("_", " ").toLowerCase(), status: tx.status, at: tx.createdAt.toISOString(), signature: tx.signature });
  for (const settlement of row.settlements) items.push({ id: settlement.id, kind: "settlement", title: `${settlement.asset} settlement`, status: settlement.status, at: settlement.createdAt.toISOString(), signature: settlement.txSignature, metadata: { amount: Number(settlement.netAmount) } });
  for (const event of row.auditEvents) items.push({ id: event.id, kind: "activity", title: `${event.action} · ${event.resource}`, status: "recorded", at: event.createdAt.toISOString(), metadata: (event.metadata as Record<string, unknown> | null) ?? undefined });
  return items.sort((a, b) => (b.at ? Date.parse(b.at) : 0) - (a.at ? Date.parse(a.at) : 0)).slice(0, 100);
}

export async function getLaunchHealth(launchId: string): Promise<LaunchHealthReport> {
  const launch = await launchRepository.findById(launchId);
  if (!launch) throw new AppError("launch_not_found", "Launch not found.", 404);
  const view = asLaunchView(launch);
  const readiness = await buildReadiness(view.id);
  const treasury = await getLaunchTreasury(view.id);
  let failedTransactions = 0, totalTransactions = 0;
  if (env.POWERCHAIN_DATA_MODE === "database") {
    const prisma = await database();
    const tx = await prisma.chainTransaction.groupBy({ where: { launchId: view.id }, by: ["status"], _count: { _all: true } });
    totalTransactions = tx.reduce((sum, item) => sum + item._count._all, 0);
    failedTransactions = tx.filter((item) => item.status === "FAILED" || item.status === "REJECTED").reduce((sum, item) => sum + item._count._all, 0);
  }
  const txFailureRate = totalTransactions ? failedTransactions / totalTransactions : 0;
  const target = Number(view.targetUsd || 0);
  const raised = Number(view.raisedUsd || 0);
  const allocation = Number(view.allocatedTokens || 0);
  const signals: LaunchHealthSignal[] = [
    {
      key: "participation", label: "Participation",
      state: view.status === "LIVE" && Number(view.participants || 0) === 0 ? "WATCH" : "HEALTHY",
      summary: view.status === "LIVE" && Number(view.participants || 0) === 0 ? "Launch is live with no confirmed participants yet." : `${Number(view.participants || 0).toLocaleString()} confirmed participants.`
    },
    {
      key: "allocation", label: "Allocation", state: allocation > 0 ? "HEALTHY" : "ATTENTION",
      summary: allocation > 0 ? `${allocation.toLocaleString()} tokens configured across sale phases.` : "No sale allocation is configured."
    },
    {
      key: "treasury", label: "Treasury", state: treasury.failed > 0 ? "ATTENTION" : treasury.pendingSettlement > 0 ? "WATCH" : "HEALTHY",
      summary: treasury.failed > 0 ? `${treasury.failed.toLocaleString()} ${treasury.settlementAsset} is associated with failed settlement records.` : treasury.pendingSettlement > 0 ? `${treasury.pendingSettlement.toLocaleString()} ${treasury.settlementAsset} pending settlement.` : "No failed settlement balance detected."
    },
    {
      key: "transactions", label: "Transactions", state: txFailureRate >= 0.2 ? "CRITICAL" : txFailureRate >= 0.05 ? "ATTENTION" : txFailureRate > 0 ? "WATCH" : "HEALTHY",
      summary: totalTransactions ? `${failedTransactions} of ${totalTransactions} recorded transactions failed or were rejected.` : "No failed recorded transaction detected."
    },
    {
      key: "configuration", label: "Configuration", state: readiness.blockingIssues > 0 ? "ATTENTION" : readiness.score < 100 ? "WATCH" : "HEALTHY",
      summary: readiness.blockingIssues > 0 ? `${readiness.blockingIssues} blocking readiness issue${readiness.blockingIssues === 1 ? "" : "s"}.` : `Launch readiness is ${readiness.score}%.`,
      detail: target > 0 ? `${raised.toLocaleString()} of ${target.toLocaleString()} target recorded.` : undefined
    }
  ];
  return { launchId: view.id, state: worst(signals.map((signal) => signal.state)), generatedAt: new Date().toISOString(), signals };
}

export async function getLaunchOperationsOverview(launchId: string): Promise<LaunchOperationsOverview> {
  const launch = await launchRepository.findById(launchId);
  if (!launch) throw new AppError("launch_not_found", "Launch not found.", 404);
  const view = asLaunchView(launch);
  const [readiness, health, treasury, authorities, timeline] = await Promise.all([
    buildReadiness(view.id), getLaunchHealth(view.id), getLaunchTreasury(view.id), getLaunchAuthorities(view.id), getLaunchTimeline(view.id)
  ]);
  return { launch: { ...view, readiness: readiness.score, health: health.state }, readiness, health, treasury, authorities, timeline } as LaunchOperationsOverview;
}
