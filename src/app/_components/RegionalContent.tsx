"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RegionalContentProps {
  continent: string;
  country: string;
  timezone: string;
}

export function RegionalContent({
  continent,
  country,
  timezone,
}: RegionalContentProps) {
  const [localTime, setLocalTime] = useState<string>("");

  useEffect(() => {
    function updateTime() {
      try {
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date());
        setLocalTime(formatted);
      } catch {
        setLocalTime(new Date().toLocaleString());
      }
    }

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  const continentEmoji: Record<string, string> = {
    "North America": "🌎",
    "South America": "🌎",
    Europe: "🌍",
    Africa: "🌍",
    Asia: "🌏",
    Oceania: "🌏",
  };

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Timezone-Aware Content</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className={cn("rounded-lg border border-border bg-card p-5")}>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Your Local Time ({timezone})
          </p>
          <p className="mt-2 font-mono text-xl font-bold text-card-foreground">
            {localTime || "Loading..."}
          </p>
        </div>

        <div className={cn("rounded-lg border border-border bg-card p-5")}>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Detected Region
          </p>
          <p className="mt-2 text-xl font-bold text-card-foreground">
            {continentEmoji[continent] ?? "🌐"} {continent}
          </p>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            Country code: {country}
          </p>
        </div>
      </div>

      <div className={cn("mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4")}>
        <p className="text-xs text-muted-foreground">
          <strong className="text-card-foreground">How this works:</strong> The Edge Middleware reads{" "}
          <code className="rounded bg-primary/10 px-1 font-mono text-[11px] text-primary">
            x-vercel-ip-country
          </code>{" "}
          and{" "}
          <code className="rounded bg-primary/10 px-1 font-mono text-[11px] text-primary">
            x-vercel-ip-region
          </code>{" "}
          headers injected by Vercel&apos;s edge network. In local development,
          it falls back to US/CA/San Francisco. The timezone is derived from the
          country code and used here to render a live clock in your local time.
        </p>
      </div>
    </section>
  );
}
