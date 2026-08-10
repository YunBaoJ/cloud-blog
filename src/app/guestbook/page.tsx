import type { Metadata } from "next";
import GuestbookClient from "./GuestbookClient";

export const metadata: Metadata = {
  title: "时光留言墙",
  description: "在这里写下一句问候，留下你此刻的想法。愿文字如春风般平实温润。",
  openGraph: {
    title: "时光留言墙 | Cloud 的数字小屋",
    description: "写下一句问候，留下你此刻的想法。",
  },
};

export default function GuestbookPage() {
  return <GuestbookClient />;
}
