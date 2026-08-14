"use client";
import {useEffect,useMemo,useState} from "react";
import {usePowerChainConfig} from "../../context/powerchain-config-context";
import {describeNetworkStatus,type NetworkReadinessStatus} from "../../types/status";
import {StatusBadge} from "../ui/status-badge";

type Status={ok:boolean;network?:{cluster:string;genesisHash:string;slot:number;blockHeight:number;version:string;verified:boolean};infra?:{dedicated:boolean;redundant:boolean;count:number}};

export function NetworkStatus({compact=false}:{compact?:boolean}){
 const {config,loading:configLoading}=usePowerChainConfig();
 const [state,setState]=useState<Status|null>(null);const [error,setError]=useState(false);
 useEffect(()=>{let live=true;fetch("/api/v1/launchpad/network",{cache:"no-store"}).then(async r=>{const j=await r.json();if(live){setState(j);setError(!r.ok)}}).catch(()=>live&&setError(true));return()=>{live=false}},[]);
 const deploymentReady=Boolean(config?.deployment.configured);const ok=Boolean(state?.ok&&deploymentReady);
 const readiness=useMemo<NetworkReadinessStatus>(()=>{if(configLoading&&!state)return"checking";if(error)return"offline";if(config&&!deploymentReady)return"incomplete";if(state?.ok&&deploymentReady)return state.infra?.redundant?"ready":"degraded";return"checking"},[configLoading,state,error,config,deploymentReady]);
 const descriptor=describeNetworkStatus(readiness);
 if(compact)return <StatusBadge status={descriptor} className="network-compact"/>;
 return <section className={`network-banner ${descriptor.tone}`}><div className="network-summary"><StatusBadge status={descriptor}/><div><b>{ok?"Solana mainnet-beta verified":"PowerChain network readiness"}</b><small>{state?.network?`Slot ${state.network.slot.toLocaleString()} • Block ${state.network.blockHeight.toLocaleString()} • Core ${state.network.version}`:"Checking RPC identity, health, deployment addresses and redundancy"}</small>{config&&!deploymentReady&&<small>{[...config.deployment.missing,...config.deployment.invalid].slice(0,3).join(" • ")}</small>}</div></div><div className="network-badges"><span className={state?.infra?.dedicated?"ok":""}>{state?.infra?.dedicated?"Dedicated RPC":"RPC check"}</span><span className={state?.infra?.redundant?"ok":""}>{state?.infra?.redundant?`${state.infra.count} RPC endpoints`:"Redundancy check"}</span><span className={config?.deployment.presaleMintConfigured?"ok":""}>{config?.deployment.presaleMintConfigured?"PWRC mint configured":"Mint required"}</span><span className={config?.deployment.treasuryConfigured?"ok":""}>{config?.deployment.treasuryConfigured?"Treasury configured":"Treasury required"}</span></div></section>;
}
