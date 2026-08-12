import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const notesDirectory = path.join(process.cwd(), "content/notes");

export interface NoteItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  readTime: string;
  iconName: string;
  tags: string[];
  content: string;
  views: number;
  likes: number;
  featured?: boolean;
}

function deterministicMetric(id: string, minimum: number, range: number) {
  const seed = [...id].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return minimum + seed % range;
}

export function getAllNotes(): NoteItem[] {
  if (!fs.existsSync(notesDirectory)) {
    throw new Error(`文章目录不存在：${notesDirectory}`);
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
        views: data.views ?? deterministicMetric(id, 200, 800),
        likes: data.likes ?? deterministicMetric(id, 10, 80),
        featured: Boolean(data.featured),
      } satisfies NoteItem;
    });

  return allNotesData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getNoteById(id: string): NoteItem | undefined {
  const notes = getAllNotes();
  return notes.find((note) => note.id === id);
}

export function getFeaturedNotes(): NoteItem[] {
  const notes = getAllNotes();
  const featured = notes.filter((n) => n.featured);
  return featured.length > 0 ? featured : notes.slice(0, 3);
}
