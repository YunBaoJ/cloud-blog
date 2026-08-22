"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Archive,
  BookOpen,
  Compass,
  CornerDownLeft,
  Gamepad2,
  History,
  ImageIcon,
  Layers3,
  Search,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { GALLERY_PHOTOS } from "@/data/siteContent";
import { getGalleryWorkHref } from "@/lib/galleryUrl.mts";
import type { NoteItem } from "@/lib/notes";
import { useMounted } from "@/lib/useMounted";

type SearchNote = Pick<NoteItem, "id" | "title" | "summary" | "category" | "tags">;
type SearchIcon = typeof Search;

interface CommandMenuProps {
  notes: SearchNote[];
}

interface SearchResult {
  title: string;
  path: string;
  category: string;
  icon: SearchIcon;
}

interface SearchGroup {
  label: string;
  items: SearchResult[];
}

const RECENT_SEARCHES_KEY = "cloud-recent-searches";
const RECENT_SEARCHES_EVENT = "cloud-recent-searches-change";

const GAMES_SEARCH_DATA = [
  { title: "贪吃蛇小游戏", path: "/playground#snake", category: "经典游戏", icon: Gamepad2 },
  { title: "2048 数字合并", path: "/playground#2048", category: "数字益智", icon: Gamepad2 },
  { title: "数字华容道拼图", path: "/playground#puzzle", category: "逻辑挑战", icon: Gamepad2 },
  { title: "五子棋单人/双人对弈", path: "/playground#gomoku", category: "棋类对弈", icon: Gamepad2 },
  { title: "中国象棋 AI 博弈", path: "/playground#xiangqi", category: "棋类博弈", icon: Gamepad2 },
] satisfies SearchResult[];

const NAVIGATION_RESULTS = [
  { title: "小屋主页", path: "/", category: "页面导航", icon: Compass },
  { title: "随笔笔记", path: "/notes", category: "页面导航", icon: BookOpen },
  { title: "作品画廊", path: "/gallery", category: "页面导航", icon: ImageIcon },
  { title: "项目档案", path: "/projects", category: "页面导航", icon: Layers3 },
  { title: "游乐场", path: "/playground", category: "页面导航", icon: Sparkles },
  { title: "文章归档", path: "/archive", category: "页面导航", icon: Archive },
  { title: "关于小屋", path: "/about", category: "页面导航", icon: User },
] satisfies SearchResult[];

function subscribeToRecentSearches(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === RECENT_SEARCHES_KEY) callback();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(RECENT_SEARCHES_EVENT, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(RECENT_SEARCHES_EVENT, callback);
  };
}

