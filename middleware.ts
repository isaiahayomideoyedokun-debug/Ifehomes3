import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const role = token?.role;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && !token?.isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (path.startsWith("/dashboard")) {
      if (role !== "AGENT") return NextResponse.redirect(new URL("/", req.url));
    }

    if (path.startsWith("/listings/new")) {
      if (role !== "AGENT") return NextResponse.redirect(new URL("/", req.url));
      if (token?.agentPaymentStatus !== "paid") {
        return NextResponse.redirect(new URL("/dashboard/billing", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/listings/new", "/profile", "/admin/:path*"],
};
