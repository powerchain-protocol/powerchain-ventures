"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LaunchOperationsOverview } from "@powerchain/types";
import { createPowerChainApi, PowerChainApiError } from "@powerchain/api-client";
import { CheckCircledIcon, ClockIcon, ExclamationTriangleIcon, LockClosedIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SITE } from "@/constants/site";
import { formatCompactNumber, formatMoney, shortAddress } from "@/lib/formats";

const api = createPowerChainApi({ baseUrl: SITE.urls.api });

export function LaunchControlPlane({ launchId }: { launchId: string }) {
  const [data, setData] = useState<LaunchOperationsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true); setError("");
    try { setData(await api.getLaunchOverview(launchId)); }
    catch (cause) { setError(cause instanceof PowerChainApiError ? cause.message : cause instanceof Error ? cause.message : "Unable to load launch operations."); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, [launchId]);

  const raisedPct = useMemo(() => data?.launch.targetUsd ? Math.min(100, Math.round(data.launch.raisedUsd / data.launch.targetUsd * 100)) : 0, [data]);
  if (loading) return <div className="control-plane-loading"><ReloadIcon/><span>Loading launch control plane…</span></div>;
  if (error || !data) return <div className="control-plane-error"><ExclamationTriangleIcon/><div><h2>Launch control plane unavailable</h2><p>{error || "No launch data was returned."}</p><Button onClick={() => void load()}>Retry</Button></div></div>;

  return <div className="control-plane">
    <header className="control-plane-header">
      <div><div className="control-plane-kicker"><Badge variant={data.launch.status === "LIVE" ? "success" : "outline"}>{data.launch.status}</Badge><span>{data.launch.category || "Tokenized capital"}</span></div><h1>{data.launch.name}</h1><p>Manage readiness, health, treasury, authorities, lifecycle state and exact wallet-controlled execution from one launch workspace.</p></div>
      <div className="control-plane-actions"><Button variant="outline" onClick={() => void load()}><ReloadIcon/> Refresh</Button><Button asChild><Link href={`/dashboard/launch/${data.launch.id}/review`}>{data.launch.status === "LIVE" ? "Review transaction history" : "Continue to launch review"}</Link></Button></div>
    </header>
    <nav className="control-plane-tabs" aria-label="Launch workspace sections"><a href="#readiness">Readiness</a><a href="#health">Sale health</a><a href="#treasury">Treasury</a><a href="#authorities">Authorities</a><a href="#timeline">Timeline</a></nav>

    <section className="control-plane-kpis">
      <article><span>Capital raised</span><strong>{formatMoney(data.launch.raisedUsd)}</strong><small>{raisedPct}% of {formatMoney(data.launch.targetUsd)}</small></article>
      <article><span>Participants</span><strong>{formatCompactNumber(data.launch.participants)}</strong><small>Confirmed lifecycle records</small></article>
      <article><span>Readiness</span><strong>{data.readiness.score}%</strong><small>{data.readiness.blockingIssues ? `${data.readiness.blockingIssues} blocking issue${data.readiness.blockingIssues === 1 ? "" : "s"}` : "No blocking issues"}</small></article>
      <article><span>Sale health</span><strong>{data.health.state}</strong><small>Generated {new Date(data.health.generatedAt).toLocaleTimeString()}</small></article>
    </section>

    <section className="control-plane-progress"><div><span>Capital progress</span><strong>{formatMoney(data.launch.raisedUsd)}</strong></div><Progress value={raisedPct} label="Capital progress"/><div className="control-plane-progress-meta"><span>$0</span><span>{raisedPct}%</span><span>{formatMoney(data.launch.targetUsd)}</span></div></section>

    <div className="control-plane-grid">
      <section id="readiness" className="control-card"><div className="control-card-heading"><div><span className="eyebrow"><CheckCircledIcon/> Launch readiness</span><h2>{data.readiness.score}% complete</h2></div><Badge variant={data.readiness.blockingIssues ? "warning" : "success"}>{data.readiness.blockingIssues ? "Action required" : "Ready"}</Badge></div><div className="control-list">{data.readiness.checks.map((check) => <div key={check.id}><span>{check.state === "pass" ? <CheckCircledIcon/> : <ExclamationTriangleIcon/>}<strong>{check.label}</strong></span><Badge variant={check.state === "pass" ? "success" : check.state === "attention" ? "warning" : "danger"}>{check.state}</Badge></div>)}</div></section>

      <section id="health" className="control-card"><div className="control-card-heading"><div><span className="eyebrow">Sale health</span><h2>{data.health.state}</h2></div><Badge variant={data.health.state === "HEALTHY" ? "success" : data.health.state === "WATCH" ? "warning" : "danger"}>{data.health.state}</Badge></div><div className="health-signal-list">{data.health.signals.map((signal) => <article key={signal.key}><div><strong>{signal.label}</strong><Badge variant={signal.state === "HEALTHY" ? "success" : signal.state === "WATCH" ? "warning" : "danger"}>{signal.state}</Badge></div><p>{signal.summary}</p>{signal.detail ? <small>{signal.detail}</small> : null}</article>)}</div></section>

      <section id="treasury" className="control-card"><div className="control-card-heading"><div><span className="eyebrow">Treasury</span><h2>{data.treasury.settlementAsset}</h2></div><Badge variant={data.treasury.failed > 0 ? "danger" : "outline"}>{data.treasury.failed > 0 ? "Review" : "Tracked"}</Badge></div><dl className="control-dl"><div><dt>Total raised</dt><dd>{formatCompactNumber(data.treasury.totalRaised)} {data.treasury.settlementAsset}</dd></div><div><dt>Pending settlement</dt><dd>{formatCompactNumber(data.treasury.pendingSettlement)}</dd></div><div><dt>Settled</dt><dd>{formatCompactNumber(data.treasury.settled)}</dd></div><div><dt>Reconciled</dt><dd>{formatCompactNumber(data.treasury.reconciled)}</dd></div><div><dt>Treasury</dt><dd className="mono">{data.treasury.treasuryWallet ? shortAddress(data.treasury.treasuryWallet, 6) : "Not configured"}</dd></div></dl></section>

      <section id="authorities" className="control-card"><div className="control-card-heading"><div><span className="eyebrow"><LockClosedIcon/> Authorities</span><h2>Wallet and program control</h2></div><Badge variant="outline">On-chain boundary</Badge></div><div className="authority-list">{data.authorities.length ? data.authorities.map((authority) => <article key={authority.type}><div><strong>{authority.type.replaceAll("_", " ")}</strong><small>{authority.controlType}</small></div><span className="mono">{authority.revoked ? "Revoked" : authority.address ? shortAddress(authority.address, 6) : "Not configured"}</span></article>) : <p>No authority records have been persisted yet.</p>}</div></section>

      <section id="timeline" className="control-card control-card-wide"><div className="control-card-heading"><div><span className="eyebrow"><ClockIcon/> Launch timeline</span><h2>Lifecycle record</h2></div><Badge variant="outline">{data.timeline.length} events</Badge></div><div className="control-timeline">{data.timeline.slice(0, 12).map((item) => <article key={item.id}><i/><div><strong>{item.title}</strong><small>{item.at ? new Date(item.at).toLocaleString() : "Pending timestamp"} · {item.status}</small>{item.signature ? <code>{shortAddress(item.signature, 10)}</code> : null}</div></article>)}</div></section>
    </div>

    <div className="control-plane-boundary"><LockClosedIcon/><div><strong>AI and backend execution boundary</strong><p>PowerChain may prepare, validate and simulate transaction data. Private keys never enter this control plane. A configured authority must review and sign every consequential on-chain action in its wallet.</p></div></div>
  </div>;
}
