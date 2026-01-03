import { api } from "./api";
import type { Note, NoteTag, NewNoteData } from "@/types/note";
import type { User } from "@/types/user";
import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

const getQueryClient = cache((): QueryClient => new QueryClient());
export default getQueryClient;

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

  const { data } = await api.get<NotesResponse>("/notes", { params });

  return {
    notes: data.notes ?? [],
    totalPages: data.totalPages ?? 1,
    totalItems: data.totalItems,
    page: data.page ?? page,
    perPage: data.perPage ?? perPage,
  };
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(note: NewNoteData): Promise<Note> {
  const { data } = await api.post<Note>("/notes", note);
  return data;
}

export async function deleteNote(id: string): Promise<void> {
  await api.delete(`/notes/${id}`);
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export async function register(payload: RegisterPayload): Promise<User> {
  const { data } = await api.post<User>("/auth/register", payload);
  return data;
}

export async function login(payload: RegisterPayload): Promise<User> {
  const { data } = await api.post<User>("/auth/login", payload);
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<User> {
  const { data } = await api.get<User>("/auth/session");
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateMe(payload: {
  username: string;
}): Promise<User> {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
}
