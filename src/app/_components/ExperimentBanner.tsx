"use client";

interface ExperimentBannerProps {
  experimentId: string;
  variant: string;
}

export function ExperimentBanner({
  experimentId,
  variant,
}: ExperimentBannerProps) {
  return (
    <div className="border-b border-stanford-red/20 bg-stanford-red/5 px-4 py-2">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 text-sm">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stanford-red text-[10px] font-bold text-white">
          A/B
        </span>
        <span className="text-stanford-cool-grey">
          Experiment{" "}
          <code className="rounded bg-stanford-red/10 px-1.5 py-0.5 font-mono text-xs text-stanford-red">
            {experimentId}
          </code>{" "}
          — you are in variant{" "}
          <code className="rounded bg-stanford-red/10 px-1.5 py-0.5 font-mono text-xs font-semibold text-stanford-red">
            {variant}
          </code>
        </span>
      </div>
    </div>
  );
}
