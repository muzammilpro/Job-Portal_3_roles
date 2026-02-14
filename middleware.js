import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.clone();

  if (!token) {
    if (url.pathname.startsWith("/login") || url.pathname.startsWith("/signup")) return;
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const role = token.role;

  if (url.pathname.startsWith("/admin") && role !== "admin") {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }
  if (url.pathname.startsWith("/company") && role !== "company") {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }
  if (url.pathname.startsWith("/user") && role !== "applicant") {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/company/:path*", "/user/:path*"],
};
