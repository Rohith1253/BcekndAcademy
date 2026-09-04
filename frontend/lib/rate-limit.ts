import { NextRequest, NextResponse } from "next/server";

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (sliding window per IP + endpoint key)
const rateLimitMap = new Map<string, RateLimitStore>();

// Cleanup expired entries periodically every 5 minutes
if (typeof window === "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export function getClientIp(request: NextRequest): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const ips = xForwardedFor.split(",").map((ip) => ip.trim());
    if (ips[0]) return ips[0];
  }
  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();
  return "127.0.0.1";
}

export function checkRateLimit(
  request: NextRequest,
  routeKey: string,
  maxRequests: number = 10,
  windowMs: number = 60 * 1000
): { allowed: boolean; success: boolean; limit: number; remaining: number; resetMs: number } {
  const ip = getClientIp(request);
  const key = `${ip}:${routeKey}`;
  const now = Date.now();

  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    // Start new window
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetMs: windowMs,
    };
  }

  if (record.count >= maxRequests) {
    // Limit exceeded
    return {
      allowed: false,
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetMs: Math.max(0, record.resetTime - now),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    success: true,
    limit: maxRequests,
    remaining: maxRequests - record.count,
    resetMs: Math.max(0, record.resetTime - now),
  };
}

export function applyRateLimit(
  request: NextRequest,
  routeKey: string,
  maxRequests: number = 10,
  windowMs: number = 60 * 1000
): NextResponse | null {
  const result = checkRateLimit(request, routeKey, maxRequests, windowMs);

  if (!result.allowed) {
    const retryAfterSeconds = Math.ceil(result.resetMs / 1000);
    const response = NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
    response.headers.set("Retry-After", String(retryAfterSeconds));
    response.headers.set("X-RateLimit-Limit", String(result.limit));
    response.headers.set("X-RateLimit-Remaining", "0");
    response.headers.set("X-RateLimit-Reset", String(Math.ceil(Date.now() / 1000) + retryAfterSeconds));
    return response;
  }

  return null;
}
