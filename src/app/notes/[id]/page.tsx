import type { Metadata } from "next";
import { FEATURED_NOTES } from "@/data/mockData";
import { notFound } from "next/navigation";
import NoteDetailClient from "./NoteDetailClient";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { id } = await params;
  const note = FEATURED_NOTES.find((n) => n.id === id);

  if (!note) {
    return {
      title: "文章不存在 | Cloud 的数字小屋",
    };
  }

  return {
    title: note.title,
    description: note.summary,
    openGraph: {
      title: `${note.title} | Cloud 的数字小屋`,
      description: note.summary,
    },
  };
}

export default async function NoteDetailPage({ params }: NotePageProps) {
  const { id } = await params;
  const noteIndex = FEATURED_NOTES.findIndex((n) => n.id === id);

  if (noteIndex === -1) {
    notFound();
  }

  const note = FEATURED_NOTES[noteIndex];
  const prevNote = noteIndex > 0 ? FEATURED_NOTES[noteIndex - 1] : null;
  const nextNote = noteIndex < FEATURED_NOTES.length - 1 ? FEATURED_NOTES[noteIndex + 1] : null;

  return <NoteDetailClient note={note} prevNote={prevNote} nextNote={nextNote} />;
}
