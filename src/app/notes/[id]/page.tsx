import type { Metadata } from "next";
import { getAllNotes, getNoteById } from "@/lib/notes";
import { notFound } from "next/navigation";
import NoteDetailClient from "./NoteDetailClient";
import { SITE_URL } from "@/lib/site";

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
      title: "文章不存在 | Kasumi 的数字小屋",
    };
  }

  return {
    title: note.title,
    description: note.summary,
    alternates: {
      canonical: `/notes/${note.id}`,
    },
    openGraph: {
      type: "article",
      title: `${note.title} | Kasumi 的数字小屋`,
      description: note.summary,
      url: `/notes/${note.id}`,
      publishedTime: note.date,
      authors: ["Kasumi"],
      tags: note.tags,
      images: [
        {
          url: note.coverImage || "/og-cover.jpg",
          alt: note.coverAlt || note.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description: note.summary,
      images: [note.coverImage || "/og-cover.jpg"],
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
  const adjacentIds = new Set([prevNote?.id, nextNote?.id].filter(Boolean));
  const relatedNotes = allNotes
    .filter((candidate) => candidate.id !== note.id && !adjacentIds.has(candidate.id))
    .map((candidate) => ({
      note: candidate,
      score:
        candidate.tags.filter((tag) => note.tags.includes(tag)).length * 2
        + Number(candidate.category === note.category),
    }))
    .sort((left, right) => right.score - left.score || right.note.date.localeCompare(left.note.date))
    .slice(0, 2)
    .map(({ note: candidate }) => ({
      id: candidate.id,
      title: candidate.title,
      summary: candidate.summary,
      category: candidate.category,
    }));
  const articleUrl = new URL(`/notes/${note.id}`, SITE_URL).toString();
  const articleImage = new URL(note.coverImage || "/og-cover.jpg", SITE_URL).toString();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: note.title,
    description: note.summary,
    image: articleImage,
    datePublished: note.date,
    dateModified: note.date,
    mainEntityOfPage: articleUrl,
    author: {
      "@type": "Person",
      name: "云归何处",
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Person",
      name: "云归何处",
    },
    keywords: note.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <NoteDetailClient
        note={note}
        prevNote={prevNote}
        nextNote={nextNote}
        relatedNotes={relatedNotes}
      />
    </>
  );
}
