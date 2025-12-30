import { api } from "./api";
import type { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type { NoteTag } from "@/lib/store/noteStore";

async function getCookieHeader(): Promise<{ Cookie: string }> {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return {
    Cookie: cookieHeader,
  };
}


/* ---------- NOTES ---------- */

export async function fetchNotes(params?: {
  search?: string;
  tag?: NoteTag;
  page?: number;
  perPage?: number;
}): Promise<Note[]> {
  const response: AxiosResponse<Note[]> = await api.get("/notes", {
    params,
    headers: await getCookieHeader(),
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response: AxiosResponse<Note> = await api.get(`/notes/${id}`, {
    headers: await getCookieHeader(),
  });

  return response.data;
}

/* ---------- AUTH ---------- */

export async function checkSession(): Promise<AxiosResponse<User> | null> {
  try {
    const response: AxiosResponse<User> = await api.get("/auth/session", {
      headers: await getCookieHeader(),
    });

    return response;
  } catch {
    return null;
  }
}

export async function getMe(): Promise<User | null> {
  try {
    const response: AxiosResponse<User> = await api.get("/users/me", {
      headers: await getCookieHeader(),
    });

    return response.data;
  } catch {
    return null;
  }
}

/* ---------- QUERY CLIENT ---------- */

export const getQueryClient = cache((): QueryClient => new QueryClient());
