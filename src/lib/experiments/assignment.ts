import type { Experiment, ExperimentAssignment, ExperimentVariant } from "./types";
import { EXPERIMENT_COOKIE_PREFIX, VISITOR_ID_COOKIE } from "./types";
import { type NextRequest } from "next/server";

/**
 * FNV-1a hash produces a deterministic 32-bit integer from a string.
 * Used instead of crypto APIs to stay compatible with the Edge Runtime
 * while keeping assignments consistent for the same visitor + experiment pair.
 */
function fnv1aHash(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function selectVariant(
  variants: ExperimentVariant[],
  hashValue: number
): ExperimentVariant {
  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
  const bucket = hashValue % totalWeight;

  let cumulative = 0;
  for (const variant of variants) {
    cumulative += variant.weight;
    if (bucket < cumulative) {
      return variant;
    }
  }

  return variants[variants.length - 1];
}

export function getVisitorId(request: NextRequest): string {
  const existing = request.cookies.get(VISITOR_ID_COOKIE)?.value;
  if (existing) return existing;

  return crypto.randomUUID();
}

export function getExistingAssignment(
  request: NextRequest,
  experimentId: string
): ExperimentAssignment | null {
  const cookieName = `${EXPERIMENT_COOKIE_PREFIX}${experimentId}`;
  const raw = request.cookies.get(cookieName)?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as ExperimentAssignment;
    if (parsed.experimentId === experimentId && parsed.variantId) {
      return parsed;
    }
  } catch {
    // Corrupted cookie — reassign
  }
  return null;
}

export function assignExperiment(
  experiment: Experiment,
  visitorId: string
): ExperimentAssignment {
  const hashInput = `${visitorId}:${experiment.id}`;
  const hash = fnv1aHash(hashInput);
  const variant = selectVariant(experiment.variants, hash);

  return {
    experimentId: experiment.id,
    variantId: variant.id,
    assignedAt: Date.now(),
  };
}

export function serializeAssignment(assignment: ExperimentAssignment): string {
  return JSON.stringify(assignment);
}

export function getAssignmentCookieName(experimentId: string): string {
  return `${EXPERIMENT_COOKIE_PREFIX}${experimentId}`;
}
