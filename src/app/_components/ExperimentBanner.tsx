"use client";

import { cn } from "@/lib/utils";

interface ExperimentBannerProps {
  experimentId: string;
  variant: string;
}

export function ExperimentBanner({
  experimentId,
  variant,
}: ExperimentBannerProps) {
  return (
    <div className={cn("border-b border-primary/20 bg-primary/5 px-4 py-1.5")}>
      <div className="flex items-center justify-center gap-2 text-xs">
        <span className={cn(
          "flex h-4 w-4 items-center justify-center rounded bg-primary",
          "text-[8px] font-bold text-primary-foreground"
        )}>
          AB
        </span>
        <span className="text-muted-foreground">
          Experiment{" "}
          <code className="rounded bg-primary/10 px-1 py-0.5 font-mono text-[11px] text-primary">
            {experimentId}
          </code>{" "}
          &mdash; variant{" "}
          <code className="rounded bg-primary/10 px-1 py-0.5 font-mono text-[11px] font-semibold text-primary">
            {variant}
          </code>
        </span>
      </div>
    </div>
  );
}
