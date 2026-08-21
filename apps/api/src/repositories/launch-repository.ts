import { validate as isUuid } from "uuid";
import { env } from "../lib/env.js";
import { launchFixtures } from "../data/launch-fixtures.js";
import { createId } from "../common/ids.js";

async function database() { return (await import("../lib/prisma.js")).prisma; }

type PhaseInput = {
  name: string;
  price: number;
  allocation: number;
  minContribution?: number;
  maxContribution?: number;
  startsAt?: string;
  endsAt?: string;
};

type MockLaunch = (typeof launchFixtures)[number] & {
  description?: string;
  tokenMint?: string;
  treasuryWallet?: string;
  settlementAsset?: string;
  txSignature?: string;
  creatorId?: string;
  phases?: Array<PhaseInput & { id: string; status: "DRAFT" | "SCHEDULED" | "LIVE" | "PAUSED" | "ENDED" }>;
};

const mockCreated = new Map<string, MockLaunch>();
function mockFind(id: string) {
  return mockCreated.get(id)
    ?? [...mockCreated.values()].find((row) => row.slug === id)
    ?? launchFixtures.find((row) => row.id === id || row.slug === id)
    ?? null;
}

function summarize(row: {
  id: string; slug: string; name: string; status: string; category: string | null; description?: string | null; tokenMint?: string | null; treasuryWallet?: string | null;
  settlementAsset?: string | null; targetAmount?: unknown; _count?: { participations: number };
  phases?: Array<{ allocation: unknown; id?: string; name?: string; price?: unknown; minContribution?: unknown; maxContribution?: unknown; startsAt?: Date | null; endsAt?: Date | null; status?: string }>;
  participations?: Array<{ contribution: unknown }>;
}) {
  const phases = row.phases ?? [];
  const participations = row.participations ?? [];
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    status: row.status,
    category: row.category,
    raisedUsd: participations.reduce((sum, item) => sum + Number(item.contribution), 0),
    targetUsd: Number(row.targetAmount ?? 0),
    participants: row._count?.participations ?? 0,
    allocatedTokens: phases.reduce((sum, item) => sum + Number(item.allocation), 0),
    readiness: 0,
    health: "HEALTHY" as const,
    description: row.description ?? undefined,
    tokenMint: row.tokenMint ?? undefined,
    treasuryWallet: row.treasuryWallet ?? undefined,
    settlementAsset: row.settlementAsset ?? undefined,
    phases: phases.map((phase) => ({
      id: phase.id,
      name: phase.name,
      price: Number(phase.price ?? 0),
      allocation: Number(phase.allocation ?? 0),
      minContribution: phase.minContribution == null ? null : Number(phase.minContribution),
      maxContribution: phase.maxContribution == null ? null : Number(phase.maxContribution),
      startsAt: phase.startsAt instanceof Date ? phase.startsAt.toISOString() : phase.startsAt,
      endsAt: phase.endsAt instanceof Date ? phase.endsAt.toISOString() : phase.endsAt,
      status: phase.status
    }))
  };
}

