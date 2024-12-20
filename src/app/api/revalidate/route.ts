import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET ?? "dev-secret";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { secret, path, tag } = body as {
    secret?: string;
    path?: string;
    tag?: string;
  };

  if (secret !== REVALIDATION_SECRET) {
    return NextResponse.json(
      { error: "Invalid revalidation secret" },
      { status: 401 }
    );
  }

  if (!path && !tag) {
    return NextResponse.json(
      { error: "Provide either 'path' or 'tag' to revalidate" },
      { status: 400 }
    );
  }

  const revalidated: string[] = [];

  if (path) {
    revalidatePath(path);
    revalidated.push(`path:${path}`);
  }

  if (tag) {
    revalidateTag(tag);
    revalidated.push(`tag:${tag}`);
  }

  return NextResponse.json({
    revalidated,
    timestamp: Date.now(),
  });
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    description: "On-demand ISR revalidation endpoint",
    usage: {
      method: "POST",
      body: {
        secret: "string (required)",
        path: "string (optional) — e.g. '/' or '/regional'",
        tag: "string (optional) — e.g. 'short-lived'",
      },
    },
  });
}
