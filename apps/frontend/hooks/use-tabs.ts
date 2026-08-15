"use client";

import { useCallback, useState } from "react";

export function useTabs<T extends string>(initial: T) {
  const [value, setValue] = useState<T>(initial);

  const select = useCallback((next: T) => {
    setValue(next);
  }, []);

  return { value, select, setValue };
}
