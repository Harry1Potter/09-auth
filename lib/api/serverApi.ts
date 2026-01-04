import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type { NoteTag } from "@/lib/store/noteStore";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

async function serverRequest<ResponseData>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<ResponseData>> {
  const cookieStore: ReadonlyRequestCookies = await cookies();
  const allCookies = cookieStore.getAll();

  const headers: Record<string, string> = {
    ...(config.headers as Record<string, string>),
  };

  if (allCookies.length > 0) {
    headers.Cookie = allCookies
      .map(
        (cookie: { name: string; value: string }) =>
          `${cookie.name}=${encodeURIComponent(cookie.value)}`
      )
      .join("; ");
  }

  return api.request<ResponseData>({
    ...config,
    headers,
  });
}

export async function fetchNotes(params?: {
  search?: string;
  tag?: NoteTag;
  page?: number;
  perPage?: number;
}): Promise<AxiosResponse<Note[]>> {
  return serverRequest<Note[]>({
    method: "GET",
    url: "/notes",
    params,
  });
}

export async function fetchNoteById(
  id: string
): Promise<AxiosResponse<Note>> {
  return serverRequest<Note>({
    method: "GET",
    url: `/notes/${id}`,
  });
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export async function refreshSession(
  refreshToken: string
): Promise<AxiosResponse<RefreshResponse>> {
  return serverRequest<RefreshResponse>({
    method: "POST",
    url: "/auth/refresh",
    data: { refreshToken },
  });
}

export async function checkSession() {
  const cookieStore = await cookies();
  const res = await api.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
}

export const getQueryClient = cache(
  (): QueryClient => new QueryClient()
);

export async function getMe(): Promise<User | null> {
  try {
    const response = await serverRequest<User>({
      method: "GET",
      url: "/users/me",
    });

    return response.data;
  } catch (err) {
    console.error("Failed to fetch user:", err);
    return null;
  }
}