import { headers } from "next/headers";
import { getAllFlags } from "@/lib/features/flags";
import { deserializeFlags } from "@/lib/features/evaluate";
import { FLAGS_HEADER } from "@/lib/features/types";
import type { FeatureFlag } from "@/lib/features/types";
import { FeatureGate } from "@/app/_components/FeatureGate";

export const dynamic = "force-dynamic";

function FlagCard({
  flag,
  isEnabled,
}: {
  flag: FeatureFlag;
  isEnabled: boolean;
}) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-stanford-black">
              {flag.name}
            </h3>
            <span className={isEnabled ? "badge-green" : "badge-red"}>
              {isEnabled ? "ON" : "OFF"}
            </span>
          </div>
          <p className="mt-1 text-sm text-stanford-cool-grey">
            {flag.description}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-stanford-fog px-3 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-stanford-cool-grey">
            Rollout
          </p>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-stanford-red transition-all"
                style={{ width: `${flag.rolloutPercentage}%` }}
              />
            </div>
            <span className="text-sm font-semibold">
              {flag.rolloutPercentage}%
            </span>
          </div>
        </div>

        <div className="rounded-lg bg-stanford-fog px-3 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-stanford-cool-grey">
            Global Toggle
          </p>
          <p className="mt-1 text-sm font-semibold">
            {flag.enabled ? "Enabled" : "Disabled"}
          </p>
        </div>

        <div className="rounded-lg bg-stanford-fog px-3 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-stanford-cool-grey">
            Target Rules
          </p>
          <p className="mt-1 text-sm font-semibold">
            {flag.targetRules.length === 0
              ? "None"
              : `${flag.targetRules.length} rule${flag.targetRules.length > 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {flag.targetRules.length > 0 && (
        <div className="mt-3 space-y-1">
          {flag.targetRules.map((rule, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs text-stanford-cool-grey"
            >
              <span className="badge-amber">{rule.attribute}</span>
              <span>{rule.operator}</span>
              <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">
                {Array.isArray(rule.value)
                  ? rule.value.join(", ")
                  : rule.value}
              </code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FeaturesPage() {
  const h = headers();
  const evaluatedFlags = deserializeFlags(h.get(FLAGS_HEADER) ?? "{}");
  const allFlags = getAllFlags();

  const enabledCount = Object.values(evaluatedFlags).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="section-heading">Feature Flags</h1>
        <p className="section-subheading max-w-2xl">
          Flags are evaluated at the edge on every request. They support
          percentage-based rollout, geographic targeting, and consistent
          evaluation tied to the visitor ID.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="card bg-stanford-fog">
          <p className="text-3xl font-bold text-stanford-red">
            {allFlags.length}
          </p>
          <p className="text-sm text-stanford-cool-grey">Total Flags</p>
        </div>
        <div className="card bg-stanford-fog">
          <p className="text-3xl font-bold text-emerald-600">{enabledCount}</p>
          <p className="text-sm text-stanford-cool-grey">Enabled For You</p>
        </div>
        <div className="card bg-stanford-fog">
          <p className="text-3xl font-bold text-stanford-black">
            {allFlags.filter((f) => f.targetRules.length > 0).length}
          </p>
          <p className="text-sm text-stanford-cool-grey">With Target Rules</p>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Evaluation Pipeline</h2>
        <div className="code-block">
          <pre>{`1. Request hits Edge Middleware
2. Visitor ID extracted from cookie
3. For each flag:
   a. Check global enabled toggle → OFF means default value
   b. Evaluate target rules (geo, cookies, headers)
   c. If all rules match → check rollout percentage
   d. hash(visitorId + flagId) % 100 < rolloutPercentage → enabled
4. All evaluated flags serialized to x-feature-flags header
5. Pages read header and render conditionally`}</pre>
        </div>
      </section>

      <FeatureGate flagId="new_dashboard" flags={evaluatedFlags}>
        <div className="mb-8 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6">
          <p className="text-sm font-semibold text-emerald-800">
            You are seeing the New Dashboard feature
          </p>
          <p className="mt-1 text-sm text-emerald-700">
            This content is gated behind the <code className="rounded bg-emerald-100 px-1 font-mono text-xs">new_dashboard</code> flag and only
            visible when the flag evaluates to true for your visitor ID.
          </p>
        </div>
      </FeatureGate>

      <div className="space-y-6">
        {allFlags.map((flag) => (
          <FlagCard
            key={flag.id}
            flag={flag}
            isEnabled={evaluatedFlags[flag.id] ?? false}
          />
        ))}
      </div>
    </div>
  );
}
