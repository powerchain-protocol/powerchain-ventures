import { createContext,useContext,useEffect,useMemo,useState } from "react";
import { getJson,setJson } from "@/lib/storage";
const KEY="pc_mobile_onboarding_v1";
type Value={ready:boolean;completed:boolean;complete:()=>Promise<void>};const C=createContext<Value|null>(null);
export function OnboardingProvider({children}:{children:React.ReactNode}){const[ready,setReady]=useState(false);const[completed,setCompleted]=useState(false);useEffect(()=>{void getJson<boolean>(KEY).then(v=>{setCompleted(Boolean(v));setReady(true)})},[]);const value=useMemo(()=>({ready,completed,complete:async()=>{await setJson(KEY,true);setCompleted(true)}}),[ready,completed]);return <C.Provider value={value}>{children}</C.Provider>}
export function useOnboarding(){const v=useContext(C);if(!v)throw new Error("useOnboarding outside provider");return v}
