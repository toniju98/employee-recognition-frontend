import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// TODO: check if middleware checks already the routes

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = ["/", "/api/auth", "/login"];

  // Admin-only paths
  const adminPaths = ["/admin", "/admin/recognition-types", "/admin/rewards", "/admin/points", "/admin/analytics"];

  // Allow public paths
  if (publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.next();
  }

  // Check for Bearer token
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // For admin routes, check the token claims
  if (adminPaths.some((p) => path.startsWith(p))) {
    try {
      const token = authHeader.split(' ')[1];
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      const roles = tokenData.realm_access?.roles || [];
      if (!roles.includes("admin")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Don't run middleware on API routes
export const config = {
  matcher: '/((?!api/|_next/|favicon.ico).*)',
};
