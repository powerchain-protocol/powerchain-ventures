"use client";

import { useEffect, useMemo, useState } from "react";
import type { LaunchSummary, TransactionReview } from "@powerchain/types";
import { createPowerChainApi, PowerChainApiError } from "@powerchain/api-client";
import { CheckCircledIcon, CrossCircledIcon, LockClosedIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/components/provider/wallet-provider";
import { useEmbeddedWallet } from "@/components/provider/embedded-wallet-provider";
import { WalletButton } from "@/components/wallet/wallet-button";
import { useLaunchEvents } from "@/hooks/use-launch-events";
import { SITE } from "@/constants/site";

const api = createPowerChainApi({ baseUrl: SITE.urls.api });

type ReviewState = "idle" | "preparing" | "signing" | "confirming" | "live";

export function LaunchReview({ campaignId }: { campaignId: string }) {
  const external = useWallet();
  const embedded = useEmbeddedWallet();
  const address = external.address || embedded.address;
  const { event, transport } = useLaunchEvents(campaignId);
  const [campaign, setCampaign] = useState<LaunchSummary | null>(null);
  const [review, setReview] = useState<TransactionReview | null>(null);
  const [state, setState] = useState<ReviewState>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void api.getLaunch(campaignId)
      .then((data) => { if (active) setCampaign(data); })
      .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : "Unable to load campaign."); });
    return () => { active = false; };
  }, [campaignId]);

  useEffect(() => {
    if (event?.type !== "campaign.live") return;
    void api.getLaunch(campaignId).then((data) => { setCampaign(data); setState("live"); }).catch(() => undefined);
  }, [event, campaignId]);

  const canSign = Boolean(review?.serializedTransactionBase64 && review.simulation.status === "passed" && address && state === "idle");
  const accountMismatch = useMemo(() => Boolean(review && address && review.authority !== address), [review, address]);

  async function prepare() {
    if (!address) { external.setModalOpen(true); return; }
    setError(""); setState("preparing");
    try { setReview(await api.prepareCampaignLaunch(campaignId, address, true)); }
    catch (cause) { setError(cause instanceof PowerChainApiError ? cause.message : cause instanceof Error ? cause.message : "Unable to prepare launch transaction."); }
    finally { setState("idle"); }
  }

  async function sign() {
    if (!review?.serializedTransactionBase64 || !address) return;
    if (accountMismatch) { setError("The connected wallet does not match the authority used to prepare this transaction."); return; }
    if (new Date(review.expiresAt).getTime() <= Date.now()) { setReview(null); setError("The prepared transaction expired. Prepare a fresh transaction before signing."); return; }
    setError(""); setState("signing");
    try {
      const signature = external.address
        ? await external.signAndSendPrepared(review.serializedTransactionBase64)
        : await embedded.signAndSendPrepared(review.serializedTransactionBase64);
      setState("confirming");
      try { await external.connection.confirmTransaction(signature, "confirmed"); } catch { /* API verification remains authoritative. */ }
      const live = await api.confirmCampaignLaunch(campaignId, review.id, signature, address);
      setCampaign(live); setState("live");
    } catch (cause) {
      setState("idle");
      setError(cause instanceof Error ? cause.message : "Wallet signing or confirmation failed.");
    }
  }

  return <div className="transaction-review-page">
    <header><div><span className="eyebrow">Final launch review</span><h1>{campaign?.name || "Campaign"}</h1><p>Prepare the exact activation transaction, inspect simulation results, then approve it in the authorized wallet.</p></div><WalletButton/></header>
    <div className="execution-track" aria-label="Launch execution progress"><div className={review ? "done" : "active"}><span>01</span><div><strong>Prepare</strong><small>Build exact transaction</small></div></div><div className={review?.simulation.status === "passed" ? "done" : review ? "active" : ""}><span>02</span><div><strong>Simulate</strong><small>Verify program constraints</small></div></div><div className={state === "confirming" || state === "live" ? "done" : review?.simulation.status === "passed" ? "active" : ""}><span>03</span><div><strong>Sign</strong><small>Authorized wallet only</small></div></div><div className={state === "live" || campaign?.status === "LIVE" ? "done" : state === "confirming" ? "active" : ""}><span>04</span><div><strong>Confirm</strong><small>Verify on-chain state</small></div></div></div>
    <div className="transaction-review-grid">
      <section className="transaction-review-main">
        <div className="review-section"><div className="review-section-title"><h2>Campaign</h2><Badge variant={campaign?.status === "LIVE" ? "success" : "outline"}>{campaign?.status || "Loading"}</Badge></div><dl><div><dt>Campaign ID</dt><dd>{campaignId}</dd></div><div><dt>Network</dt><dd>Solana</dd></div><div><dt>Signing wallet</dt><dd>{address || "Not connected"}</dd></div><div><dt>Realtime</dt><dd>{transport === "websocket" ? "WebSocket connected" : "REST verification fallback"}</dd></div></dl></div>
        {review ? <>
          <div className="review-section"><div className="review-section-title"><h2>Exact transaction</h2><Badge variant="outline">Unsigned</Badge></div><dl><div><dt>Program</dt><dd>{review.programId}</dd></div><div><dt>Action</dt><dd>{review.action}</dd></div><div><dt>Authority</dt><dd>{review.authority}</dd></div><div><dt>Estimated network fee</dt><dd>{review.estimatedNetworkFeeLamports?.toLocaleString() ?? "—"} lamports</dd></div><div><dt>Expires</dt><dd>{new Date(review.expiresAt).toLocaleTimeString()}</dd></div></dl><details><summary>Instruction details</summary>{review.instructions.map((instruction,index)=><div className="instruction-detail" key={`${instruction.programId}-${index}`}><strong>{String(index+1).padStart(2,"0")} {instruction.name}</strong><small>Program {instruction.programId}</small>{instruction.accounts.map((account)=><code key={account}>{account}</code>)}</div>)}</details></div>
          <div className="review-section"><div className="review-section-title"><h2>Pre-sign simulation</h2><Badge variant={review.simulation.status === "passed" ? "success" : review.simulation.status === "failed" ? "danger" : "warning"}>{review.simulation.status}</Badge></div><div className="simulation-result">{review.simulation.status === "passed" ? <CheckCircledIcon/> : <CrossCircledIcon/>}<div><strong>{review.simulation.status === "passed" ? "Program constraints passed" : "Simulation must pass before signing"}</strong><p>{review.simulation.error || "No signature was produced and no transaction was submitted during simulation."}</p></div></div>{review.simulation.logs?.length ? <details><summary>Simulation logs</summary><pre>{review.simulation.logs.join("\n")}</pre></details> : null}</div>
        </> : null}
      </section>
      <aside className="transaction-review-side"><div className="wallet-control-card"><LockClosedIcon/><h2>Wallet-controlled execution</h2><p>PowerChain prepares and validates. The connected wallet remains the only signing boundary.</p>{campaign?.status === "LIVE" || state === "live" ? <div className="launch-success"><CheckCircledIcon/><strong>Campaign is live</strong></div> : review ? <Button disabled={!canSign || accountMismatch || state !== "idle"} onClick={()=>void sign()}>{state === "signing" ? "Approve in wallet…" : state === "confirming" ? "Confirming…" : "Approve in wallet"}</Button> : <Button disabled={state !== "idle"} onClick={()=>void prepare()}>{state === "preparing" ? <><ReloadIcon/> Preparing…</> : "Prepare launch transaction"}</Button>}{!address ? <p className="side-note">Connect an authorized wallet to prepare the transaction.</p> : null}{accountMismatch ? <p className="form-error">Connected wallet does not match the prepared authority.</p> : null}{error ? <p className="form-error">{error}</p> : null}</div></aside>
    </div>
  </div>;
}
