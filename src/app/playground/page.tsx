import type { Metadata } from "next";
import PlaygroundClient from "./PlaygroundClient";

export const metadata: Metadata = {
  title: "灵感游乐场",
  description: "番茄钟专注计时器与每日一言诗句生成器，为安静的创作时光寻找轻盈灵感。",
  openGraph: {
    title: "灵感游乐场 | Cloud 的数字小屋",
    description: "番茄钟专注计时器与每日一言诗句生成器。",
  },
};

export default function PlaygroundPage() {
  return <PlaygroundClient />;
}
