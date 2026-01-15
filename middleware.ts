import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  console.log("MIDDLEWARE HIT:", request.nextUrl.pathname);
  const sessionCookie = request.cookies.get("SESSION");

  const protectedPaths = ["/dashboard", "/marketplace", "/payments"];

  const isProtectedRoute = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/marketplace/:path*", "/payments/:path*"],
};
