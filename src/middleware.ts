import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const decoded = accessToken ? (verifyAccessToken(accessToken) as any) : null;

  // 1. Define path groups
  const isAuthPath = pathname === "/login" || pathname === "/register";
  const isAdminPath = pathname.startsWith("/admin");
  const isPublicPath =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/spaces") ||
    pathname.startsWith("/api/auth");

  // 2. Logic if user IS logged in
  if (decoded) {
    // Redirect logged in user away from auth pages
    if (isAuthPath) {
      return NextResponse.redirect(
        new URL(decoded.role === "ADMIN" ? "/admin" : "/dashboard", request.url)
      );
    }
    // Protect admin paths
    if (isAdminPath && decoded.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 3. Logic if user is NOT logged in
  if (isPublicPath || isAuthPath) {
    return NextResponse.next();
  }

  // 4. Redirect not logged in user to login
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
