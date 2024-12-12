import type { FeatureFlag } from "./types";

export const featureFlags: Record<string, FeatureFlag> = {
  dark_mode: {
    id: "dark_mode",
    name: "Dark Mode",
    description: "Enable dark mode theme toggle",
    enabled: true,
    rolloutPercentage: 100,
    targetRules: [],
    defaultValue: false,
  },
  new_dashboard: {
    id: "new_dashboard",
    name: "New Dashboard",
    description: "Redesigned analytics dashboard with live metrics",
    enabled: true,
    rolloutPercentage: 50,
    targetRules: [],
    defaultValue: false,
  },
  beta_search: {
    id: "beta_search",
    name: "Beta Search",
    description: "AI-powered fuzzy search with semantic matching",
    enabled: true,
    rolloutPercentage: 25,
    targetRules: [
      {
        attribute: "country",
        operator: "in",
        value: ["US", "GB", "CA"],
      },
    ],
    defaultValue: false,
  },
  maintenance_banner: {
    id: "maintenance_banner",
    name: "Maintenance Banner",
    description: "Show scheduled maintenance notification",
    enabled: false,
    rolloutPercentage: 100,
    targetRules: [],
    defaultValue: false,
  },
  live_collaboration: {
    id: "live_collaboration",
    name: "Live Collaboration",
    description: "Real-time collaborative editing features",
    enabled: true,
    rolloutPercentage: 10,
    targetRules: [
      {
        attribute: "region",
        operator: "equals",
        value: "CA",
      },
    ],
    defaultValue: false,
  },
};

export function getAllFlags(): FeatureFlag[] {
  return Object.values(featureFlags);
}

export function getFlag(id: string): FeatureFlag | undefined {
  return featureFlags[id];
}
