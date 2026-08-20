import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "关于 Kasumi",
  description: "关于 Kasumi 与这间数字小屋：记录技术探索、随笔沉淀、视觉收藏和浏览器小实验。",
  openGraph: {
    title: "关于 Kasumi | Kasumi 的数字小屋",
    description: "记录技术探索、随笔沉淀、视觉收藏和浏览器小实验。",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
