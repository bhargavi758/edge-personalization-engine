import { headers } from "next/headers";
import { getAllFlags } from "@/lib/features/flags";
import { deserializeFlags } from "@/lib/features/evaluate";
import { FLAGS_HEADER } from "@/lib/features/types";
import type { FeatureFlag } from "@/lib/features/types";
import { FeatureGate } from "@/app/_components/FeatureGate";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

function FlagCard({
  flag,
  isEnabled,
}: {
  flag: FeatureFlag;
  isEnabled: boolean;
}) {
  return (
    <div className={cn("rounded-lg border border-border bg-card")}>
      <div className="flex items-start justify-between p-5">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-card-foreground">
              {flag.name}
            </h3>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium",
                isEnabled
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", isEnabled ? "bg-primary" : "bg-muted-foreground")} />
              {isEnabled ? "ON" : "OFF"}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {flag.description}
          </p>
        </div>
      </div>

      <div className="grid gap-3 border-t border-border px-5 py-4 sm:grid-cols-3">
        <div className="rounded-md bg-muted/50 px-3 py-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Rollout
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${flag.rolloutPercentage}%` }}
              />
            </div>
            <span className="font-mono text-xs font-semibold text-card-foreground">
              {flag.rolloutPercentage}%
            </span>
          </div>
        </div>

        <div className="rounded-md bg-muted/50 px-3 py-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Global Toggle
          </p>
          <p className="mt-1.5 text-xs font-semibold text-card-foreground">
            {flag.enabled ? "Enabled" : "Disabled"}
          </p>
        </div>

        <div className="rounded-md bg-muted/50 px-3 py-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Target Rules
          </p>
          <p className="mt-1.5 text-xs font-semibold text-card-foreground">
            {flag.targetRules.length === 0
              ? "None"
              : `${flag.targetRules.length} rule${flag.targetRules.length > 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {flag.targetRules.length > 0 && (
        <div className="border-t border-border px-5 py-3 space-y-1.5">
          {flag.targetRules.map((rule, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[11px] font-medium text-amber-600">
                {rule.attribute}
              </span>
              <span>{rule.operator}</span>
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-card-foreground">
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
    <div className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-foreground">Feature Flags</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Flags are evaluated at the edge on every request. They support
          percentage-based rollout, geographic targeting, and consistent
          evaluation tied to the visitor ID.
        </p>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total Flags", value: allFlags.length, accent: "text-primary" },
          { label: "Enabled For You", value: enabledCount, accent: "text-primary" },
          { label: "With Target Rules", value: allFlags.filter((f) => f.targetRules.length > 0).length, accent: "text-foreground" },
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
        <h2 className="mb-3 text-sm font-semibold text-foreground">Evaluation Pipeline</h2>
        <div className="rounded-lg border border-border bg-sidebar p-4 font-mono text-xs leading-relaxed text-sidebar-foreground">
          <pre className="whitespace-pre-wrap">{`1. Request hits Edge Middleware
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
        <div className={cn("mb-6 rounded-lg border border-primary/30 bg-primary/5 p-5")}>
          <p className="text-sm font-semibold text-primary">
            You are seeing the New Dashboard feature
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            This content is gated behind the{" "}
            <code className="rounded bg-primary/10 px-1 font-mono text-[11px] text-primary">new_dashboard</code>{" "}
            flag and only visible when the flag evaluates to true for your visitor ID.
          </p>
        </div>
      </FeatureGate>

      <div className="space-y-4">
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
