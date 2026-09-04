import { cache } from "../../lib/cache";
import { checkRateLimit, applyRateLimit } from "../../lib/rate-limit";
import { fetchWithTimeout } from "../../lib/http";
import { NextRequest } from "next/server";

export async function runUtilsUnitTests(assert: (cond: boolean, msg: string) => void) {
  console.log("\n--- Executing Unit Tests: Utilities (Cache, Rate Limit, HTTP Timeout) ---");

  // 1. TTLCache Read / Write / Expiry
  cache.clear();
  cache.set("unit:test:key", { val: 42 }, 1000);
  const cacheHit = cache.get<{ val: number }>("unit:test:key");
  assert(cacheHit !== null && cacheHit.val === 42, "TTLCache returns stored value on cache hit");

  cache.delete("unit:test:key");
  assert(cache.get("unit:test:key") === null, "TTLCache deletes specified key cleanly");

  // 2. Rate Limiting Sliding Window Math
  const dummyReq = new NextRequest("http://localhost:3000/api/auth/login", {
    headers: { "x-forwarded-for": "198.51.100.44" },
  });

  const testRouteKey = `unit-rate-test-${Date.now()}`;
  const r1 = checkRateLimit(dummyReq, testRouteKey, 2, 60000);
  const r2 = checkRateLimit(dummyReq, testRouteKey, 2, 60000);
  const r3 = checkRateLimit(dummyReq, testRouteKey, 2, 60000);

  assert(r1.allowed === true && r1.remaining === 1, "Rate limiter permits 1st request under max count");
  assert(r2.allowed === true && r2.remaining === 0, "Rate limiter permits 2nd request reaching max limit");
  assert(r3.allowed === false && r3.remaining === 0, "Rate limiter BLOCKS 3rd request exceeding max limit");

  const blockResponse = applyRateLimit(dummyReq, testRouteKey, 2, 60000);
  assert(
    blockResponse !== null && blockResponse.status === 429,
    "applyRateLimit outputs HTTP 429 response when request limit is exceeded"
  );

  // 3. fetchWithTimeout Definition
  assert(typeof fetchWithTimeout === "function", "fetchWithTimeout helper is defined");
}
