import type { Metadata } from "next";
import { getAllNotes } from "@/lib/notes";
import ArchiveClient from "./ArchiveClient";

export const metadata: Metadata = {
  title: "文章归档",
  description: "按时间、标签与分类浏览全部文章，找到你感兴趣的内容。",
  openGraph: {
    title: "文章归档 | Kasumi 的数字小屋",
    description: "按时间、标签与分类浏览全部文章。",
  },
};

export default function ArchivePage() {
  const notes = getAllNotes();
  return <ArchiveClient initialNotes={notes} />;
}
