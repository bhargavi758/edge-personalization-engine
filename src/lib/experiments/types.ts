export interface ExperimentVariant {
  id: string;
  name: string;
  weight: number;
  description: string;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  variants: ExperimentVariant[];
  startDate: string;
  endDate: string | null;
}

export interface ExperimentAssignment {
  experimentId: string;
  variantId: string;
  assignedAt: number;
}

export type ExperimentAssignments = Record<string, ExperimentAssignment>;

export const EXPERIMENT_COOKIE_PREFIX = "exp_" as const;
export const VISITOR_ID_COOKIE = "vid" as const;
