import { NextRequest, NextResponse } from "next/server";
import type { CustomMiddleware } from "./chain";
import { jwtVerify } from "jose";
import { JWTExpired, JWTInvalid } from "jose/errors";

export default function withAuth(proxy: CustomMiddleware): CustomMiddleware {
  return async (request: NextRequest, response: NextResponse) => {
    const { pathname } = request.nextUrl;

    // Public pages
    if (
      ["/login", "/register", "/forgot-password"].includes(pathname) ||
      /\/forgot-password\/(.+?)/gi.test(pathname) ||
      pathname.startsWith("/images")
    ) {
      return proxy(request, response);
    }

    const outSiteJWT = request.cookies.get("OutSiteJWT");

    if (!outSiteJWT) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await jwtVerify(
        outSiteJWT.value,
        new TextEncoder().encode(process.env.JWT_PRIVATE),
      );
    } catch (err) {
      if (err instanceof JWTExpired) {
        return NextResponse.redirect(new URL("/?error=expired", request.url));
      }

      if (err instanceof JWTInvalid) {
        return NextResponse.redirect(new URL("/?error=invalid", request.url));
      }

      console.error(err);

      return NextResponse.redirect(new URL("/", request.url));
    }

    return proxy(request, response);
  };
}
