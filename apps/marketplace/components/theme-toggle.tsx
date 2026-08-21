"use client";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "./provider/theme-provider";
export function ThemeToggle(){const{theme,toggle}=useTheme();return <button className="icon-button" onClick={toggle} type="button" aria-label="Toggle theme">{theme==="light"?<MoonIcon/>:<SunIcon/>}</button>}
