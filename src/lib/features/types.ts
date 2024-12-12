export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  targetRules: TargetRule[];
  defaultValue: boolean;
}

export interface TargetRule {
  attribute: "country" | "region" | "cookie" | "header";
  operator: "equals" | "contains" | "in";
  value: string | string[];
}

export interface EvaluatedFlags {
  [flagId: string]: boolean;
}

export const FLAGS_HEADER = "x-feature-flags" as const;
