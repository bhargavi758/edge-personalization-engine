import { NextRequest, NextResponse } from "next/server";
import { getAllFlags, getFlag } from "@/lib/features/flags";
import { evaluateAllFlags } from "@/lib/features/evaluate";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const flagId = searchParams.get("id");
  const visitorId = searchParams.get("visitor_id") ?? "anonymous";
  const country = searchParams.get("country") ?? "US";
  const region = searchParams.get("region") ?? "CA";
  const evaluate = searchParams.get("evaluate") === "true";

  if (flagId) {
    const flag = getFlag(flagId);
    if (!flag) {
      return NextResponse.json(
        { error: `Flag '${flagId}' not found` },
        { status: 404 }
      );
    }

    if (evaluate) {
      const result = evaluateAllFlags({
        visitorId,
        country,
        region,
        cookies: {},
        headers: {},
      });

      return NextResponse.json({
        flag,
        evaluated: result[flagId] ?? flag.defaultValue,
        context: { visitorId, country, region },
      });
    }

    return NextResponse.json({ flag });
  }

  const flags = getAllFlags();

  if (evaluate) {
    const results = evaluateAllFlags({
      visitorId,
      country,
      region,
      cookies: {},
      headers: {},
    });

    return NextResponse.json({
      flags: flags.map((f) => ({
        ...f,
        evaluated: results[f.id] ?? f.defaultValue,
      })),
      context: { visitorId, country, region },
    });
  }

  return NextResponse.json({ flags });
}
