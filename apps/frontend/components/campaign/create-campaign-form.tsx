"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon, CheckCircledIcon, LockClosedIcon } from "@radix-ui/react-icons";
import type { CampaignDraft } from "@powerchain/types";
import { createPowerChainApi, PowerChainApiError } from "@powerchain/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { FormDescription, FormField, FormGrid, FormLabel, FormMessage } from "@/components/ui/form";
import { Processing, type ProcessingStage } from "@/components/processing";
import { SITE } from "@/constants/site";

const api = createPowerChainApi({ baseUrl: SITE.urls.api });
const steps = ["Basics", "Token", "Treasury", "Sale", "Review"] as const;

type DraftForm = {
  name: string; slug: string; description: string; category: string; tokenMint: string; treasuryWallet: string;
  targetAmount: string; settlementAsset: "USDC" | "SOL"; phaseName: string; price: string; allocation: string;
  minContribution: string; maxContribution: string; startsAt: string; endsAt: string;
};

const initial: DraftForm = {
  name: "", slug: "", description: "", category: "Renewable Energy", tokenMint: "", treasuryWallet: "", targetAmount: "",
  settlementAsset: "USDC", phaseName: "Public Sale", price: "", allocation: "", minContribution: "", maxContribution: "", startsAt: "", endsAt: ""
};

function localIso(value: string) { return value ? new Date(value).toISOString() : undefined; }

