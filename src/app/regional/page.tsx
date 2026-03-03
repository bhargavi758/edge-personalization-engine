import { headers } from "next/headers";
import { getRegionalHero, getRegionalEvents } from "@/lib/geo/content";
import { getCountryName } from "@/lib/geo/regions";
import { RegionalContent } from "@/app/_components/RegionalContent";
import { cn } from "@/lib/utils";

export const revalidate = 60;

export default function RegionalPage() {
  const h = headers();
  const continent = h.get("x-geo-continent") ?? "North America";
  const country = h.get("x-geo-country") ?? "US";
  const region = h.get("x-geo-region") ?? "CA";
  const city = h.get("x-geo-city") ?? "San Francisco";
  const timezone = h.get("x-geo-timezone") ?? "America/Los_Angeles";

  const hero = getRegionalHero(continent);
  const events = getRegionalEvents(continent);
  const countryName = getCountryName(country);

  const badgeStyle: Record<string, string> = {
    conference: "bg-blue-500/10 text-blue-600",
    workshop: "bg-primary/10 text-primary",
    seminar: "bg-amber-500/10 text-amber-600",
    meetup: "bg-rose-500/10 text-rose-600",
  };

  return (
    <div className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-foreground">Regional Personalization</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Content on this page is tailored based on your geographic location,
          resolved from Vercel edge headers with local development fallbacks.
        </p>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Continent", value: continent },
          { label: "Country", value: `${countryName} (${country})` },
          { label: "Region", value: region },
          { label: "City", value: city },
          { label: "Timezone", value: timezone },
        ].map((item) => (
          <div key={item.label} className={cn("rounded-lg border border-border bg-card p-4")}>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-1 font-mono text-sm font-semibold text-card-foreground">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <section className={cn(
        "mb-8 overflow-hidden rounded-lg border border-border bg-sidebar p-8 text-white"
      )}>
        <p className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-sidebar-foreground">
          Personalized for {continent}
        </p>
        <h2 className="text-2xl font-bold sm:text-3xl">{hero.headline}</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-sidebar-foreground">
          {hero.subheadline}
        </p>
        <button className={cn(
          "mt-5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
          "transition-colors hover:bg-primary/90"
        )}>
          {hero.ctaText}
        </button>
      </section>

      <RegionalContent
        continent={continent}
        country={country}
        timezone={timezone}
      />

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Events Near {continent === "North America" ? "You" : continent}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.title} className={cn("rounded-lg border border-border bg-card p-4")}>
              <div className="mb-2.5 flex items-center justify-between">
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[11px] font-medium",
                    badgeStyle[event.type] ?? "bg-muted text-muted-foreground"
                  )}
                >
                  {event.type}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {event.date}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-card-foreground">
                {event.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {event.description}
              </p>
              <p className="mt-2.5 text-xs font-medium text-primary">
                {event.location}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold text-foreground">How Geo Resolution Works</h2>
        <div className="rounded-lg border border-border bg-sidebar p-4 font-mono text-xs leading-relaxed text-sidebar-foreground">
          <pre className="whitespace-pre-wrap">{`1. Request arrives at Vercel Edge Network
2. Vercel injects headers:
   - x-vercel-ip-country: "${country}"
   - x-vercel-ip-region: "${region}"
   - x-vercel-ip-city: "${city}"
3. Middleware reads these (with fallbacks for local dev)
4. resolveGeo() maps country → continent, timezone
5. Geo info stored in cookie + passed via request headers
6. Page reads headers and selects regional content`}</pre>
        </div>
      </section>
    </div>
  );
}
