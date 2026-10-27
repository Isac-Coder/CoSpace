import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;

  // 1. Define public paths that don't require authentication
  const isPublicPath = 
    pathname === "/" || 
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/auth") || 
    pathname.startsWith("/spaces") || 
    pathname.startsWith("/api/auth");

  // 2. Define admin paths
  const isAdminPath = pathname.startsWith("/admin");
  // 3. Define private paths (user dashboard, etc)
  const isPrivatePath = pathname.startsWith("/dashboard") || pathname.startsWith("/my-reservations");

  // If it's a public path, let it pass
  if (isPublicPath) {
    return NextResponse.next();
  }

  // For private and admin paths, we need a valid token
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const decoded = verifyAccessToken(accessToken) as any;

  if (!decoded) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin protection: if it's an admin path but user is not ADMIN
  if (isAdminPath && decoded.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
