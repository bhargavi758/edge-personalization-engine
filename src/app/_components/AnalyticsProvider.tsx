"use client";

import { useEffect, useCallback } from "react";
import { ANALYTICS_ENDPOINT } from "@/lib/analytics/types";

interface AnalyticsProviderProps {
  visitorId: string;
  sessionId: string;
  children: React.ReactNode;
}

export function AnalyticsProvider({
  visitorId,
  sessionId,
  children,
}: AnalyticsProviderProps) {
  const trackEvent = useCallback(
    (type: string, properties: Record<string, string | number | boolean> = {}) => {
      const payload = {
        type,
        visitorId,
        sessionId,
        path: window.location.pathname,
        timestamp: Date.now(),
        properties,
      };

      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          ANALYTICS_ENDPOINT,
          JSON.stringify(payload)
        );
      } else {
        fetch(ANALYTICS_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    },
    [visitorId, sessionId]
  );

  useEffect(() => {
    trackEvent("page_view", {
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenWidth: window.innerWidth,
    });
  }, [trackEvent]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const cta = target.closest("[data-track]");
      if (cta) {
        trackEvent("cta_click", {
          label: cta.getAttribute("data-track") ?? "unknown",
          href: cta.getAttribute("href") ?? "",
        });
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [trackEvent]);

  return <>{children}</>;
}
