import { cookies } from "next/headers";
import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

import { proxy } from "./proxy";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type { NoteTag } from "@/lib/store/noteStore";

/* ---------- COOKIES ---------- */

async function getCookieHeader(): Promise<{ Cookie: string }> {
  const cookieStore = await cookies();

  return {
    Cookie: cookieStore.toString(),
  };
}

/* ---------- NOTES ---------- */

export async function fetchNotes(params?: {
  search?: string;
  tag?: NoteTag;
  page?: number;
  perPage?: number;
}): Promise<Note[]> {
  const response = await proxy<Note[]>({
    method: "GET",
    url: "/notes",
    params,
    headers: await getCookieHeader(),
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await proxy<Note>({
    method: "GET",
    url: `/notes/${id}`,
    headers: await getCookieHeader(),
  });

  return response.data;
}

/* ---------- AUTH ---------- */

export async function checkSession(): Promise<User | null> {
  try {
    const response = await proxy<User>({
      method: "GET",
      url: "/auth/session",
      headers: await getCookieHeader(),
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function getMe(): Promise<User | null> {
  try {
    const response = await proxy<User>({
      method: "GET",
      url: "/users/me",
      headers: await getCookieHeader(),
    });

    return response.data;
  } catch {
    return null;
  }
}

/* ---------- QUERY CLIENT ---------- */

export const getQueryClient = cache((): QueryClient => new QueryClient());
