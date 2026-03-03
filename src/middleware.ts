import { NextRequest, NextResponse } from "next/server";
import {
  GEO_HEADER_COUNTRY,
  GEO_HEADER_REGION,
  GEO_HEADER_CITY,
  GEO_COOKIE,
  resolveGeo,
} from "@/lib/geo/regions";
import {
  getVisitorId,
  getExistingAssignment,
  assignExperiment,
  serializeAssignment,
  getAssignmentCookieName,
} from "@/lib/experiments/assignment";
import { getActiveExperiments } from "@/lib/experiments/config";
import { VISITOR_ID_COOKIE } from "@/lib/experiments/types";
import { evaluateAllFlags, serializeFlags } from "@/lib/features/evaluate";
import { FLAGS_HEADER } from "@/lib/features/types";
import { SESSION_COOKIE } from "@/lib/analytics/types";
import { getPageCacheStrategy, getCacheHeaders } from "@/lib/cache/strategies";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};

// ─── Geo Resolution ────────────────────────────────────────────

function extractGeo(request: NextRequest) {
  const country =
    request.headers.get(GEO_HEADER_COUNTRY) ??
    request.geo?.country ??
    "US";
  const region =
    request.headers.get(GEO_HEADER_REGION) ??
    request.geo?.region ??
    "CA";
  const city =
    request.headers.get(GEO_HEADER_CITY) ??
    request.geo?.city ??
    "San Francisco";

  return resolveGeo(country, region, city);
}

// ─── Session Management ────────────────────────────────────────

function ensureSession(request: NextRequest): {
  sessionId: string;
  isNew: boolean;
} {
  const existing = request.cookies.get(SESSION_COOKIE)?.value;
  if (existing) {
    return { sessionId: existing, isNew: false };
  }
  return { sessionId: crypto.randomUUID(), isNew: true };
}

// ─── Experiment Assignment ─────────────────────────────────────

function resolveExperiments(request: NextRequest, visitorId: string) {
  const activeExperiments = getActiveExperiments();
  const assignments: Array<{
    experimentId: string;
    variantId: string;
    cookieName: string;
    cookieValue: string;
    isNew: boolean;
  }> = [];

  for (const experiment of activeExperiments) {
    const existing = getExistingAssignment(request, experiment.id);

    if (existing) {
      assignments.push({
        experimentId: experiment.id,
        variantId: existing.variantId,
        cookieName: getAssignmentCookieName(experiment.id),
        cookieValue: serializeAssignment(existing),
        isNew: false,
      });
    } else {
      const assignment = assignExperiment(experiment, visitorId);
      assignments.push({
        experimentId: experiment.id,
        variantId: assignment.variantId,
        cookieName: getAssignmentCookieName(experiment.id),
        cookieValue: serializeAssignment(assignment),
        isNew: true,
      });
    }
  }

  return assignments;
}

// ─── Feature Flag Evaluation ───────────────────────────────────

function resolveFeatureFlags(
  visitorId: string,
  country: string,
  region: string,
  request: NextRequest
) {
  const cookies: Record<string, string> = {};
  for (const cookie of request.cookies.getAll()) {
    cookies[cookie.name] = cookie.value;
  }

  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return evaluateAllFlags({
    visitorId,
    country,
    region,
    cookies,
    headers,
  });
}

// ─── Analytics Beacon ──────────────────────────────────────────

function buildAnalyticsHeaders(params: {
  visitorId: string;
  sessionId: string;
  country: string;
  region: string;
  continent: string;
  path: string;
}) {
  return {
    "x-analytics-visitor": params.visitorId,
    "x-analytics-session": params.sessionId,
    "x-analytics-country": params.country,
    "x-analytics-region": params.region,
    "x-analytics-continent": params.continent,
    "x-analytics-path": params.path,
    "x-analytics-timestamp": Date.now().toString(),
  };
}

// ─── Main Middleware ───────────────────────────────────────────

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const geo = extractGeo(request);
  const visitorId = getVisitorId(request);
  const { sessionId, isNew: isNewSession } = ensureSession(request);

  const experiments = resolveExperiments(request, visitorId);

  const flags = resolveFeatureFlags(
    visitorId,
    geo.country,
    geo.region,
    request
  );

  const cacheStrategy = getPageCacheStrategy(pathname);
  const cacheHeaders = getCacheHeaders(cacheStrategy);

  const analyticsHeaders = buildAnalyticsHeaders({
    visitorId,
    sessionId,
    country: geo.country,
    region: geo.region,
    continent: geo.continent,
    path: pathname,
  });

  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-geo-country", geo.country);
  requestHeaders.set("x-geo-region", geo.region);
  requestHeaders.set("x-geo-city", geo.city);
  requestHeaders.set("x-geo-timezone", geo.timezone);
  requestHeaders.set("x-geo-continent", geo.continent);
  requestHeaders.set("x-visitor-id", visitorId);
  requestHeaders.set("x-session-id", sessionId);
  requestHeaders.set(FLAGS_HEADER, serializeFlags(flags));

  for (const exp of experiments) {
    requestHeaders.set(`x-experiment-${exp.experimentId}`, exp.variantId);
  }

  for (const [key, value] of Object.entries(analyticsHeaders)) {
    requestHeaders.set(key, value);
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  for (const [key, value] of Object.entries(cacheHeaders)) {
    response.headers.set(key, value);
  }

  response.headers.set("x-edge-personalized", "true");
  response.headers.set("x-cache-strategy", cacheStrategy);

  if (!request.cookies.get(VISITOR_ID_COOKIE)) {
    response.cookies.set(VISITOR_ID_COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  if (isNewSession) {
    response.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 30,
      path: "/",
    });
  }

  for (const exp of experiments) {
    if (exp.isNew) {
      response.cookies.set(exp.cookieName, exp.cookieValue, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 90,
        path: "/",
      });
    }
  }

  response.cookies.set(
    GEO_COOKIE,
    JSON.stringify({
      country: geo.country,
      region: geo.region,
      city: geo.city,
      continent: geo.continent,
      timezone: geo.timezone,
    }),
    {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    }
  );

  return response;
}
