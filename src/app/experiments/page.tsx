import { headers } from "next/headers";
import { experiments, getActiveExperiments } from "@/lib/experiments/config";
import type { Experiment } from "@/lib/experiments/types";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

function ExperimentCard({ experiment }: { experiment: Experiment }) {
  const h = headers();
  const currentVariant = h.get(`x-experiment-${experiment.id}`) ?? "none";
  const isActive = experiment.enabled;

  return (
    <div className={cn("rounded-lg border border-border bg-card")}>
      <div className="flex items-start justify-between p-5">
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">
            {experiment.name}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {experiment.description}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium",
            isActive
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", isActive ? "bg-primary" : "bg-muted-foreground")} />
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="border-t border-border px-5 py-4">
        <p className="mb-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Variants
        </p>
        <div className="space-y-1.5">
          {experiment.variants.map((variant) => {
            const isAssigned = variant.id === currentVariant;
            return (
              <div
                key={variant.id}
                className={cn(
                  "flex items-center justify-between rounded-md border px-3 py-2 text-sm",
                  isAssigned
                    ? "border-primary/30 bg-primary/5"
                    : "border-border"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      isAssigned ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  />
                  <div>
                    <p className="text-xs font-medium text-card-foreground">{variant.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {variant.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {variant.weight}%
                  </span>
                  {isAssigned && (
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                      YOU
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-border px-5 py-3 font-mono text-[11px] text-muted-foreground">
        <span>ID: {experiment.id}</span>
        <span className="text-border">|</span>
        <span>Started: {experiment.startDate}</span>
        {experiment.endDate && (
          <>
            <span className="text-border">|</span>
            <span>Ends: {experiment.endDate}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function ExperimentsPage() {
  const active = getActiveExperiments();
  const all = Object.values(experiments);

  return (
    <div className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-foreground">A/B Testing</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Experiments are assigned at the edge via middleware. Each visitor gets
          a deterministic variant based on their visitor ID, ensuring consistent
          experiences across sessions.
        </p>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total Experiments", value: all.length, accent: "text-primary" },
          { label: "Active Now", value: active.length, accent: "text-primary" },
          { label: "Total Variants", value: all.reduce((sum, e) => sum + e.variants.length, 0), accent: "text-foreground" },
        ].map((stat) => (
          <div key={stat.label} className={cn("rounded-lg border border-border bg-card p-4")}>
            <p className={cn("font-mono text-2xl font-bold", stat.accent)}>
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-foreground">How It Works</h2>
        <div className="rounded-lg border border-border bg-sidebar p-4 font-mono text-xs leading-relaxed text-sidebar-foreground">
          <pre className="whitespace-pre-wrap">{`1. Visitor arrives → Edge Middleware runs
2. Middleware reads visitor ID from cookie (or generates new one)
3. For each active experiment:
   a. Check if assignment cookie already exists → sticky session
   b. If not, hash(visitorId + experimentId) → deterministic bucket
   c. Map bucket to variant based on traffic weights
   d. Set assignment cookie (90-day TTL)
4. Variant ID passed to page via request header
5. Page renders variant-specific content`}</pre>
        </div>
      </section>

      <div className="space-y-4">
        {all.map((experiment) => (
          <ExperimentCard key={experiment.id} experiment={experiment} />
        ))}
      </div>
    </div>
  );
}
