import type { Metadata } from "next";
import NotesClient from "./NotesClient";

export const metadata: Metadata = {
  title: "随笔笔记",
  description: "代码、摄影与日常的文字记录。全部文章按时间脉络梳理。",
  openGraph: {
    title: "随笔笔记 | Cloud 的数字小屋",
    description: "代码、摄影与日常的文字记录。",
  },
};

export default function NotesPage() {
  return <NotesClient />;
}
