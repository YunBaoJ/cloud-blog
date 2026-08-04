"use client";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="inline-flex items-center gap-2 text-sm font-medium text-[#7A736A] hover:text-[#36513B] transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>返回上一页</span>
    </button>
  );
}
