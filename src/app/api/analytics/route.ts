import { NextRequest, NextResponse } from "next/server";
import {
  collectEvent,
  getRecentEvents,
  getEventCount,
} from "@/lib/analytics/collector";
import type { AnalyticsEvent } from "@/lib/analytics/types";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const event = body as Partial<AnalyticsEvent>;

  if (!event.type || !event.visitorId || !event.path) {
    return NextResponse.json(
      { error: "Missing required fields: type, visitorId, path" },
      { status: 400 }
    );
  }

  collectEvent({
    type: event.type,
    timestamp: event.timestamp ?? Date.now(),
    visitorId: event.visitorId,
    sessionId: event.sessionId ?? "unknown",
    path: event.path,
    properties: event.properties ?? {},
  });

  return NextResponse.json({ received: true, total: getEventCount() });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);
  const type = searchParams.get("type") as AnalyticsEvent["type"] | null;

  let events = getRecentEvents(limit);
  if (type) {
    events = events.filter((e) => e.type === type);
  }

  return NextResponse.json({
    events,
    total: getEventCount(),
    filtered: events.length,
  });
}
