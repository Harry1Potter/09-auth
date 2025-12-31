import { proxy } from "./proxy";
import type { Note, NoteTag, NewNoteData } from "@/types/note";
import type { User } from "@/types/user";
import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

/* ---------- QUERY CLIENT ---------- */

const getQueryClient = cache((): QueryClient => new QueryClient());
export default getQueryClient;

/* ---------- NOTES ---------- */

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
  totalItems?: number;
  page?: number;
  perPage?: number;
}

export interface FetchNotesParams {
  search?: string;
  tag?: NoteTag | "all";
  page?: number;
  perPage?: number;
}

export async function fetchNotes({
  search = "",
  tag = "all",
  page = 1,
  perPage = 10,
}: FetchNotesParams): Promise<NotesResponse> {
  const q = search.trim();
  const params: Record<string, string | number> = { page, perPage };

  if (q.length >= 2) params.search = q;
  if (tag !== "all") params.tag = tag;

  const response = await proxy<NotesResponse>({
    method: "GET",
    url: "/notes",
    params,
  });

  return {
    notes: response.data.notes ?? [],
    totalPages: response.data.totalPages ?? 1,
    totalItems: response.data.totalItems,
    page: response.data.page ?? page,
    perPage: response.data.perPage ?? perPage,
  };
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await proxy<Note>({
    method: "GET",
    url: `/notes/${id}`,
  });

  return response.data;
}

export async function createNote(note: NewNoteData): Promise<Note> {
  const response = await proxy<Note>({
    method: "POST",
    url: "/notes",
    data: note,
  });

  return response.data;
}

export async function deleteNote(id: string): Promise<void> {
  await proxy<void>({
    method: "DELETE",
    url: `/notes/${id}`,
  });
}

/* ---------- AUTH ---------- */

export interface RegisterPayload {
  email: string;
  password: string;
}

export async function register(payload: RegisterPayload): Promise<User> {
  const response = await proxy<User>({
    method: "POST",
    url: "/auth/register",
    data: payload,
  });

  return response.data;
}

export async function login(payload: RegisterPayload): Promise<User> {
  const response = await proxy<User>({
    method: "POST",
    url: "/auth/login",
    data: payload,
  });

  return response.data;
}

export async function logout(): Promise<void> {
  await proxy<void>({
    method: "POST",
    url: "/auth/logout",
  });
}

export async function checkSession(): Promise<User> {
  const response = await proxy<User>({
    method: "GET",
    url: "/auth/session",
  });

  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await proxy<User>({
    method: "GET",
    url: "/users/me",
  });

  return response.data;
}

export async function updateMe(payload: {
  username: string;
}): Promise<User> {
  const response = await proxy<User>({
    method: "PATCH",
    url: "/users/me",
    data: payload,
  });

  return response.data;
}