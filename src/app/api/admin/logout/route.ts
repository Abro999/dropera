import { NextResponse } from "next/server";
import { clearedCookie, isSameOrigin } from "@/lib/security/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Request blocked." }, { status: 403 });
  const res = NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  res.cookies.set(clearedCookie());
  return res;
}
