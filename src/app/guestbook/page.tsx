import type { Metadata } from "next";
import GuestbookClient from "./GuestbookClient";

export const metadata: Metadata = {
  title: "时光留言板",
  description: "在这里写下一句问候，留下你此刻的想法。愿文字如手冲咖啡般平实温润。",
  openGraph: {
    title: "时光留言板 | Cloud 的数字小屋",
    description: "写下一句问候，留下你此刻的想法。",
  },
};

export default function GuestbookPage() {
  return <GuestbookClient />;
}
