"use client";

interface AnalyticsProviderProps {
  visitorId: string;
  sessionId: string;
  children: React.ReactNode;
}

export function AnalyticsProvider({
  children,
}: AnalyticsProviderProps) {
  return <>{children}</>;
}
