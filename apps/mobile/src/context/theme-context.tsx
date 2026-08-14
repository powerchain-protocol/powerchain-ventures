import { createContext,useContext,useEffect,useMemo,useState } from "react";
import { useColorScheme } from "react-native";
import * as SystemUI from "expo-system-ui";
import { getJson,setJson } from "@/lib/storage";
import { colors } from "@/theme/tokens";
export type ThemePreference="light"|"dark"|"system";
const KEY="pc_mobile_theme_v1";
type Value={preference:ThemePreference;scheme:"light"|"dark";colors:typeof colors.light|typeof colors.dark;setPreference:(v:ThemePreference)=>Promise<void>};
const C=createContext<Value|null>(null);
export function ThemeProvider({children}:{children:React.ReactNode}){const system=useColorScheme();const[pref,setPref]=useState<ThemePreference>("light");useEffect(()=>{void getJson<ThemePreference>(KEY).then(v=>{if(v==="light"||v==="dark"||v==="system")setPref(v)})},[]);const scheme=pref==="system"?(system==="dark"?"dark":"light"):pref;useEffect(()=>{void SystemUI.setBackgroundColorAsync(scheme==="dark"?colors.dark.background:colors.light.background)},[scheme]);const value=useMemo<Value>(()=>({preference:pref,scheme,colors:scheme==="dark"?colors.dark:colors.light,setPreference:async(v)=>{await setJson(KEY,v);setPref(v)}}),[pref,scheme]);return <C.Provider value={value}>{children}</C.Provider>}
export function useTheme(){const v=useContext(C);if(!v)throw new Error("useTheme outside ThemeProvider");return v}