export function CreateCampaignForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initial);
  const [processing, setProcessing] = useState<ProcessingStage | null>(null);
  const [error, setError] = useState("");
  const pct = ((step + 1) / steps.length) * 100;
  const update = <K extends keyof DraftForm>(key: K, value: DraftForm[K]) => setForm((current) => ({ ...current, [key]: value }));

  const valid = useMemo(() => {
    if (step === 0) return form.name.trim().length >= 3 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug) && form.description.trim().length >= 20;
    if (step === 1) return form.tokenMint.length >= 32;
    if (step === 2) return form.treasuryWallet.length >= 32;
    if (step === 3) {
      const target = Number(form.targetAmount), price = Number(form.price), allocation = Number(form.allocation);
      const min = form.minContribution ? Number(form.minContribution) : undefined;
      const max = form.maxContribution ? Number(form.maxContribution) : undefined;
      return target > 0 && price > 0 && allocation > 0 && (!min || !max || min <= max) && (!form.startsAt || !form.endsAt || new Date(form.startsAt) < new Date(form.endsAt));
    }
    return true;
  }, [form, step]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (step < steps.length - 1) { if (valid) setStep((value) => value + 1); return; }
    setProcessing("preparing");
    try {
      const input: CampaignDraft = {
        name: form.name.trim(), slug: form.slug, description: form.description.trim(), category: form.category,
        tokenMint: form.tokenMint, treasuryWallet: form.treasuryWallet, targetAmount: Number(form.targetAmount), settlementAsset: form.settlementAsset,
        phase: {
          name: form.phaseName.trim() || "Public Sale", price: Number(form.price), allocation: Number(form.allocation),
          ...(form.minContribution ? { minContribution: Number(form.minContribution) } : {}),
          ...(form.maxContribution ? { maxContribution: Number(form.maxContribution) } : {}),
          ...(form.startsAt ? { startsAt: localIso(form.startsAt) } : {}),
          ...(form.endsAt ? { endsAt: localIso(form.endsAt) } : {})
        }
      };
      setProcessing("validating");
      const launch = await api.createCampaign(input);
      setProcessing("ready");
      router.push(`/dashboard/launch/${launch.id}/review`);
    } catch (cause) {
      setProcessing(null);
      setError(cause instanceof PowerChainApiError ? cause.message : cause instanceof Error ? cause.message : "Unable to create campaign.");
    }
  }

  return <form className="campaign-builder" onSubmit={submit}>
    <aside>
      <span className="eyebrow">Create campaign</span><h1>Launch configuration</h1><Progress value={pct} label="Campaign setup"/>
      <nav>{steps.map((item,index)=><button type="button" onClick={()=>index<step&&setStep(index)} className={index===step?"active":index<step?"done":""} key={item}><span>{index<step?<CheckCircledIcon/>:String(index+1).padStart(2,"0")}</span>{item}</button>)}</nav>
      <div className="builder-boundary"><LockClosedIcon/><p>Creating a campaign stores configuration only. Activation always ends at transaction review, simulation, and an authorized wallet signature.</p></div>
    </aside>
    <section className="builder-workspace">
      <header><span>Step {step+1} of {steps.length}</span><h2>{steps[step]}</h2></header>
      {step===0?<div className="builder-fields"><FormGrid><FormField><FormLabel htmlFor="name">Campaign name</FormLabel><Input id="name" value={form.name} onChange={(e)=>update("name",e.target.value)} required/></FormField><FormField><FormLabel htmlFor="slug">Public slug</FormLabel><Input id="slug" value={form.slug} onChange={(e)=>update("slug",e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g,"-"))} required/></FormField></FormGrid><FormField><FormLabel htmlFor="description">Description</FormLabel><Textarea id="description" value={form.description} onChange={(e)=>update("description",e.target.value)} required/><FormDescription>Explain the project, capital purpose, and expected real-world outcome.</FormDescription></FormField><FormField><FormLabel>Category</FormLabel><Select value={form.category} onValueChange={(value)=>update("category",value)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Renewable Energy">Renewable Energy</SelectItem><SelectItem value="Infrastructure">Infrastructure</SelectItem><SelectItem value="Community Funding">Community Funding</SelectItem><SelectItem value="Humanitarian">Humanitarian</SelectItem><SelectItem value="Real-World Assets">Real-World Assets</SelectItem></SelectContent></Select></FormField></div>:null}
      {step===1?<div className="builder-fields"><FormField><FormLabel htmlFor="token-mint">Token mint</FormLabel><Input id="token-mint" value={form.tokenMint} onChange={(e)=>update("tokenMint",e.target.value.trim())} placeholder="Token-2022 or SPL mint address" required/><FormDescription>The backend validates the Solana public key. Token authority and program checks are repeated before transaction preparation.</FormDescription></FormField></div>:null}
      {step===2?<div className="builder-fields"><FormField><FormLabel htmlFor="treasury">Treasury wallet</FormLabel><Input id="treasury" value={form.treasuryWallet} onChange={(e)=>update("treasuryWallet",e.target.value.trim())} placeholder="Solana treasury address" required/><FormDescription>PowerChain never treats this as a platform balance. Settlement remains linked to the configured treasury and on-chain rules.</FormDescription></FormField></div>:null}
      {step===3?<div className="builder-fields"><FormGrid><FormField><FormLabel htmlFor="target">Capital target</FormLabel><Input id="target" inputMode="decimal" value={form.targetAmount} onChange={(e)=>update("targetAmount",e.target.value)} placeholder="750000" required/></FormField><FormField><FormLabel>Settlement asset</FormLabel><Select value={form.settlementAsset} onValueChange={(value)=>update("settlementAsset",value as "USDC"|"SOL")}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="USDC">USDC</SelectItem><SelectItem value="SOL">SOL</SelectItem></SelectContent></Select></FormField></FormGrid><FormGrid><FormField><FormLabel htmlFor="phase-name">Phase name</FormLabel><Input id="phase-name" value={form.phaseName} onChange={(e)=>update("phaseName",e.target.value)} required/></FormField><FormField><FormLabel htmlFor="price">Token price ({form.settlementAsset})</FormLabel><Input id="price" inputMode="decimal" value={form.price} onChange={(e)=>update("price",e.target.value)} placeholder="0.002" required/></FormField></FormGrid><FormGrid><FormField><FormLabel htmlFor="allocation">Phase allocation</FormLabel><Input id="allocation" inputMode="decimal" value={form.allocation} onChange={(e)=>update("allocation",e.target.value)} placeholder="40000000" required/></FormField><FormField><FormLabel htmlFor="minimum">Minimum contribution</FormLabel><Input id="minimum" inputMode="decimal" value={form.minContribution} onChange={(e)=>update("minContribution",e.target.value)} placeholder="100"/></FormField></FormGrid><FormGrid><FormField><FormLabel htmlFor="maximum">Maximum contribution</FormLabel><Input id="maximum" inputMode="decimal" value={form.maxContribution} onChange={(e)=>update("maxContribution",e.target.value)} placeholder="5000"/></FormField><span/></FormGrid><FormGrid><FormField><FormLabel htmlFor="starts">Starts</FormLabel><Input id="starts" type="datetime-local" value={form.startsAt} onChange={(e)=>update("startsAt",e.target.value)}/></FormField><FormField><FormLabel htmlFor="ends">Ends</FormLabel><Input id="ends" type="datetime-local" value={form.endsAt} onChange={(e)=>update("endsAt",e.target.value)}/></FormField></FormGrid></div>:null}
      {step===4?<div className="campaign-review"><div><span>Name</span><strong>{form.name}</strong></div><div><span>Token mint</span><strong className="mono">{form.tokenMint}</strong></div><div><span>Target</span><strong>{Number(form.targetAmount||0).toLocaleString()} {form.settlementAsset}</strong></div><div><span>Price</span><strong>{form.price} {form.settlementAsset}</strong></div><div><span>Allocation</span><strong>{Number(form.allocation||0).toLocaleString()} tokens</strong></div><div><span>Treasury</span><strong className="mono">{form.treasuryWallet}</strong></div><div className="review-notice"><LockClosedIcon/><p>This action creates a draft and sale configuration. It does not activate the launch, move funds, or submit a Solana transaction.</p></div></div>:null}
      {processing?<Processing stage={processing}/>:null}{error?<FormMessage>{error}</FormMessage>:null}
      <footer><Button type="button" variant="outline" disabled={step===0||Boolean(processing)} onClick={()=>setStep(Math.max(0,step-1))}><ArrowLeftIcon/> Back</Button><Button type="submit" disabled={!valid||Boolean(processing)}>{step===steps.length-1?"Create draft":"Continue"}<ArrowRightIcon/></Button></footer>
    </section>
  </form>;
}
