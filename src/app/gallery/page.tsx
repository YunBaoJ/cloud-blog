import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "作品画廊",
  description: "收录插画、动漫与日常灵感，让喜欢的画面安静留在这里。",
  openGraph: {
    title: "作品画廊 | Cloud 的数字小屋",
    description: "收录插画、动漫与日常灵感，让喜欢的画面安静留在这里。",
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
