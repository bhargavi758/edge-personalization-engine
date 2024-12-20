import { headers } from "next/headers";
import { getRegionalHero } from "@/lib/geo/content";
import { deserializeFlags } from "@/lib/features/evaluate";
import { FLAGS_HEADER } from "@/lib/features/types";
import { ExperimentBanner } from "./_components/ExperimentBanner";
import { AnalyticsProvider } from "./_components/AnalyticsProvider";

export const revalidate = 300;

async function getEdgeContext() {
  const h = headers();
  return {
    continent: h.get("x-geo-continent") ?? "North America",
    country: h.get("x-geo-country") ?? "US",
    region: h.get("x-geo-region") ?? "CA",
    city: h.get("x-geo-city") ?? "Stanford",
    timezone: h.get("x-geo-timezone") ?? "America/Los_Angeles",
    visitorId: h.get("x-visitor-id") ?? "unknown",
    sessionId: h.get("x-session-id") ?? "unknown",
    heroVariant: h.get("x-experiment-hero_redesign") ?? "control",
    flags: deserializeFlags(h.get(FLAGS_HEADER) ?? "{}"),
  };
}

function ArchitectureDiagram() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="section-heading text-center">How It Works</h2>
      <p className="section-subheading mx-auto max-w-2xl text-center">
        Every request passes through Edge Middleware before reaching the
        origin, enabling personalization at the network layer.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="card text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-stanford-red/10">
            <svg className="h-7 w-7 text-stanford-red" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.467.732-3.558" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Edge Middleware</h3>
          <p className="mt-2 text-sm text-stanford-cool-grey">
            Runs at the CDN edge before the request hits the origin. Resolves
            geolocation, assigns experiments, evaluates feature flags.
          </p>
        </div>

        <div className="card text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-stanford-red/10">
            <svg className="h-7 w-7 text-stanford-red" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714a2.25 2.25 0 0 0 .659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-1.341 4.023a2.25 2.25 0 0 1-2.134 1.527H8.475a2.25 2.25 0 0 1-2.134-1.527L5 14.5m14 0H5" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">A/B Testing</h3>
          <p className="mt-2 text-sm text-stanford-cool-grey">
            Consistent hash-based assignment ensures visitors always see the
            same variant. Sticky cookies prevent flickering.
          </p>
        </div>

        <div className="card text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-stanford-red/10">
            <svg className="h-7 w-7 text-stanford-red" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">ISR Caching</h3>
          <p className="mt-2 text-sm text-stanford-cool-grey">
            Pages use Incremental Static Regeneration with configurable
            revalidation intervals and on-demand purge support.
          </p>
        </div>
      </div>
    </section>
  );
}

function FeatureCards() {
  const features = [
    {
      title: "Geolocation",
      description: "Content adapts based on visitor continent, country, and timezone detected at the edge.",
      href: "/regional",
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Feature Flags",
      description: "Runtime toggles with percentage rollout, geo-targeting, and consistent evaluation.",
      href: "/features",
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Experiments",
      description: "Hash-based A/B test assignment with sticky sessions and multi-variant support.",
      href: "/experiments",
      color: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <section className="bg-stanford-fog py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="section-heading text-center">Explore the Demos</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <a key={f.title} href={f.href} className="card group">
              <span className={`badge ${f.color}`}>{f.title}</span>
              <p className="mt-4 text-sm text-stanford-cool-grey group-hover:text-stanford-black">
                {f.description}
              </p>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-stanford-red">
                View demo
                <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const ctx = await getEdgeContext();
  const hero = getRegionalHero(ctx.continent);

  return (
    <AnalyticsProvider visitorId={ctx.visitorId} sessionId={ctx.sessionId}>
      <ExperimentBanner variant={ctx.heroVariant} experimentId="hero_redesign" />

      <section className="relative overflow-hidden bg-gradient-to-br from-stanford-red to-stanford-red-dark py-20 text-white sm:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-white" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-white/70">
              {hero.greeting} from {ctx.city}, {ctx.country}
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {ctx.heroVariant === "variant_a" ? (
                <>
                  <span className="block">Edge-First</span>
                  <span className="block text-stanford-warm">
                    Personalization
                  </span>
                </>
              ) : (
                hero.headline
              )}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90">
              {hero.subheadline}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/experiments" className="inline-flex items-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-stanford-red transition-colors hover:bg-gray-100">
                {hero.ctaText}
              </a>
              <a href="/features" className="inline-flex items-center rounded-md border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10">
                View Feature Flags
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Continent", value: ctx.continent },
            { label: "Country", value: ctx.country },
            { label: "Timezone", value: ctx.timezone },
            { label: "Hero Variant", value: ctx.heroVariant },
          ].map((item) => (
            <div key={item.label} className="card">
              <p className="text-xs font-medium uppercase tracking-wide text-stanford-cool-grey">
                {item.label}
              </p>
              <p className="mt-1 text-lg font-semibold text-stanford-black">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <ArchitectureDiagram />
      <FeatureCards />
    </AnalyticsProvider>
  );
}
