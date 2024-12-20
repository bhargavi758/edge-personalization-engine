import type { EvaluatedFlags } from "@/lib/features/types";

interface FeatureGateProps {
  flagId: string;
  flags: EvaluatedFlags;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({
  flagId,
  flags,
  children,
  fallback = null,
}: FeatureGateProps) {
  const isEnabled = flags[flagId] ?? false;

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
