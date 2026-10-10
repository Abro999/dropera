import { NextResponse } from "next/server";
import { adminConfigError, createSessionToken, isSameOrigin, sessionCookie, verifyPassword } from "@/lib/security/auth";
import { clientIp, rateLimit } from "@/lib/security/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store" };

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Request blocked." }, { status: 403, headers });

  const configError = adminConfigError();
  if (configError) return NextResponse.json({ error: configError }, { status: 503, headers });

  const perIp = rateLimit(`admin-login:${clientIp(req)}`, 5, 15 * 60_000);
  const global = rateLimit("admin-login:all", 30, 15 * 60_000);
  if (!perIp.ok || !global.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a few minutes." },
      { status: 429, headers: { ...headers, "Retry-After": String(Math.max(perIp.retryAfter, global.retryAfter)) } }
    );
  }

  let password: unknown;
  try {
    ({ password } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400, headers });
  }

  if (!verifyPassword(password)) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return NextResponse.json({ error: "Wrong password." }, { status: 401, headers });
  }

  const res = NextResponse.json({ success: true }, { headers });
  res.cookies.set(sessionCookie(createSessionToken()));
  return res;
}
