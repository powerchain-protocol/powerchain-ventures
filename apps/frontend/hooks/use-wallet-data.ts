"use client";
import {useCallback,useEffect,useState} from "react";
import type {WalletAssetData} from "../types/wallet-data";
export function useWalletData(wallet:string){const [data,setData]=useState<WalletAssetData|null>(null),[loading,setLoading]=useState(false),[error,setError]=useState("");const refresh=useCallback(async()=>{if(!wallet){setData(null);return}setLoading(true);setError("");try{const r=await fetch(`/api/v1/wallets/${encodeURIComponent(wallet)}`,{cache:"no-store"});const j=await r.json();if(!r.ok)throw new Error(j?.error?.message||"Unable to load wallet balances");setData(j)}catch(e){setError(e instanceof Error?e.message:"Unable to load wallet balances")}finally{setLoading(false)}},[wallet]);useEffect(()=>{void refresh()},[refresh]);return {data,loading,error,refresh}}
