import { headers } from "next/headers";
import { experiments, getActiveExperiments } from "@/lib/experiments/config";
import type { Experiment } from "@/lib/experiments/types";

export const dynamic = "force-dynamic";

function ExperimentCard({ experiment }: { experiment: Experiment }) {
  const h = headers();
  const currentVariant = h.get(`x-experiment-${experiment.id}`) ?? "none";
  const isActive = experiment.enabled;

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-stanford-black">
            {experiment.name}
          </h3>
          <p className="mt-1 text-sm text-stanford-cool-grey">
            {experiment.description}
          </p>
        </div>
        <span className={isActive ? "badge-green" : "badge-red"}>
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-stanford-cool-grey">
          Variants
        </p>
        <div className="space-y-2">
          {experiment.variants.map((variant) => {
            const isAssigned = variant.id === currentVariant;
            return (
              <div
                key={variant.id}
                className={`flex items-center justify-between rounded-lg border p-3 text-sm ${
                  isAssigned
                    ? "border-stanford-red bg-stanford-red/5"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      isAssigned ? "bg-stanford-red" : "bg-gray-300"
                    }`}
                  />
                  <div>
                    <p className="font-medium">{variant.name}</p>
                    <p className="text-xs text-stanford-cool-grey">
                      {variant.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stanford-cool-grey">
                    {variant.weight}% traffic
                  </span>
                  {isAssigned && (
                    <span className="badge-blue">You</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-4 text-xs text-stanford-cool-grey">
        <span>ID: {experiment.id}</span>
        <span>Started: {experiment.startDate}</span>
        {experiment.endDate && <span>Ends: {experiment.endDate}</span>}
      </div>
    </div>
  );
}

export default function ExperimentsPage() {
  const active = getActiveExperiments();
  const all = Object.values(experiments);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="section-heading">A/B Testing</h1>
        <p className="section-subheading max-w-2xl">
          Experiments are assigned at the edge via middleware. Each visitor gets
          a deterministic variant based on their visitor ID, ensuring consistent
          experiences across sessions.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="card bg-stanford-fog">
          <p className="text-3xl font-bold text-stanford-red">{all.length}</p>
          <p className="text-sm text-stanford-cool-grey">Total Experiments</p>
        </div>
        <div className="card bg-stanford-fog">
          <p className="text-3xl font-bold text-emerald-600">{active.length}</p>
          <p className="text-sm text-stanford-cool-grey">Active Now</p>
        </div>
        <div className="card bg-stanford-fog">
          <p className="text-3xl font-bold text-stanford-black">
            {all.reduce((sum, e) => sum + e.variants.length, 0)}
          </p>
          <p className="text-sm text-stanford-cool-grey">Total Variants</p>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">How It Works</h2>
        <div className="code-block">
          <pre>{`1. Visitor arrives → Edge Middleware runs
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

      <div className="space-y-6">
        {all.map((experiment) => (
          <ExperimentCard key={experiment.id} experiment={experiment} />
        ))}
      </div>
    </div>
  );
}
