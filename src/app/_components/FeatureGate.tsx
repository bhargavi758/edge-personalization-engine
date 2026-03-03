"use client";

interface FeatureGateProps {
  flagId: string;
  flags: Record<string, boolean>;
  children: React.ReactNode;
}

export function FeatureGate({ flagId, flags, children }: FeatureGateProps) {
  if (!flags[flagId]) return null;
  return <>{children}</>;
}
