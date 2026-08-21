"use client";
import { createContext, useContext, useMemo, useState } from "react";
const Context = createContext<{ filtersOpen: boolean; setFiltersOpen: (value: boolean) => void } | null>(null);
export function AppContextProvider({ children }: { children: React.ReactNode }) { const [filtersOpen, setFiltersOpen] = useState(false); const value = useMemo(() => ({ filtersOpen, setFiltersOpen }), [filtersOpen]); return <Context.Provider value={value}>{children}</Context.Provider>; }
export function useAppContext() { const value = useContext(Context); if (!value) throw new Error("useAppContext must be used within AppContextProvider"); return value; }
