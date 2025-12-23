import { cookies } from "next/headers";
import { NoteTag } from "@/lib/store/noteStore";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : "http://localhost:3000/api";

function getCookieHeader() {
  return {
    Cookie: cookies().toString(),
  };
}

export async function fetchNotes(params?: {
  search?: string;
  tag?: NoteTag;
  page?: number;
  perPage?: number;
}) {
  const searchParams = params
  ? new URLSearchParams(
      Object.entries(params).reduce((acc, [k, v]) => {
        if (v !== undefined) acc[k] = String(v);
        return acc;
      }, {} as Record<string, string>)
    ).toString()
  : "";

  const res = await fetch(`${baseURL}/notes?${searchParams}`, {
    headers: getCookieHeader(),
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}

export async function fetchNoteById(id: string) {
  const res = await fetch(`${baseURL}/notes/${id}`, {
    headers: {
      Cookie: cookies().toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch note");
  }

  return res.json();
}

export async function checkSession() {
  const cookieStore = cookies();

  const res = await fetch(`${baseURL}/auth/session`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export async function getMe() {
  const res = await fetch(`${baseURL}/users/me`, {
    headers: getCookieHeader(),
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}
