import type { EvaluatedFlags, FeatureFlag, TargetRule } from "./types";
import { getAllFlags } from "./flags";

interface EvaluationContext {
  visitorId: string;
  country: string;
  region: string;
  cookies: Record<string, string>;
  headers: Record<string, string>;
}

function fnv1aHash(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function isInRollout(
  visitorId: string,
  flagId: string,
  percentage: number
): boolean {
  if (percentage >= 100) return true;
  if (percentage <= 0) return false;

  const hash = fnv1aHash(`${visitorId}:flag:${flagId}`);
  const bucket = hash % 100;
  return bucket < percentage;
}

function evaluateRule(rule: TargetRule, context: EvaluationContext): boolean {
  let actual: string;

  switch (rule.attribute) {
    case "country":
      actual = context.country;
      break;
    case "region":
      actual = context.region;
      break;
    case "cookie":
      actual = context.cookies[typeof rule.value === "string" ? rule.value : ""] ?? "";
      break;
    case "header":
      actual = context.headers[typeof rule.value === "string" ? rule.value : ""] ?? "";
      break;
    default:
      return false;
  }

  switch (rule.operator) {
    case "equals":
      return actual === rule.value;
    case "contains":
      return typeof rule.value === "string" && actual.includes(rule.value);
    case "in":
      return Array.isArray(rule.value) && rule.value.includes(actual);
    default:
      return false;
  }
}

function evaluateFlag(
  flag: FeatureFlag,
  context: EvaluationContext
): boolean {
  if (!flag.enabled) return flag.defaultValue;

  if (flag.targetRules.length > 0) {
    const matchesAllRules = flag.targetRules.every((rule) =>
      evaluateRule(rule, context)
    );
    if (!matchesAllRules) return flag.defaultValue;
  }

  return isInRollout(context.visitorId, flag.id, flag.rolloutPercentage);
}

export function evaluateAllFlags(context: EvaluationContext): EvaluatedFlags {
  const flags = getAllFlags();
  const results: EvaluatedFlags = {};

  for (const flag of flags) {
    results[flag.id] = evaluateFlag(flag, context);
  }

  return results;
}

export function serializeFlags(flags: EvaluatedFlags): string {
  return JSON.stringify(flags);
}

export function deserializeFlags(raw: string): EvaluatedFlags {
  try {
    return JSON.parse(raw) as EvaluatedFlags;
  } catch {
    return {};
  }
}