function getRecentSearchesSnapshot() {
  return localStorage.getItem(RECENT_SEARCHES_KEY) ?? "[]";
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const index = text.toLocaleLowerCase().indexOf(query.toLocaleLowerCase());
  if (!query || index < 0) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-sm bg-[var(--accent-clay)]/25 px-0.5 text-inherit">{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

export default function CommandMenu({ notes }: CommandMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const mounted = useMounted();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);
  const invokerRef = useRef<HTMLElement | null>(null);
  const recentRaw = useSyncExternalStore(subscribeToRecentSearches, getRecentSearchesSnapshot, () => "[]");
  const recentSearches = useMemo(() => {
    try {
      const parsed = JSON.parse(recentRaw);
      return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string").slice(0, 5) : [];
    } catch {
      return [];
    }
  }, [recentRaw]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const openMenu = useCallback(() => {
    invokerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsOpen(true);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (isOpen) closeMenu();
        else openMenu();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [closeMenu, isOpen, openMenu]);

  useEffect(() => {
    if (!isOpen) return;
    const siteRoot = document.getElementById("site-root");
    siteRoot?.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => inputRef.current?.focus());

    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input, [href], [tabindex]:not([tabindex="-1"])',
      ));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleDialogKeyDown);
    return () => {
      window.removeEventListener("keydown", handleDialogKeyDown);
      siteRoot?.removeAttribute("inert");
      document.body.style.overflow = "";
      window.requestAnimationFrame(() => invokerRef.current?.focus());
    };
  }, [closeMenu, isOpen]);

  // 键盘上下移动时让选中项滚入可视区
  useEffect(() => {
    selectedItemRef.current?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const normalizedQuery = query.toLocaleLowerCase().trim();
  const matches = (values: string[]) => !normalizedQuery || values.some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
  const groups: SearchGroup[] = [
    {
      label: "页面",
      items: NAVIGATION_RESULTS.filter((item) => matches([item.title, item.category])),
    },
    {
      label: "文章",
      items: notes
        .filter((note) => matches([note.title, note.summary, note.category, ...note.tags]))
        .map((note) => ({
          title: note.title,
          path: `/notes/${note.id}`,
          category: note.category,
          icon: BookOpen,
        })),
    },
    {
      label: "作品",
      items: GALLERY_PHOTOS
        .filter((photo) => matches([photo.title, photo.source, photo.story]))
        .map((photo) => ({
          title: photo.title,
          path: getGalleryWorkHref(photo.id),
          category: photo.source,
          icon: ImageIcon,
        })),
    },
    {
      label: "游戏",
      items: GAMES_SEARCH_DATA.filter((game) => matches([game.title, game.category])),
    },
  ].filter((group) => group.items.length > 0);
  const allResults = groups.flatMap((group) => group.items);

  const saveRecentSearch = () => {
    const value = query.trim();
    if (!value) return;
    const next = [value, ...recentSearches.filter((item) => item !== value)].slice(0, 5);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(RECENT_SEARCHES_EVENT));
  };

  const handleSelect = (path: string) => {
    saveRecentSearch();
    closeMenu();
    router.push(path);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((current) => (current + 1) % Math.max(allResults.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((current) => (current - 1 + allResults.length) % Math.max(allResults.length, 1));
    } else if (event.key === "Enter" && allResults[selectedIndex]) {
      event.preventDefault();
      handleSelect(allResults[selectedIndex].path);
    }
  };

  if (!mounted || !isOpen) return null;

  let resultIndex = 0;
  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-stretch justify-center bg-[var(--hero-ink,#26352A)]/45 p-0 backdrop-blur-md sm:items-start sm:px-4 sm:pt-24"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeMenu();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="全局搜索"
        className="flex min-h-dvh w-full max-w-xl flex-col overflow-hidden bg-[var(--surface)] text-[var(--foreground)] shadow-[0_16px_48px_rgba(0,0,0,0.22)] sm:min-h-0 sm:max-h-[75dvh] sm:rounded-3xl sm:border sm:border-[var(--border-line-color)]"
      >
        <div className="flex items-center gap-3 border-b border-[var(--border-line-color)] px-5 py-4">
          <Search className="size-5 text-[var(--accent-green)]" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            placeholder="搜索文章、作品、游戏或页面"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            className="w-full bg-transparent text-sm font-medium placeholder:text-[var(--muted)] focus:outline-none"
          />
          <button
            type="button"
            onClick={closeMenu}
            aria-label="关闭搜索"
            className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {!normalizedQuery && recentSearches.length > 0 && (
          <div className="border-b border-[var(--border-line-color)] px-5 py-3">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-[var(--muted)]">
              <History className="size-3.5" aria-hidden="true" />
              最近搜索
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setQuery(item);
                    setSelectedIndex(0);
                    inputRef.current?.focus();
                  }}
                  className="rounded-full bg-[var(--surface-2)] px-3 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 space-y-4 overflow-y-auto p-3 sm:max-h-[28rem]">
          {allResults.length === 0 ? (
            <div className="py-14 text-center text-sm text-[var(--muted)]">
              未找到与“{query}”匹配的内容
            </div>
          ) : groups.map((group) => (
            <section key={group.label} aria-labelledby={`search-group-${group.label}`}>
              <h2 id={`search-group-${group.label}`} className="px-3 pb-1.5 text-[10px] font-semibold tracking-[0.16em] text-[var(--muted)]">
                {group.label}
              </h2>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const itemIndex = resultIndex++;
                  const isSelected = itemIndex === selectedIndex;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      ref={isSelected ? selectedItemRef : undefined}
                      type="button"
                      onClick={() => handleSelect(item.path)}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-colors ${isSelected ? "bg-[var(--accent-green)] text-[#F0F5F1]" : "hover:bg-[var(--surface-2)]"}`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Icon className={`size-4 shrink-0 ${isSelected ? "text-current" : "text-[var(--accent-green)]"}`} aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-semibold"><HighlightedText text={item.title} query={query.trim()} /></span>
                          <span className={`block truncate text-[10px] ${isSelected ? "opacity-75" : "text-[var(--muted)]"}`}><HighlightedText text={item.category} query={query.trim()} /></span>
                        </span>
                      </span>
                      {isSelected && <CornerDownLeft className="size-3.5 shrink-0 opacity-80" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--border-line-color)] bg-[var(--surface-2)]/70 px-5 py-2.5 text-[10px] text-[var(--muted)] sm:text-[11px]">
          <span>↑ ↓ 选择 · ↵ 打开 · ESC 关闭</span>
          <span className="hidden sm:inline">⌘K / Ctrl+K</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
