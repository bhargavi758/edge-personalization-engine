import { headers } from "next/headers";
import { getRegionalHero, getRegionalEvents } from "@/lib/geo/content";
import { getCountryName } from "@/lib/geo/regions";
import { RegionalContent } from "@/app/_components/RegionalContent";

export const revalidate = 60;

export default function RegionalPage() {
  const h = headers();
  const continent = h.get("x-geo-continent") ?? "North America";
  const country = h.get("x-geo-country") ?? "US";
  const region = h.get("x-geo-region") ?? "CA";
  const city = h.get("x-geo-city") ?? "Stanford";
  const timezone = h.get("x-geo-timezone") ?? "America/Los_Angeles";

  const hero = getRegionalHero(continent);
  const events = getRegionalEvents(continent);
  const countryName = getCountryName(country);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="section-heading">Regional Personalization</h1>
        <p className="section-subheading max-w-2xl">
          Content on this page is tailored based on your geographic location,
          resolved from Vercel edge headers with local development fallbacks.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Continent", value: continent },
          { label: "Country", value: `${countryName} (${country})` },
          { label: "Region", value: region },
          { label: "City", value: city },
          { label: "Timezone", value: timezone },
        ].map((item) => (
          <div key={item.label} className="card">
            <p className="text-xs font-medium uppercase tracking-wide text-stanford-cool-grey">
              {item.label}
            </p>
            <p className="mt-1 text-sm font-semibold text-stanford-black">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <section className="mb-12 overflow-hidden rounded-xl bg-gradient-to-r from-stanford-red to-stanford-red-dark p-8 text-white sm:p-12">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-white/60">
          Personalized for {continent}
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">{hero.headline}</h2>
        <p className="mt-4 max-w-xl text-lg text-white/90">
          {hero.subheadline}
        </p>
        <button className="mt-6 rounded-md bg-white px-6 py-3 text-sm font-semibold text-stanford-red transition-colors hover:bg-gray-100">
          {hero.ctaText}
        </button>
      </section>

      <RegionalContent
        continent={continent}
        country={country}
        timezone={timezone}
      />

      <section>
        <h2 className="mb-6 text-2xl font-bold">
          Events Near {continent === "North America" ? "You" : continent}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.title} className="card">
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={
                    event.type === "conference"
                      ? "badge-blue"
                      : event.type === "workshop"
                        ? "badge-green"
                        : event.type === "seminar"
                          ? "badge-amber"
                          : "badge-red"
                  }
                >
                  {event.type}
                </span>
                <span className="text-xs text-stanford-cool-grey">
                  {event.date}
                </span>
              </div>
              <h3 className="font-semibold text-stanford-black">
                {event.title}
              </h3>
              <p className="mt-1 text-sm text-stanford-cool-grey">
                {event.description}
              </p>
              <p className="mt-3 text-xs font-medium text-stanford-red">
                {event.location}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">How Geo Resolution Works</h2>
        <div className="code-block">
          <pre>{`1. Request arrives at Vercel Edge Network
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
