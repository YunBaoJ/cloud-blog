import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "关于 Cloud",
  description: "前端工程师、胶片摄影师与手冲咖啡爱好者。这里是我的数字客房与生活实验场地。",
  openGraph: {
    title: "关于 Cloud | Cloud 的数字小屋",
    description: "前端工程师、胶片摄影师与手冲咖啡爱好者。",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
