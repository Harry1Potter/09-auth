import { api } from "./api";
import type { Note, NoteTag, NewNoteData } from "@/types/note";
import type { User } from "@/types/user";
import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

/* ---------- NOTES ---------- */

const getQueryClient = cache(() => new QueryClient());

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

  const { data } = await api.get("/notes", { params });

  return {
    notes: data.notes ?? [],
    totalPages: data.totalPages ?? 1,
    totalItems: data.totalItems,
    page: data.page ?? page,
    perPage: data.perPage ?? perPage,
  };
}

export async function fetchNoteById(id: string) {
  const { data } = await api.get(`/notes/${id}`);
  return data;
}

export async function createNote(note: NewNoteData) {
  const { data } = await api.post("/notes", note);
  return data;
}

export async function deleteNote(id: string) {
  const { data } = await api.delete(`/notes/${id}`);
  return data;
}

/* ---------- AUTH ---------- */

export interface RegisterPayload {
  email: string;
  password: string;
}

export async function register(payload: {
  email: string;
  password: string;
}): Promise<User> {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<User> {
  const { data } = await api.post("/auth/login", payload);
  return data;
}

export async function logout() {
  const { data } = await api.post("/auth/logout");
  return data;
}

export async function checkSession() {
  const { data } = await api.get("/auth/session");
  return data;
}

export async function getMe() {
  const { data } = await api.get("/users/me");
  return data;
}

export async function updateMe(payload: {
  username?: string;
  email?: string;
}) {
  const { data } = await api.patch("/users/me", payload);
  return data;
}