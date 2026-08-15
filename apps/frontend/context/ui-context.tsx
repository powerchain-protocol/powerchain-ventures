"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

type Density = "comfortable" | "compact";

type UiContextValue = {
  density: Density;
  setDensity: (value: Density) => void;
  reducedMotion: boolean;
};

const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [density, setDensity] = useState<Density>("comfortable");

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const value = useMemo(
    () => ({
      density,
      setDensity,
      reducedMotion,
    }),
    [density, reducedMotion],
  );

  return (
    <UiContext.Provider value={value}>
      {children}
    </UiContext.Provider>
  );
}

export function useUi() {
  const value = useContext(UiContext);
  if (!value) throw new Error("useUi must be used inside UiProvider");
  return value;
}
