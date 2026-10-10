import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/security/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return NextResponse.json({ authenticated: hasValidSession(req) }, { headers: { "Cache-Control": "no-store" } });
}
