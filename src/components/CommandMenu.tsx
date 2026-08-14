"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, ImageIcon, Sparkles, User, Archive, X, CornerDownLeft, Gamepad2, Compass } from "lucide-react";
import { GALLERY_PHOTOS } from "@/data/siteContent";
import type { NoteItem } from "@/lib/notes";
import { getGalleryWorkHref } from "@/lib/galleryUrl.mts";

type SearchNote = Pick<NoteItem, "id" | "title" | "summary" | "category" | "tags">;

interface CommandMenuProps {
  notes: SearchNote[];
}

const GAMES_SEARCH_DATA = [
  { id: "snake", title: "贪吃蛇小游戏", path: "/playground#snake", category: "游乐场 · 游戏", icon: Gamepad2 },
  { id: "2048", title: "2048 数字合并", path: "/playground#2048", category: "游乐场 · 游戏", icon: Gamepad2 },
  { id: "puzzle", title: "数字华容道拼图", path: "/playground#puzzle", category: "游乐场 · 游戏", icon: Gamepad2 },
  { id: "gomoku", title: "五子棋单人/双人对弈", path: "/playground#gomoku", category: "游乐场 · 游戏", icon: Gamepad2 },
  { id: "xiangqi", title: "中国象棋 AI 博弈", path: "/playground#xiangqi", category: "游乐场 · 游戏", icon: Gamepad2 },
];

export default function CommandMenu({ notes }: CommandMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const activeNotes = notes;
  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) closeMenu();
        else setIsOpen(true);
      }
      if (e.key === "Escape") {
        closeMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeMenu, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const q = query.toLowerCase().trim();

  const navResults = [
    { title: "小屋主页", path: "/", category: "页面导航", icon: Compass },
    { title: "随笔笔记列表", path: "/notes", category: "页面导航", icon: BookOpen },
    { title: "作品画廊", path: "/gallery", category: "页面导航", icon: ImageIcon },
    { title: "摸鱼游乐场", path: "/playground", category: "页面导航", icon: Sparkles },
    { title: "文章归档时间轴", path: "/archive", category: "页面导航", icon: Archive },
    { title: "关于 Cloud", path: "/about", category: "页面导航", icon: User },
  ].filter((item) => !q || item.title.toLowerCase().includes(q));

  const gameResults = GAMES_SEARCH_DATA.filter(
    (g) => !q || g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)
  );

  const noteResults = activeNotes
    .filter(
      (n) =>
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
    )
    .map((n) => ({
      title: n.title,
      path: `/notes/${n.id}`,
      category: `随笔 · ${n.category}`,
      icon: BookOpen,
    }));

  const photoResults = GALLERY_PHOTOS.filter(
    (p) =>
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.source.toLowerCase().includes(q) ||
      p.story.toLowerCase().includes(q)
  ).map((p) => ({
    title: p.title,
    path: getGalleryWorkHref(p.id),
    category: `作品 · ${p.source}`,
    icon: ImageIcon,
  }));

  const allResults = [...navResults, ...gameResults, ...noteResults, ...photoResults];

  const handleSelect = (path: string) => {
    closeMenu();
    router.push(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(allResults.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allResults.length) % Math.max(allResults.length, 1));
    } else if (e.key === "Enter" && allResults[selectedIndex]) {
      e.preventDefault();
      handleSelect(allResults[selectedIndex].path);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-150"
      onClick={closeMenu}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#1C1A17] rounded-3xl border border-[#2D2B2C]/10 dark:border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.22)] overflow-hidden space-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2D2B2C]/8 dark:border-white/10">
          <Search className="w-5 h-5 text-[#36513B] dark:text-[#7CD090]" />
          <input
            type="text"
            autoFocus
            placeholder="搜索文章、作品、小游戏或页面... (ESC 退出)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm font-medium text-[#2D2B2C] dark:text-[#F0F5F1] placeholder-[#7A736A] dark:placeholder-[#9EB3A4] focus:outline-none"
          />
          <button
            onClick={closeMenu}
            className="p-1 rounded-lg text-[#7A736A] hover:bg-[#2D2B2C]/5 dark:hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {allResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#7A736A] dark:text-[#9EB3A4]">
              未找到与 &quot;{query}&quot; 匹配的内容
            </div>
          ) : (
            allResults.map((item, idx) => {
              const IconComp = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={`${item.path}-${idx}`}
                  onClick={() => handleSelect(item.path)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#36513B] text-white dark:bg-[#7CD090] dark:text-[#142219]"
                      : "hover:bg-[#FAF7F2] dark:hover:bg-[#23382C] text-[#2D2B2C] dark:text-[#F0F5F1]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <IconComp className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-current" : "text-[#36513B] dark:text-[#7CD090]"}`} />
                    <div className="truncate">
                      <p className="text-xs font-bold truncate">{item.title}</p>
                      <p className={`text-[10px] ${isSelected ? "opacity-80" : "text-[#7A736A] dark:text-[#9EB3A4]"}`}>
                        {item.category}
                      </p>
                    </div>
                  </div>
                  {isSelected && <CornerDownLeft className="w-3.5 h-3.5 opacity-80" />}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-5 py-2.5 bg-[#FAF7F2] dark:bg-[#142219] border-t border-[#2D2B2C]/5 dark:border-white/5 flex items-center justify-between text-[11px] text-[#7A736A] dark:text-[#9EB3A4] font-mono">
          <span>↑ ↓ 选择 · ↵ 确认跳转</span>
          <span>⌘K / Ctrl+K 触发搜索</span>
        </div>
      </div>
    </div>
  );
}
