import { NextRequest, NextResponse } from "next/server";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPrivateRoute && !accessToken) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const response = await fetch(
      `${request.nextUrl.origin}/api/auth/session`,
      {
        headers: {
          Cookie: request.headers.get("cookie") ?? "",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const res = NextResponse.next();

    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      res.headers.append("Set-Cookie", setCookie);
    }

    return res;
  }

  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
  ],
};