"use client";

import { useEffect, useState, useRef } from "react";
import { List, ChevronRight, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export interface TOCItem {
  id: string;
  title: string;
  level: number;
}

export default function ArticleTOC({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (sidebarRef.current) {
      gsap.from(sidebarRef.current, {
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.3,
      });
    }
  }, []);

  useEffect(() => {
    if (items.length === 0) return;

    const handleScroll = () => {
      const headingElements = items
        .map((item) => ({ id: item.id, el: document.getElementById(item.id) }))
        .filter((item): item is { id: string; el: HTMLElement } => item.el !== null);

      if (headingElements.length === 0) return;

      let currentActiveId = headingElements[0].id;
      for (let i = 0; i < headingElements.length; i++) {
        const { id, el } = headingElements[i];
        const rect = el.getBoundingClientRect();
        if (rect.top <= 180) {
          currentActiveId = id;
        } else {
          break;
        }
      }
      setActiveId(currentActiveId);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const scrollToHeading = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpenMobile(false);
    setActiveId(id);
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      const targetY = rect.top + window.scrollY - 110;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  if (items.length === 0) return null;

  return (
    <>
      {/* Desktop/Tablet Fixed Outer Left Panel — Square with smooth rounded-2xl corners, aligned at top-28 */}
      <aside ref={sidebarRef} className="fixed left-3 sm:left-4 md:left-5 lg:left-6 xl:left-8 2xl:left-14 top-28 z-40 w-52 hidden lg:block">
        <nav className="space-y-3 bg-white/95 dark:bg-[#1C1A17]/95 backdrop-blur-xl p-4.5 rounded-2xl border border-[#2D2B2C]/12 dark:border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between border-b border-[#2D2B2C]/10 dark:border-white/15 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#36513B] dark:text-[#7CD090] uppercase tracking-wider font-mono">
              <List className="w-4 h-4 text-[#8C4A31] dark:text-[#E5987D]" />
              <span>文章目录</span>
            </div>
            <span className="text-[10px] font-mono text-[#7A736A] dark:text-[#9EB3A4] px-2 py-0.5 rounded-full bg-[#FAF7F2] dark:bg-[#24221F] border border-[#2D2B2C]/8 dark:border-white/10">
              {items.length} 章节
            </span>
          </div>

          <ul className="space-y-1.5 text-xs font-medium max-h-[65vh] overflow-y-auto pr-1">
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id} style={{ paddingLeft: item.level === 3 ? "0.75rem" : "0rem" }}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => scrollToHeading(item.id, e)}
                    className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-[#36513B] text-white dark:bg-[#7CD090] dark:text-[#142219] font-bold shadow-2xs translate-x-1"
                        : "text-[#5A5551] dark:text-[#9EB3A4] hover:bg-[#FAF7F2] dark:hover:bg-[#23382C] hover:text-[#2D2B2C] dark:hover:text-[#F0F5F1]"
                    }`}
                  >
                    <ChevronRight className={`w-3 h-3 flex-shrink-0 transition-transform ${isActive ? "translate-x-0.5 opacity-100 text-white dark:text-[#142219]" : "opacity-40"}`} />
                    <span className="truncate">{item.title}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile Floating Capsule Button & Popup Panel */}
      <div className="lg:hidden fixed right-5 bottom-6 z-40">
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
