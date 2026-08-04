import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "摄影画廊",
  description: "用胶片记录光影与时间，每一张照片都是一首无声的诗。",
  openGraph: {
    title: "摄影画廊 | Cloud 的数字小屋",
    description: "用胶片记录光影与时间，每一张照片都是一首无声的诗。",
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
