import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Centralized Protected Route Configuration
 * Any user-facing path starting with these prefixes requires authentication.
 */
const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/profile",
  "/learn",
  "/playground",
  "/roadmap",
  "/games",
  "/courses",
  "/challenges",
  "/coding-lab",
];

/**
 * Validates JWT token structure and expiration (Edge-compatible base64url payload parsing).
 */
function isTokenValid(token: string | undefined): boolean {
  if (!token || typeof token !== "string" || !token.trim()) return false;
  const parts = token.trim().split(".");
  if (parts.length !== 3) return false;

  try {
    const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padLength = (4 - (payloadBase64.length % 4)) % 4;
    const paddedBase64 = payloadBase64 + "=".repeat(padLength);
    const jsonPayload = atob(paddedBase64);
    const payload = JSON.parse(jsonPayload);

    if (payload.exp && typeof payload.exp === "number") {
      if (Date.now() >= payload.exp * 1000) {
        return false; // Expired token
      }
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Next.js 16 Proxy for Centralized Application Route Protection
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const hasValidToken = isTokenValid(token);
  const { pathname, search } = request.nextUrl;

  console.log(`[PROXY INTERCEPT] Path: ${pathname} | Token Present: ${!!token} | Valid: ${hasValidToken}`);

  // Check if current path matches any protected route prefix
  const isProtectedRoute = PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  // 1. Redirect unauthenticated users accessing protected routes or root (/) to /login
  if (!hasValidToken) {
    if (pathname === "/" || isProtectedRoute) {
      console.log(`[PROXY REDIRECT] Intercepted unauthenticated access to ${pathname} -> Redirecting to /login`);
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      if (pathname !== "/") {
        loginUrl.search = `?redirect=${encodeURIComponent(pathname + search)}`;
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Redirect authenticated users away from /login or / to /dashboard (or return URL)
  if (hasValidToken && (pathname === "/login" || pathname === "/")) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    const isSafeInternalUrl =
      redirectParam &&
      redirectParam.startsWith("/") &&
      !redirectParam.startsWith("//") &&
      !redirectParam.includes(":\\") &&
      !redirectParam.includes("://");

    const destination = isSafeInternalUrl ? redirectParam : "/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/profile/:path*",
    "/learn/:path*",
    "/playground/:path*",
    "/roadmap/:path*",
    "/games/:path*",
    "/courses",
    "/courses/:path*",
    "/challenges",
    "/challenges/:path*",
    "/coding-lab",
    "/coding-lab/:path*",
    "/login",
  ],
};
