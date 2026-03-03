"use client";

import { useEffect, useState } from "react";

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
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold">Timezone-Aware Content</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="card">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-cool-grey">
            Your Local Time ({timezone})
          </p>
          <p className="mt-2 font-mono text-2xl font-bold text-brand-dark">
            {localTime || "Loading..."}
          </p>
        </div>

        <div className="card">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-cool-grey">
            Detected Region
          </p>
          <p className="mt-2 text-2xl font-bold text-brand-dark">
            {continentEmoji[continent] ?? "🌐"} {continent}
          </p>
          <p className="mt-1 text-sm text-brand-cool-grey">
            Country code: {country}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>How this works:</strong> The Edge Middleware reads{" "}
          <code className="rounded bg-blue-100 px-1 font-mono text-xs">
            x-vercel-ip-country
          </code>{" "}
          and{" "}
          <code className="rounded bg-blue-100 px-1 font-mono text-xs">
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
