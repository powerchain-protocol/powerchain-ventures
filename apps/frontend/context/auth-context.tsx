"use client";
import {createContext,useCallback,useContext,useEffect,useMemo,useState} from "react";
import type {AuthResult,AuthState,AuthUser} from "../types/auth";
import {fetchJson} from "../lib/helpers";

type AuthContextValue=AuthState&{
 refresh:()=>Promise<void>;
 signIn:(email:string,password:string)=>Promise<AuthResult>;
 signUp:(input:{email:string;password:string;displayName:string})=>Promise<AuthResult>;
 signOut:()=>Promise<void>;
 forgotPassword:(email:string)=>Promise<AuthResult>;
};
const AuthContext=createContext<AuthContextValue|null>(null);
export function AuthProvider({children}:{children:React.ReactNode}){
 const [state,setState]=useState<AuthState>({configured:true,loading:true,authenticated:false,user:null});
 const refresh=useCallback(async()=>{try{const data=await fetchJson<{configured?:boolean;authenticated:boolean;user:AuthUser|null}>("/api/v1/auth/session",{timeoutMs:8000,retries:0});setState({configured:data.configured!==false,loading:false,authenticated:data.authenticated,user:data.user})}catch{setState(s=>({...s,loading:false,authenticated:false,user:null}))}},[]);
 useEffect(()=>{void refresh()},[refresh]);
 const signIn=useCallback(async(email:string,password:string)=>{try{const data=await fetchJson<{user:AuthUser}>("/api/v1/auth/sign-in",{method:"POST",body:JSON.stringify({email,password}),headers:{"content-type":"application/json"},timeoutMs:10000,retries:0});setState({configured:true,loading:false,authenticated:true,user:data.user});return{ok:true}}catch(error){return{ok:false,message:error instanceof Error?error.message:"Unable to sign in"}}},[]);
 const signUp=useCallback(async(input:{email:string;password:string;displayName:string})=>{try{const data=await fetchJson<{user:AuthUser|null;emailConfirmationRequired:boolean}>("/api/v1/auth/sign-up",{method:"POST",body:JSON.stringify(input),headers:{"content-type":"application/json"},timeoutMs:10000,retries:0});if(data.user&&!data.emailConfirmationRequired)setState({configured:true,loading:false,authenticated:true,user:data.user});return{ok:true,emailConfirmationRequired:data.emailConfirmationRequired}}catch(error){return{ok:false,message:error instanceof Error?error.message:"Unable to create account"}}},[]);
 const signOut=useCallback(async()=>{try{await fetchJson("/api/v1/auth/sign-out",{method:"POST",headers:{"content-type":"application/json"},body:"{}",timeoutMs:8000,retries:0})}finally{setState({configured:true,loading:false,authenticated:false,user:null})}},[]);
 const forgotPassword=useCallback(async(email:string)=>{try{const data=await fetchJson<{message:string}>("/api/v1/auth/forgot-password",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email}),timeoutMs:10000,retries:0});return{ok:true,message:data.message}}catch(error){return{ok:false,message:error instanceof Error?error.message:"Unable to send recovery email"}}},[]);
 const value=useMemo(()=>({...state,refresh,signIn,signUp,signOut,forgotPassword}),[state,refresh,signIn,signUp,signOut,forgotPassword]);
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth(){const value=useContext(AuthContext);if(!value)throw new Error("useAuth must be used inside AuthProvider");return value}
