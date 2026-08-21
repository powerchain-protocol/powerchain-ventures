"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
type Theme="light"|"dark"; const C=createContext<{theme:Theme;toggle:()=>void}|null>(null);
export function ThemeProvider({children}:{children:React.ReactNode}){const[theme,setTheme]=useState<Theme>("light");useEffect(()=>setTheme(document.documentElement.dataset.theme==="dark"?"dark":"light"),[]);const value=useMemo(()=>({theme,toggle:()=>setTheme(current=>{const next=current==="light"?"dark":"light";localStorage.setItem("powerchain-theme",next);document.documentElement.dataset.theme=next;document.documentElement.style.colorScheme=next;return next})}),[theme]);return <C.Provider value={value}>{children}</C.Provider>};
export function useTheme(){const value=useContext(C);if(!value)throw new Error("useTheme must be used within ThemeProvider");return value}
