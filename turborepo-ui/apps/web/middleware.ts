import { NextRequest, NextResponse } from "next/server";
import { authClient } from "./lib/auth-client";
import { getCookieCache } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/dashboard"];

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const sessionCookie = await getCookieCache(request);
    console.log(sessionCookie);

    if (!sessionCookie) {
      authClient.signIn.social({
        provider: "",
      });
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }
}
