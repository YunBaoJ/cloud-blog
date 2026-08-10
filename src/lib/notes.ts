import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { FEATURED_NOTES, NoteItem } from "@/data/mockData";

const notesDirectory = path.join(process.cwd(), "content/notes");

export interface ExtendedNoteItem extends NoteItem {
  featured?: boolean;
}

export function getAllNotes(): ExtendedNoteItem[] {
  try {
    if (!fs.existsSync(notesDirectory)) {
      return FEATURED_NOTES;
    }

    const fileNames = fs.readdirSync(notesDirectory);
    const allNotesData = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const id = fileName.replace(/\.md$/, "");
        const fullPath = path.join(notesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");

        const { data, content } = matter(fileContents);

        return {
          id: data.id || id,
          title: data.title || "无标题随笔",
          summary: data.summary || "",
          category: data.category || "随笔",
          date: data.date || "2026-08-01",
          readTime: data.readTime || "5 min read",
          iconName: data.iconName || "Code2",
          tags: data.tags || [],
          content: content || "",
          views: data.views || Math.floor(Math.random() * 800 + 200),
          likes: data.likes || Math.floor(Math.random() * 80 + 10),
          featured: Boolean(data.featured),
        } as ExtendedNoteItem;
      });

    if (allNotesData.length === 0) {
      return FEATURED_NOTES;
    }

    return allNotesData.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error("Error reading markdown files from content/notes:", error);
    return FEATURED_NOTES;
  }
}

export function getNoteById(id: string): ExtendedNoteItem | undefined {
  const notes = getAllNotes();
  return notes.find((note) => note.id === id);
}

export function getFeaturedNotes(): ExtendedNoteItem[] {
  const notes = getAllNotes();
  const featured = notes.filter((n) => n.featured);
  return featured.length > 0 ? featured : notes.slice(0, 3);
}
