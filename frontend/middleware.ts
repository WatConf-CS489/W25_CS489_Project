import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.has("session") || request.cookies.has("remember_token");
  if (pathname.startsWith("/user/") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (pathname === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL("/user/profile", request.url));
  }
}
