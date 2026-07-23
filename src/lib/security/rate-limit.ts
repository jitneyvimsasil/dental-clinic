import "server-only";

// In-memory per-IP limiter, same pattern as vim-automations-website's
// app/api/contact/route.ts — a deterrent proportionate to a low-traffic
// demo site, not a distributed guarantee. Resets on cold start; that's
// fine here.
const buckets = new Map<string, number[]>();

export function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  const limited = recent.length >= max;
  recent.push(now);
  buckets.set(key, recent);
  return limited;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}
