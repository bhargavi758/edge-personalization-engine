export interface AnalyticsEvent {
  type: "page_view" | "experiment_assignment" | "feature_flag_evaluation" | "cta_click" | "custom";
  timestamp: number;
  visitorId: string;
  sessionId: string;
  path: string;
  properties: Record<string, string | number | boolean>;
}

export interface PageViewEvent extends AnalyticsEvent {
  type: "page_view";
  properties: {
    country: string;
    region: string;
    continent: string;
    referrer: string;
    userAgent: string;
  };
}

export interface ExperimentEvent extends AnalyticsEvent {
  type: "experiment_assignment";
  properties: {
    experimentId: string;
    variantId: string;
    isNewAssignment: boolean;
  };
}

export interface FeatureFlagEvent extends AnalyticsEvent {
  type: "feature_flag_evaluation";
  properties: {
    flagId: string;
    enabled: boolean;
    reason: string;
  };
}

export const ANALYTICS_ENDPOINT = "/api/analytics" as const;
export const SESSION_COOKIE = "sid" as const;
