"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window { turnstile?: TurnstileApi; }
}

export function Turnstile({ siteKey, onToken }: { siteKey: string; onToken: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  const renderWidget = useCallback(() => {
    if (!scriptReady || !window.turnstile || !containerRef.current || widgetIdRef.current) return;
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "auto",
      size: "flexible",
      callback: (token: string) => onToken(token),
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken("")
    });
  }, [onToken, scriptReady, siteKey]);

  useEffect(() => {
    renderWidget();
    return () => {
      if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    };
  }, [renderWidget]);

  return <>
    <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onLoad={() => setScriptReady(true)} />
    <div className="turnstile-shell" ref={containerRef} aria-label="Security check" />
  </>;
}
