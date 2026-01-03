import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username?: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // потрібно дочекатися cookies()
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivateRoute =
    pathname.startsWith("/notes") || pathname.startsWith("/profile");

  // Якщо немає accessToken, але є refreshToken — оновлюємо токени
  if (!accessToken && refreshToken) {
    try {
      const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) throw new Error("Refresh failed");

      const data = (await res.json()) as AuthResponse;
      const { accessToken: newAccess, refreshToken: newRefresh } = data;

      accessToken = newAccess;

      const response = isAuthRoute
        ? NextResponse.redirect(new URL("/", request.url))
        : NextResponse.next();

      response.cookies.set("accessToken", newAccess, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });

      response.cookies.set("refreshToken", newRefresh, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });

      return response;
    } catch {
      const response = isPrivateRoute
        ? NextResponse.redirect(new URL("/sign-in", request.url))
        : NextResponse.next();

      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");

      return response;
    }
  }

  // Якщо користувач авторизований, але намагається зайти на сторінку авторизації
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Якщо користувач не авторизований, але намагається зайти на приватну сторінку
  if (isPrivateRoute && !accessToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export default proxy;
