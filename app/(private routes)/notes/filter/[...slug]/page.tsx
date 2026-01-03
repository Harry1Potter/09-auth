import { fetchNotes, getQueryClient } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";
import type { NoteTag } from "@/types/note";

interface Params {
  slug: string[];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const tag = params.slug?.[0] || "all";
  const filterName = tag === "all" ? "Усі нотатки" : `Фільтр: ${tag}`;

  return {
    title: `NoteHub — ${filterName}`,
    description: `Сторінка з нотатками за фільтром "${tag}".`,
    openGraph: {
      title: `NoteHub — ${filterName}`,
      description: `Сторінка з нотатками за фільтром "${tag}".`,
      url: `/notes/filter/${tag}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function FilteredNotesPage({ params }: { params: Params }) {
  const tag = params.slug?.[0] || "all";

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag, "", 1],
    queryFn: () =>
      fetchNotes({
        search: tag === "all" ? "" : tag,
        tag: tag === "all" ? undefined : (tag as NoteTag),
        page: 1,
        perPage: 10,
      }),
  });

  return <NotesClient tag={tag} />;
}