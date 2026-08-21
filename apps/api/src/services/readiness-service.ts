import type { LaunchReadiness, ReadinessCheck } from "@powerchain/types";
import { env } from "../env/index.js";
import { launchRepository } from "../repositories/launch-repository.js";

export async function buildReadiness(launchId: string): Promise<LaunchReadiness> {
  const launch = await launchRepository.findById(launchId);
  if (!launch) return { launchId, score: 0, checks: [], blockingIssues: 1 };
  const phases = Array.isArray((launch as { phases?: unknown[] }).phases) ? (launch as { phases: Array<{ price?: number; allocation?: number }> }).phases : [];
  const checks: ReadinessCheck[] = [
    { id: "token", label: "Token mint configured", state: launch.tokenMint ? "pass" : "blocked", href: "/token" },
    { id: "treasury", label: "Treasury configured", state: launch.treasuryWallet ? "pass" : "blocked", href: "/treasury" },
    { id: "capital", label: "Capital target configured", state: launch.targetUsd > 0 ? "pass" : "blocked", href: "/sale" },
    { id: "phases", label: "Sale phase pricing and allocation configured", state: phases.some((phase) => Number(phase.price) > 0 && Number(phase.allocation) > 0) ? "pass" : "blocked", href: "/sale" },
    { id: "program", label: "Launchpad program configured", state: env.POWERCHAIN_LAUNCHPAD_PROGRAM_ID ? "pass" : "blocked", href: "/authorities" },
    { id: "authority", label: "Authorized wallet confirmation", state: launch.status === "LIVE" ? "pass" : "attention", href: "/authorities" }
  ];
  const weights = { pass: 1, attention: 0.5, blocked: 0 } as const;
  const score = Math.round(checks.reduce((sum, check) => sum + weights[check.state], 0) / checks.length * 100);
  return { launchId, score, checks, blockingIssues: checks.filter((check) => check.state === "blocked").length };
}
