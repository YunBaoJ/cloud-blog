"use client";

import { PLAYGROUND_ITEMS, PlaygroundItem } from "@/data/siteContent";
import { Sparkles, Gamepad2, Grid, Bot, ArrowRight, Dices, Award } from "lucide-react";
import Link from "next/link";

export default function PlaygroundTeaser() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Snake":
        return <Dices className="w-5 h-5 text-[#36513B]" />;
      case "Grid":
        return <Grid className="w-5 h-5 text-[#C46A4A]" />;
      case "Gamepad":
        return <Gamepad2 className="w-5 h-5 text-[#2B4C6F]" />;
      case "Bot":
        return <Bot className="w-5 h-5 text-[#8C4A31]" />;
      case "Award":
        return <Award className="w-5 h-5 text-[#C46A4A]" />;
      default:
        return <Gamepad2 className="w-5 h-5 text-[#36513B]" />;
    }
  };

  return (
    <section
      id="playground"
      className="relative w-full py-20 md:py-28 px-4 bg-transparent"
    >
      <div className="relative z-10 max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FDEEE9] text-[#C46A4A] text-xs font-semibold tracking-wide shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>迷你游戏中心</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2B2C] tracking-tight">
              灵感游乐场 (Playground)
            </h2>
            <p className="text-sm sm:text-base text-[#5A5551] max-w-lg font-normal">
              贪吃蛇、2048、数字华容道、五子棋与中国象棋 AI 对弈，为创作之余寻找轻松灵感。
            </p>
          </div>
          <Link
            href="/playground"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C46A4A] hover:text-[#A35235] transition-colors group"
          >
            <span>进入游乐场</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLAYGROUND_ITEMS.map((item: PlaygroundItem) => (
            <Link
              key={item.id}
              href={`/playground#${item.id}`}
              className="group bg-white/90 backdrop-blur-xs rounded-3xl p-6 border border-white/90 shadow-[0_4px_24px_rgba(45,43,44,0.04)] hover:-translate-y-1.5 hover:shadow-[0_14px_32px_rgba(45,43,44,0.08)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/90 border border-white/60 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    {getIcon(item.icon)}
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#7A736A] border border-white/80">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#2D2B2C] group-hover:text-[#C46A4A] transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#5A5551] leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#2D2B2C]/5 text-xs text-[#7A736A] font-medium flex items-center justify-between">
                <span>体验模式: 实时互动</span>
                <span className="text-[#C46A4A] font-semibold">进入体验 →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