export const launchRepository = {
  async list() {
    if (env.POWERCHAIN_DATA_MODE === "mock") return [...mockCreated.values(), ...launchFixtures];
    const prisma = await database();
    const rows = await prisma.launch.findMany({
      orderBy: { createdAt: "desc" }, take: 100,
      include: {
        _count: { select: { participations: true } },
        phases: { select: { id: true, name: true, price: true, allocation: true, minContribution: true, maxContribution: true, startsAt: true, endsAt: true, status: true } },
        participations: { where: { status: "CONFIRMED" }, select: { contribution: true } }
      }
    });
    return rows.map(summarize);
  },

  async findById(id: string) {
    if (env.POWERCHAIN_DATA_MODE === "mock") return mockFind(id);
    const prisma = await database();
    const row = await prisma.launch.findFirst({
      where: isUuid(id) ? { OR: [{ id }, { slug: id }] } : { slug: id },
      include: {
        _count: { select: { participations: true } },
        phases: { select: { id: true, name: true, price: true, allocation: true, minContribution: true, maxContribution: true, startsAt: true, endsAt: true, status: true } },
        participations: { where: { status: "CONFIRMED" }, select: { contribution: true } }
      }
    });
    return row ? summarize(row) : null;
  },

  async canManage(id: string, userId: string) {
    if (env.POWERCHAIN_DATA_MODE === "mock") return mockFind(id)?.creatorId === userId;
    const prisma = await database();
    return Boolean(await prisma.launch.findFirst({
      where: isUuid(id) ? { creatorId: userId, OR: [{ id }, { slug: id }] } : { creatorId: userId, slug: id },
      select: { id: true }
    }));
  },

  async markLive(id: string, signature: string) {
    if (env.POWERCHAIN_DATA_MODE === "mock") {
      const launch = mockFind(id); if (!launch) return null;
      const updated = { ...launch, status: "LIVE" as const, txSignature: signature } as MockLaunch;
      mockCreated.set(updated.id, updated);
      return updated;
    }
    const prisma = await database();
    const existing = await prisma.launch.findFirst({ where: isUuid(id) ? { OR: [{ id }, { slug: id }] } : { slug: id } });
    if (!existing) return null;
    const row = await prisma.launch.update({
      where: { id: existing.id },
      data: {
        status: "LIVE",
        phases: { updateMany: { where: { status: { in: ["DRAFT", "SCHEDULED"] } }, data: { status: "LIVE" } } },
        transactions: { create: { kind: "ACTIVATE_LAUNCH", status: "CONFIRMED", signature } }
      },
      include: {
        _count: { select: { participations: true } },
        phases: { select: { id: true, name: true, price: true, allocation: true, minContribution: true, maxContribution: true, startsAt: true, endsAt: true, status: true } },
        participations: { where: { status: "CONFIRMED" }, select: { contribution: true } }
      }
    });
    return { ...summarize(row), readiness: 100 };
  },

  async create(input: {
    name: string; slug: string; description?: string; category?: string; tokenMint?: string; treasuryWallet?: string; targetAmount?: number;
    settlementAsset: "USDC" | "SOL"; creatorId?: string; phase?: PhaseInput;
  }) {
    if (env.POWERCHAIN_DATA_MODE === "mock") {
      const id = createId();
      const phases = input.phase ? [{ ...input.phase, id: createId(), status: "DRAFT" as const }] : [];
      const row: MockLaunch = {
        id, slug: input.slug, name: input.name, status: "DRAFT", category: input.category ?? null,
        raisedUsd: 0, targetUsd: input.targetAmount ?? 0, participants: 0,
        allocatedTokens: phases.reduce((sum, phase) => sum + phase.allocation, 0), readiness: 50, health: "HEALTHY",
        description: input.description, tokenMint: input.tokenMint, treasuryWallet: input.treasuryWallet,
        settlementAsset: input.settlementAsset, creatorId: input.creatorId, phases
      };
      mockCreated.set(id, row);
      return row;
    }
    const prisma = await database();
    const { phase, ...launch } = input;
    const row = await prisma.launch.create({
      data: {
        ...launch,
        targetAmount: launch.targetAmount,
        ...(phase ? { phases: { create: {
          name: phase.name,
          price: phase.price,
          allocation: phase.allocation,
          settlementAsset: launch.settlementAsset,
          minContribution: phase.minContribution,
          maxContribution: phase.maxContribution,
          startsAt: phase.startsAt ? new Date(phase.startsAt) : undefined,
          endsAt: phase.endsAt ? new Date(phase.endsAt) : undefined,
          status: phase.startsAt ? "SCHEDULED" : "DRAFT"
        } } } : {})
      },
      include: {
        _count: { select: { participations: true } },
        phases: { select: { id: true, name: true, price: true, allocation: true, minContribution: true, maxContribution: true, startsAt: true, endsAt: true, status: true } },
        participations: { where: { status: "CONFIRMED" }, select: { contribution: true } }
      }
    });
    return summarize(row);
  }
};
