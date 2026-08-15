"use client";

import { useCallback, useState } from "react";
import type { AsyncState } from "../types/ui";

export function useAsyncAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
) {
  const [state, setState] = useState<AsyncState>("idle");
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: TArgs) => {
    setState("loading");
    setError(null);
    try {
      const result = await action(...args);
      setState("success");
      return result;
    } catch (cause) {
      setState("error");
      setError(
        cause instanceof Error ? cause.message : "Action failed",
      );
      throw cause;
    }
  }, [action]);

  const reset = useCallback(() => {
    setState("idle");
    setError(null);
  }, []);

  return {
    state,
    busy: state === "loading",
    error,
    execute,
    reset,
  };
}
