import { NextResponse } from "next/server";

// Simple in-memory, fixed-window rate limiter keyed by client IP. Protects the
// shared Groq quota so one visitor can't exhaust it for everyone.
//
// NOTE: state lives in the function instance's memory. On a single long-lived
// server (or `next start`) this is effective. On multi-instance serverless
// (e.g. Netlify/Vercel at scale) each instance keeps its own counter, so the
// effective limit is per-instance — good enough as a fair-use guard, but for
// hard global limits back this with a shared store (e.g. Upstash Redis).

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

// Opportunistic cleanup so the map can't grow unbounded.
function sweep(now: number) {
  if (store.size < 5000) return;
  for (const [k, b] of store) {
    if (b.resetAt <= now) store.delete(k);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  sweep(now);
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, limit, remaining: limit - 1, resetAt };
  }

  existing.count += 1;
  return {
    allowed: existing.count <= limit,
    limit,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  };
}

/** Best-effort client IP from the usual proxy headers. */
export function getClientIp(request: Request): string {
  const h = (name: string) => request.headers.get(name)?.trim() || "";
  const forwarded = h("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return (
    h("x-nf-client-connection-ip") || // Netlify
    h("x-real-ip") ||
    h("cf-connecting-ip") || // Cloudflare
    "unknown"
  );
}

type LimitKind = "heavy" | "light";

function limitsFor(kind: LimitKind): { limit: number; windowMs: number } {
  if (kind === "light") {
    return {
      limit: Number(process.env.AI_RATE_LIMIT_LIGHT) || 60,
      windowMs: Number(process.env.AI_RATE_WINDOW_LIGHT_MS) || 5 * 60_000,
    };
  }
  return {
    limit: Number(process.env.AI_RATE_LIMIT) || 15,
    windowMs: Number(process.env.AI_RATE_WINDOW_MS) || 10 * 60_000,
  };
}

/**
 * Enforce a per-IP limit for an AI route. Returns a 429 NextResponse when the
 * caller is over the limit, otherwise null (proceed). Pass a bilingual message
 * so the UI can surface it.
 */
export function enforceAiRateLimit(
  request: Request,
  kind: LimitKind = "heavy",
  language: "en" | "ar" = "en"
): NextResponse | null {
  const ip = getClientIp(request);
  const { limit, windowMs } = limitsFor(kind);
  const result = rateLimit(`ai:${kind}:${ip}`, limit, windowMs);

  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };

  if (result.allowed) return null;

  const retryAfter = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
  headers["Retry-After"] = String(retryAfter);

  const minutes = Math.ceil(retryAfter / 60);
  const message =
    language === "ar"
      ? `لقد وصلت إلى حد استخدام الذكاء الاصطناعي. يرجى المحاولة بعد ${minutes} دقيقة تقريبًا.`
      : `You've reached the AI usage limit. Please try again in about ${minutes} minute${
          minutes === 1 ? "" : "s"
        }.`;

  return NextResponse.json(
    { error: message, rateLimited: true, retryAfter },
    { status: 429, headers }
  );
}
