import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "abcd_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const session = req.cookies.get(SESSION_COOKIE)?.value;
    if (!session) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Validate base64 JSON structure minimally
    try {
      const decoded = Buffer.from(session, "base64").toString("utf-8");
      const parsed = JSON.parse(decoded);
      if (!parsed?.id || !parsed?.email) {
        throw new Error("invalid");
      }
    } catch {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete(SESSION_COOKIE);
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"],
};
