import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import { supabase } from "@/lib/supabase";

type AuthValue={session:Session|null;user:User|null;loading:boolean;signIn:(email:string,password:string)=>Promise<void>;signUp:(email:string,password:string,displayName:string)=>Promise<boolean>;signOut:()=>Promise<void>;sendReset:(email:string)=>Promise<void>};
const AuthContext=createContext<AuthValue|null>(null);
async function completeAuthUrl(url:string|null){if(!url)return;const parsed=Linking.parse(url);const code=typeof parsed.queryParams?.code==="string"?parsed.queryParams.code:null;if(code){await supabase.auth.exchangeCodeForSession(code);return}const access=typeof parsed.queryParams?.access_token==="string"?parsed.queryParams.access_token:null;const refresh=typeof parsed.queryParams?.refresh_token==="string"?parsed.queryParams.refresh_token:null;if(access&&refresh)await supabase.auth.setSession({access_token:access,refresh_token:refresh})}
export function AuthProvider({children}:{children:React.ReactNode}){const[session,setSession]=useState<Session|null>(null);const[loading,setLoading]=useState(true);const incomingUrl=Linking.useLinkingURL();
useEffect(()=>{void supabase.auth.getSession().then(({data})=>{setSession(data.session);setLoading(false)});const {data}=supabase.auth.onAuthStateChange((_event,next)=>setSession(next));return()=>data.subscription.unsubscribe()},[]);
useEffect(()=>{void completeAuthUrl(incomingUrl)},[incomingUrl]);
const value=useMemo<AuthValue>(()=>({session,user:session?.user??null,loading,
signIn:async(email,password)=>{const{error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error},
signUp:async(email,password,displayName)=>{const{data,error}=await supabase.auth.signUp({email,password,options:{data:{display_name:displayName},emailRedirectTo:"powerchain://callback"}});if(error)throw error;return !data.session},
signOut:async()=>{const{error}=await supabase.auth.signOut();if(error)throw error},
sendReset:async(email)=>{const{error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:"powerchain://update-password"});if(error)throw error},
}),[session,loading]);return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>}
export function useAuth(){const value=useContext(AuthContext);if(!value)throw new Error("useAuth must be used inside AuthProvider");return value}
