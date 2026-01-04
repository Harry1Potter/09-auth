import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { refreshSession } from "@/lib/api/serverApi";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();

  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  const isPrivateRoute =
    pathname.startsWith("/notes") || pathname.startsWith("/profile");

  if (!accessToken && refreshToken) {
    try {
      const response = await refreshSession(refreshToken);

      const { accessToken: newAccess, refreshToken: newRefresh } =
        response.data;

      const nextResponse = NextResponse.next();

      const COOKIE_DOMAIN =
        process.env.NODE_ENV === "production" ? ".vercel.app" : undefined;

      nextResponse.cookies.set("accessToken", newAccess, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: COOKIE_DOMAIN,
      });

      nextResponse.cookies.set("refreshToken", newRefresh, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: COOKIE_DOMAIN,
      });

      nextResponse.cookies.set("accessToken", newAccess, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      nextResponse.cookies.set("refreshToken", newRefresh, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      accessToken = newAccess;

      return nextResponse;
    } catch {
      const redirectResponse = isPrivateRoute
        ? NextResponse.redirect(new URL("/sign-in", request.url))
        : NextResponse.next();

      redirectResponse.cookies.delete("accessToken");
      redirectResponse.cookies.delete("refreshToken");

      return redirectResponse;
    }
  }

  if (isPrivateRoute && !accessToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};

export default proxy;
