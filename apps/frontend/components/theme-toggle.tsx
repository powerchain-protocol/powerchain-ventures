"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "./provider/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const next = theme === "light" ? "dark" : "light";
  return (
    <button className="icon-button" onClick={toggleTheme} type="button" aria-label={`Switch to ${next} theme`} title={`Switch to ${next} theme`}>
      {theme === "light" ? <MoonIcon width={18} height={18} /> : <SunIcon width={18} height={18} />}
    </button>
  );
}
