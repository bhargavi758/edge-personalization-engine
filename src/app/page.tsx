import { headers } from "next/headers";
import { getRegionalHero } from "@/lib/geo/content";
import { deserializeFlags } from "@/lib/features/evaluate";
import { FLAGS_HEADER } from "@/lib/features/types";
import { ExperimentBanner } from "./_components/ExperimentBanner";
import { AnalyticsProvider } from "./_components/AnalyticsProvider";
import { cn } from "@/lib/utils";

export const revalidate = 300;

async function getEdgeContext() {
  const h = headers();
  return {
    continent: h.get("x-geo-continent") ?? "North America",
    country: h.get("x-geo-country") ?? "US",
    region: h.get("x-geo-region") ?? "CA",
    city: h.get("x-geo-city") ?? "San Francisco",
    timezone: h.get("x-geo-timezone") ?? "America/Los_Angeles",
    visitorId: h.get("x-visitor-id") ?? "unknown",
    sessionId: h.get("x-session-id") ?? "unknown",
    heroVariant: h.get("x-experiment-hero_redesign") ?? "control",
    flags: deserializeFlags(h.get(FLAGS_HEADER) ?? "{}"),
  };
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4")}>
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-mono text-lg font-semibold text-card-foreground">
        {value}
      </p>
    </div>
  );
}

function ArchitectureDiagram() {
  const steps = [
    {
      title: "Edge Middleware",
      description:
        "Runs at the CDN edge before the request hits the origin. Resolves geolocation, assigns experiments, evaluates feature flags.",
      icon: (
        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.467.732-3.558" />
        </svg>
      ),
    },
    {
      title: "A/B Testing",
      description:
        "Consistent hash-based assignment ensures visitors always see the same variant. Sticky cookies prevent flickering.",
      icon: (
        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714a2.25 2.25 0 0 0 .659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-1.341 4.023a2.25 2.25 0 0 1-2.134 1.527H8.475a2.25 2.25 0 0 1-2.134-1.527L5 14.5m14 0H5" />
        </svg>
      ),
    },
    {
      title: "ISR Caching",
      description:
        "Pages use Incremental Static Regeneration with configurable revalidation intervals and on-demand purge support.",
      icon: (
        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>
      ),
    },
  ];

  return (
    <section className="px-6 py-10">
      <h2 className="text-lg font-semibold text-foreground">How It Works</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Every request passes through Edge Middleware before reaching the origin, enabling personalization at the network layer.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <div key={step.title} className={cn("rounded-lg border border-border bg-card p-5")}>
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
              {step.icon}
            </div>
            <h3 className="text-sm font-semibold text-card-foreground">{step.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
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
      badge: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Feature Flags",
      description: "Runtime toggles with percentage rollout, geo-targeting, and consistent evaluation.",
      href: "/features",
      badge: "bg-primary/10 text-primary",
    },
    {
      title: "Experiments",
      description: "Hash-based A/B test assignment with sticky sessions and multi-variant support.",
      href: "/experiments",
      badge: "bg-amber-500/10 text-amber-600",
    },
  ];

  return (
    <section className="border-t border-border bg-muted/50 px-6 py-10">
      <h2 className="text-lg font-semibold text-foreground">Explore the Demos</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <a
            key={f.title}
            href={f.href}
            className={cn(
              "group rounded-lg border border-border bg-card p-5 transition-all",
              "hover:border-primary/30 hover:shadow-sm"
            )}
          >
            <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", f.badge)}>
              {f.title}
            </span>
            <p className="mt-3 text-sm text-muted-foreground group-hover:text-foreground">
              {f.description}
            </p>
            <span className="mt-3 inline-flex items-center text-xs font-medium text-primary">
              View demo
              <svg className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </a>
        ))}
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

      <section className={cn("border-b border-border bg-sidebar px-6 py-10 text-white")}>
        <div className="max-w-3xl">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-sidebar-foreground">
            {hero.greeting} from {ctx.city}, {ctx.country}
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {ctx.heroVariant === "variant_a" ? (
              <>
                <span className="block">Edge-First</span>
                <span className="block text-primary">Personalization</span>
              </>
            ) : (
              hero.headline
            )}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-sidebar-foreground">
            {hero.subheadline}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/experiments"
              className={cn(
                "inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
                "transition-colors hover:bg-primary/90"
              )}
            >
              {hero.ctaText}
            </a>
            <a
              href="/features"
              className={cn(
                "inline-flex items-center rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white",
                "transition-colors hover:border-white/40 hover:bg-white/5"
              )}
            >
              View Feature Flags
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Continent", value: ctx.continent },
            { label: "Country", value: ctx.country },
            { label: "Timezone", value: ctx.timezone },
            { label: "Hero Variant", value: ctx.heroVariant },
          ].map((item) => (
            <MetricCard key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </section>

      <ArchitectureDiagram />
      <FeatureCards />
    </AnalyticsProvider>
  );
}
