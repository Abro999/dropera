const buckets = new Map<string, number[]>();
let lastSweep = 0;

export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim().slice(0, 64);
  return req.headers.get("x-real-ip")?.slice(0, 64) ?? "unknown";
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();

  if (now - lastSweep > 60_000) {
    lastSweep = now;
    buckets.forEach((hits, k) => {
      if (hits.every((t) => now - t > windowMs * 4)) buckets.delete(k);
    });
  }

  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  return { ok: true, retryAfter: 0 };
}
