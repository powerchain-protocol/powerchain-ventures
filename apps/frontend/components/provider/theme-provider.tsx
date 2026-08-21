"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
type Theme = "light" | "dark";
type ThemeContextValue = { theme: Theme; setTheme: (theme: Theme) => void; toggleTheme: () => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  useEffect(() => setThemeState(readTheme()), []);
  const setTheme = (next: Theme) => {
    setThemeState(next);
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    window.localStorage.setItem("powerchain-theme", next);
  };
  const value = useMemo(() => ({ theme, setTheme, toggleTheme: () => setTheme(theme === "light" ? "dark" : "light") }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
export function useTheme() { const value = useContext(ThemeContext); if (!value) throw new Error("useTheme must be used within ThemeProvider"); return value; }
