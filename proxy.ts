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

      const { accessToken: newAccess, refreshToken: newRefresh } = response.data;

      const nextResponse = NextResponse.next();

      nextResponse.cookies.set("accessToken", newAccess, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
      });

      nextResponse.cookies.set("refreshToken", newRefresh, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
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
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

export default proxy;