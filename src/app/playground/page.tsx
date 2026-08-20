import type { Metadata } from "next";
import PlaygroundClient from "./PlaygroundClient";

export const metadata: Metadata = {
  title: "游乐场",
  description: "工作余暇的放松驿站。提供贪吃蛇、2048、数字华容道、五子棋 AI 与中国象棋 AI 等精巧小游戏。",
  openGraph: {
    title: "游乐场 | Kasumi 的数字小屋",
    description: "工作余暇的放松驿站。提供贪吃蛇、2048、数字华容道、五子棋 AI 与中国象棋 AI 等精巧小游戏。",
  },
};

export default function PlaygroundPage() {
  return <PlaygroundClient />;
}
