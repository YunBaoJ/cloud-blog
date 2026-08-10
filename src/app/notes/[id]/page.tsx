import type { Metadata } from "next";
import { getAllNotes, getNoteById } from "@/lib/notes";
import { notFound } from "next/navigation";
import NoteDetailClient from "./NoteDetailClient";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const notes = getAllNotes();
  return notes.map((note) => ({
    id: note.id,
  }));
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { id } = await params;
  const note = getNoteById(id);

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
  const allNotes = getAllNotes();
  const noteIndex = allNotes.findIndex((n) => n.id === id);

  if (noteIndex === -1) {
    notFound();
  }

  const note = allNotes[noteIndex];
  const prevNote = noteIndex > 0 ? allNotes[noteIndex - 1] : null;
  const nextNote = noteIndex < allNotes.length - 1 ? allNotes[noteIndex + 1] : null;

  return <NoteDetailClient note={note} prevNote={prevNote} nextNote={nextNote} />;
}
