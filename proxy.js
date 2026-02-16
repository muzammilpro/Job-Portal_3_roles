// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";

// export async function proxy(req) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   const url = req.nextUrl.clone();

//   if (!token) {
//     if (url.pathname.startsWith("/login") || url.pathname.startsWith("/signup")) return;
//     url.pathname = "/login";
//     return NextResponse.redirect(url);
//   }

//   const role = token.role;

//   if (url.pathname.startsWith("/admin") && role !== "admin") {
//     url.pathname = "/unauthorized";
//     return NextResponse.redirect(url);
//   }
//   if (url.pathname.startsWith("/company") && role !== "company") {
//     url.pathname = "/unauthorized";
//     return NextResponse.redirect(url);
//   }
//   if (url.pathname.startsWith("/user") && role !== "applicant") {
//     url.pathname = "/unauthorized";
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*", "/company/:path*", "/user/:path*"],
// };


// proxy.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function proxy(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const url = req.nextUrl.clone();
    
    console.log("Proxy - Path:", url.pathname);
    console.log("Proxy - Token exists:", !!token);

    // Allow access to login and signup pages without token
    if (url.pathname.startsWith("/login") || url.pathname.startsWith("/signup")) {
      console.log("Allowing access to login/signup page");
      return NextResponse.next();
    }

    // Redirect to login if no token
    if (!token) {
      console.log("No token found, redirecting to login");
      url.pathname = "/login";
      // Preserve the original destination to redirect back after login
      url.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    const role = token.role;
    console.log("User role:", role);

    // Role-based access control
    if (url.pathname.startsWith("/admin") && role !== "admin") {
      console.log("Non-admin trying to access admin page, redirecting to unauthorized");
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
    
    if (url.pathname.startsWith("/company") && role !== "company") {
      console.log("Non-company trying to access company page, redirecting to unauthorized");
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
    
    if (url.pathname.startsWith("/user") && role !== "applicant") {
      console.log("Non-applicant trying to access user page, redirecting to unauthorized");
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    // Allow access to all other routes
    console.log("Access granted to:", url.pathname);
    return NextResponse.next();
    
  } catch (error) {
    console.error("Proxy middleware error:", error);
    // In case of error, redirect to login for safety
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/company/:path*", "/user/:path*"],
};