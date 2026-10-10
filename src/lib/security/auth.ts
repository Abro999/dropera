import crypto from "crypto";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE = "dropera_admin";
const SESSION_SECONDS = 60 * 60 * 8;
const MIN_PASSWORD_LENGTH = 10;

function digest(value: string) {
  return crypto.createHash("sha256").update(value).digest();
}

function sessionKey() {
  const explicit = process.env.ADMIN_SESSION_SECRET;
  if (explicit && explicit.length >= 32) return explicit;
  return digest(`dropera-session:${process.env.ADMIN_PASSWORD ?? ""}`).toString("hex");
}

function sign(payload: string) {
  return crypto.createHmac("sha256", sessionKey()).update(payload).digest("hex");
}

function safeEqual(a: string | Buffer, b: string | Buffer) {
  const ba = Buffer.isBuffer(a) ? a : Buffer.from(a);
  const bb = Buffer.isBuffer(b) ? b : Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

export function adminConfigError(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || pw.length < MIN_PASSWORD_LENGTH) {
    return `Admin is disabled: set ADMIN_PASSWORD (at least ${MIN_PASSWORD_LENGTH} characters) on the server.`;
  }
  return null;
}

export function verifyPassword(input: unknown): boolean {
  if (adminConfigError()) return false;
  if (typeof input !== "string" || input.length === 0 || input.length > 200) return false;
  return safeEqual(digest(input), digest(process.env.ADMIN_PASSWORD as string));
}

export function createSessionToken() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const nonce = crypto.randomBytes(8).toString("hex");
  const payload = `${expires}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

function readCookie(req: Request, name: string) {
  const header = req.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) return decodeURIComponent(part.slice(idx + 1).trim());
  }
  return null;
}

export function hasValidSession(req: Request): boolean {
  if (adminConfigError()) return false;
  const token = readCookie(req, ADMIN_COOKIE);
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expires, nonce, signature] = parts;
  if (!/^\d+$/.test(expires) || !/^[a-f0-9]{16}$/.test(nonce) || !/^[a-f0-9]{64}$/.test(signature)) return false;
  if (Number(expires) < Math.floor(Date.now() / 1000)) return false;
  return safeEqual(signature, sign(`${expires}.${nonce}`));
}

export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return !!host && new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function requireAdmin(req: Request, opts: { mutating?: boolean } = {}): NextResponse | null {
  if (opts.mutating && !isSameOrigin(req)) {
    return NextResponse.json({ error: "Request blocked." }, { status: 403 });
  }
  if (!hasValidSession(req)) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }
  return null;
}

export function sessionCookie(token: string) {
  return {
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_SECONDS,
  };
}

export function clearedCookie() {
  return { ...sessionCookie(""), maxAge: 0 };
}
