import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "关于 Cloud",
  description: "关于 Cloud 与这间数字小屋：记录技术笔记、图像收藏和浏览器实验。",
  openGraph: {
    title: "关于 Cloud | Cloud 的数字小屋",
    description: "记录技术笔记、图像收藏和浏览器实验。",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
