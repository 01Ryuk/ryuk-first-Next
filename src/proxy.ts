import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // grab the session token from cookies
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  // protected routes — only logged in users can access these
  const protectedRoutes = [
    "/dashboard",
    "/post/create",
    "/post",
  ];

  // auth routes — logged in users shouldn't access these
  const authRoutes = ["/auth/login", "/auth/signup", "/auth/forgot-password", "/auth/reset-password"];

  const isProtectedRoute =
    protectedRoutes.some((route) => pathname.startsWith(route)) ||
    /^\/post\/[^/]+\/edit/.test(pathname);
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // if trying to access a protected route without a session, redirect to login
  if (isProtectedRoute && !sessionToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // if trying to access login/signup while already logged in, redirect to dashboard
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // match all routes except static files, images, and api routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
