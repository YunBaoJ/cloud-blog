"use client";

import { Code2, Camera, Feather, BookOpen, MapPin, Radio } from "lucide-react";

interface HomepageStatsProps {
  notesCount?: number;
  photosCount?: number;
  gamesCount?: number;
}

export default function HomepageStats({
  notesCount = 6,
  photosCount = 8,
  gamesCount = 5,
}: HomepageStatsProps) {
  const stats = [
    {
      id: "code",
      icon: Code2,
      iconColor: "text-[#36513B] dark:text-[#7CD090]",
      bgColor: "bg-[#E2EBE4] dark:bg-[#23382C]",
      title: "代码与思考",
      metric: `${notesCount} 篇沉淀`,
      desc: "Next.js · TS · 全栈架构",
    },
    {
      id: "photo",
      icon: Camera,
      iconColor: "text-[#8C4A31] dark:text-[#E5987D]",
      bgColor: "bg-[#FAF0EA] dark:bg-[#33221C]",
      title: "胶片光影",
      metric: `${photosCount} 幅收录`,
      desc: "光影定格 · 视觉精选",
    },
    {
      id: "prose",
      icon: Feather,
      iconColor: "text-[#2B4C6F] dark:text-[#8EB8E5]",
      bgColor: "bg-[#E8F0F8] dark:bg-[#1E2C3A]",
      title: "诗意随笔",
      metric: "字里行间",
      desc: "星河清梦 · 独立思考",
    },
    {
      id: "life",
      icon: BookOpen,
      iconColor: "text-[#C46A4A] dark:text-[#E29878]",
      bgColor: "bg-[#FDEEE9] dark:bg-[#382620]",
      title: "掌机游乐场",
      metric: `${gamesCount} 款算法小游戏`,
      desc: "贪吃蛇 · 2048 · 象棋 AI",
    },
  ];

  return (
    <section className="w-full bg-transparent py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Status Pill Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#7A736A] dark:text-[#9EB3A4] font-medium border-b border-[#2D2B2C]/5 dark:border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#36513B] dark:bg-[#7CD090] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#36513B] dark:bg-[#7CD090]" />
            </span>
            <span className="font-semibold text-[#2D2B2C] dark:text-[#F0F5F1]">当前状态: 正在创作与深度思考中</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#8C4A31] dark:text-[#E5987D]" />
              中国 · 杭州
            </span>
            <span className="inline-flex items-center gap-1 font-mono">
              <Radio className="w-3.5 h-3.5 text-[#36513B] dark:text-[#7CD090]" />
              Blog v2.4 (App Router)
            </span>
          </div>
        </div>

        {/* 4 Core Focus Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between p-5 rounded-2xl bg-white/80 dark:bg-[#1C261F]/80 border border-white/90 dark:border-white/10 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${item.bgColor} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <IconComponent className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#2D2B2C] dark:text-[#F0F5F1] bg-[#FAF7F2] dark:bg-[#16221B] px-2.5 py-1 rounded-full border border-[#2D2B2C]/5 dark:border-white/10">
                    {item.metric}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-[#2D2B2C] dark:text-[#F0F5F1] group-hover:text-[#36513B] dark:group-hover:text-[#7CD090] transition-colors">{item.title}</h4>
                  <p className="text-xs text-[#7A736A] dark:text-[#9EB3A4] font-mono truncate">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
