"use client";

import { createContext, useContext, useMemo, useState } from "react";

type AppContextValue = {
  commandMenuOpen: boolean;
  setCommandMenuOpen: (open: boolean) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const value = useMemo(() => ({ commandMenuOpen, setCommandMenuOpen }), [commandMenuOpen]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useAppContext must be used within AppContextProvider");
  return value;
}
