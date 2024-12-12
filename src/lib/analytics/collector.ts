import type { AnalyticsEvent } from "./types";

const eventBuffer: AnalyticsEvent[] = [];
const MAX_BUFFER_SIZE = 1000;

export function collectEvent(event: AnalyticsEvent): void {
  if (eventBuffer.length >= MAX_BUFFER_SIZE) {
    eventBuffer.shift();
  }
  eventBuffer.push(event);
}

export function getRecentEvents(limit = 50): AnalyticsEvent[] {
  return eventBuffer.slice(-limit);
}

export function getEventsByType(type: AnalyticsEvent["type"]): AnalyticsEvent[] {
  return eventBuffer.filter((e) => e.type === type);
}

export function getEventCount(): number {
  return eventBuffer.length;
}

export function clearEvents(): void {
  eventBuffer.length = 0;
}

export function createPageViewEvent(params: {
  visitorId: string;
  sessionId: string;
  path: string;
  country: string;
  region: string;
  continent: string;
  referrer: string;
  userAgent: string;
}): AnalyticsEvent {
  return {
    type: "page_view",
    timestamp: Date.now(),
    visitorId: params.visitorId,
    sessionId: params.sessionId,
    path: params.path,
    properties: {
      country: params.country,
      region: params.region,
      continent: params.continent,
      referrer: params.referrer,
      userAgent: params.userAgent,
    },
  };
}

export function createExperimentEvent(params: {
  visitorId: string;
  sessionId: string;
  path: string;
  experimentId: string;
  variantId: string;
  isNewAssignment: boolean;
}): AnalyticsEvent {
  return {
    type: "experiment_assignment",
    timestamp: Date.now(),
    visitorId: params.visitorId,
    sessionId: params.sessionId,
    path: params.path,
    properties: {
      experimentId: params.experimentId,
      variantId: params.variantId,
      isNewAssignment: params.isNewAssignment,
    },
  };
}
