"use client";

import { useEffect, useState } from "react";
import { List, ChevronRight, X } from "lucide-react";

export interface TOCItem {
  id: string;
  title: string;
  level: number;
}

export default function ArticleTOC({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;

    const handleScroll = () => {
      const headingElements = items
        .map((item) => document.getElementById(item.id))
        .filter(Boolean) as HTMLElement[];

      const scrollPosition = window.scrollY + 140;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el.offsetTop <= scrollPosition) {
          setActiveId(items[i].id);
          return;
        }
      }
      setActiveId(items[0]?.id || "");
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const scrollToHeading = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpenMobile(false);
    const el = document.getElementById(id);
    if (el) {
      const targetY = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  if (items.length === 0) return null;

  return (
    <>
      {/* Desktop Floating Outer Left Panel — Positioned further left for generous breathing room from the main article card */}
      <aside className="fixed left-2 sm:left-4 md:left-6 xl:left-6 2xl:left-12 3xl:left-20 top-80 z-40 w-52 hidden xl:block animate-in fade-in duration-300">
        <nav className="space-y-3 bg-white/85 dark:bg-[#1C1A17]/85 backdrop-blur-xl p-5 rounded-3xl border border-[#2D2B2C]/8 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between border-b border-[#2D2B2C]/8 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#36513B] dark:text-[#7CD090] uppercase tracking-wider font-mono">
              <List className="w-4 h-4 text-[#8C4A31] dark:text-[#E5987D]" />
              <span>文章目录</span>
            </div>
            <span className="text-[10px] font-mono text-[#7A736A] dark:text-[#9EB3A4] px-2 py-0.5 rounded-full bg-[#FAF7F2] dark:bg-[#24221F]">
              {items.length} 章节
            </span>
          </div>

          <ul className="space-y-1.5 text-xs font-medium max-h-[60vh] overflow-y-auto pr-1">
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id} style={{ paddingLeft: item.level === 3 ? "0.75rem" : "0rem" }}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => scrollToHeading(item.id, e)}
                    className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-[#36513B] text-white dark:bg-[#7CD090] dark:text-[#142219] font-bold shadow-2xs"
                        : "text-[#5A5551] dark:text-[#9EB3A4] hover:bg-[#FAF7F2] dark:hover:bg-[#23382C] hover:text-[#2D2B2C] dark:hover:text-[#F0F5F1]"
                    }`}
                  >
                    <ChevronRight className={`w-3 h-3 flex-shrink-0 transition-transform ${isActive ? "translate-x-0.5 opacity-100" : "opacity-40"}`} />
                    <span className="truncate">{item.title}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile / Tablet Floating Capsule Button & Popup Panel */}
      <div className="xl:hidden fixed right-5 bottom-6 z-40">
        {!isOpenMobile ? (
          <button
            onClick={() => setIsOpenMobile(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#36513B] dark:bg-[#7CD090] text-white dark:text-[#142219] text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <List className="w-4 h-4" />
            <span>目录 ({items.length})</span>
          </button>
        ) : (
          <div className="w-72 bg-white dark:bg-[#1C1A17] p-5 rounded-3xl border border-[#2D2B2C]/10 dark:border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.2)] space-y-3 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between border-b border-[#2D2B2C]/8 dark:border-white/10 pb-2.5">
              <span className="text-xs font-bold text-[#36513B] dark:text-[#7CD090] font-mono">目录导航</span>
              <button
                onClick={() => setIsOpenMobile(false)}
                className="p-1 rounded-lg text-[#7A736A] hover:bg-[#2D2B2C]/5 dark:hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-1 text-xs font-medium max-h-60 overflow-y-auto pr-1">
              {items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <li key={item.id} style={{ paddingLeft: item.level === 3 ? "0.75rem" : "0rem" }}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => scrollToHeading(item.id, e)}
                      className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl transition-all ${
                        isActive
                          ? "bg-[#36513B] text-white dark:bg-[#7CD090] dark:text-[#142219] font-bold"
                          : "text-[#5A5551] dark:text-[#9EB3A4] hover:bg-[#FAF7F2] dark:hover:bg-[#23382C]"
                      }`}
                    >
                      <ChevronRight className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
