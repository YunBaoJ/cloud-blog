"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Feather, Sparkles, BookOpen, User, ImageIcon, Archive, Clock3, Layers3, Search, MoreHorizontal } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const firstMoreLinkRef = useRef<HTMLAnchorElement>(null);
  const wasMoreOpenRef = useRef(false);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const triggerSearch = () => {
    setIsMoreOpen(false);
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true, metaKey: true, bubbles: true })
    );
  };

  useEffect(() => {
    if (!isMoreOpen) {
      if (wasMoreOpenRef.current) {
        window.requestAnimationFrame(() => moreButtonRef.current?.focus());
        wasMoreOpenRef.current = false;
      }
      return;
    }
    wasMoreOpenRef.current = true;
    window.requestAnimationFrame(() => firstMoreLinkRef.current?.focus());

    const handlePointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setIsMoreOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMoreOpen(false);
    };
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMoreOpen]);

  return (
    <header className="fixed inset-x-0 top-3 z-50 w-full px-2 pointer-events-none sm:top-5 sm:px-6 lg:px-8">
      {/* Centered Floating Nav Container */}
      <div className="max-w-6xl mx-auto flex items-center justify-center">
        
        {/* Apple Acrylic Liquid Glass Floating Pill Bar */}
        <div ref={navRef} className="pointer-events-auto relative inline-flex max-w-[calc(100vw-1rem)] items-center gap-0.5 overflow-visible whitespace-nowrap rounded-full p-1 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl saturate-150 transition-all duration-300 [&>*]:shrink-0 sm:max-w-[calc(100vw-3rem)] sm:gap-1.5 sm:p-1.5"
          style={{
            background: "var(--nav-bg)",
            border: "1px solid var(--nav-border)",
            boxShadow: "0 10px 32px -4px rgba(0,0,0,0.10), inset 0 1px 1px 0 rgba(255,255,255,0.55)",
          }}
        >
          
          {/* 1. 小屋主页 */}
          <Link
            href="/"
            aria-label="小屋主页"
            className={`flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-semibold transition-all group/home sm:min-h-0 sm:min-w-0 sm:px-3 ${
              isActive("/")
                ? "bg-white text-[#2D2B2C] shadow-2xs"
                : "text-[#5A5551] hover:text-[#2D2B2C] hover:bg-white/70"
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-[#E2EBE4] border border-[#D2DFD5] flex items-center justify-center text-[#36513B] group-hover/home:rotate-12 transition-transform">
              <Feather className="w-3 h-3" />
            </div>
            <span className="hidden tracking-tight font-bold sm:inline">小屋主页</span>
          </Link>

          {/* 2. 随笔笔记 */}
          <Link
            href="/notes"
            aria-label="随笔笔记"
            className={`flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-medium transition-all sm:min-h-0 sm:min-w-0 sm:px-3 ${
              isActive("/notes")
                ? "bg-white text-[#2D2B2C] shadow-2xs font-semibold"
                : "text-[#5A5551] hover:text-[#2D2B2C] hover:bg-white/70"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#4E7A56]" />
            <span className="hidden sm:inline">随笔笔记</span>
          </Link>

          {/* 3. 作品画廊 */}
          <Link
            href="/gallery"
            aria-label="作品画廊"
            className={`flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-medium transition-all sm:min-h-0 sm:min-w-0 sm:px-3 ${
              isActive("/gallery")
                ? "bg-white text-[#2D2B2C] shadow-2xs font-semibold"
                : "text-[#5A5551] hover:text-[#2D2B2C] hover:bg-white/70"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-[var(--accent-clay)]" />
            <span className="hidden md:inline">作品画廊</span>
          </Link>

          {/* 4. 项目案例 */}
          <Link
            href="/projects"
            aria-label="项目"
            className={`hidden min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-medium transition-all sm:min-h-0 sm:min-w-0 sm:px-3 md:flex ${isActive("/projects") ? "bg-white text-[#2D2B2C] shadow-2xs font-semibold" : "text-[#5A5551] hover:text-[#2D2B2C] hover:bg-white/70"}`}
          >
            <Layers3 className="w-3.5 h-3.5 text-[var(--accent-green)]" />
            <span className="hidden lg:inline">项目</span>
          </Link>

          {/* 5. 灵感游乐场 */}
          <Link
            href="/playground"
            aria-label="游乐场"
            className={`flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-medium transition-all sm:min-h-0 sm:min-w-0 sm:px-3 ${
              isActive("/playground")
                ? "bg-white text-[#2D2B2C] shadow-2xs font-semibold"
                : "text-[#5A5551] hover:text-[#2D2B2C] hover:bg-white/70"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C46A4A]" />
            <span className="hidden sm:inline">游乐场</span>
          </Link>

          {/* 6. 近况 */}
          <Link
            href="/now"
            aria-label="近况"
            className={`hidden min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-medium transition-all sm:min-h-0 sm:min-w-0 sm:px-3 md:flex ${
              isActive("/now")
                ? "bg-white text-[#2D2B2C] shadow-2xs font-semibold"
                : "text-[#5A5551] hover:text-[#2D2B2C] hover:bg-white/70"
            }`}
          >
            <Clock3 className="w-3.5 h-3.5 text-[var(--accent-clay)]" />
            <span className="hidden md:inline">近况</span>
          </Link>

          {/* 7. 文章归档 */}
          <Link
            href="/archive"
            aria-label="文章归档"
            className={`hidden min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-medium transition-all sm:min-h-0 sm:min-w-0 sm:px-3 md:flex ${
              isActive("/archive")
                ? "bg-white text-[#2D2B2C] shadow-2xs font-semibold"
                : "text-[#5A5551] hover:text-[#2D2B2C] hover:bg-white/70"
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-[#2B4C6F]" />
            <span className="hidden lg:inline">归档</span>
          </Link>

          {/* 8. 关于小屋 */}
          <Link
            href="/about"
            aria-label="关于小屋"
            className={`hidden min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-medium transition-all sm:min-h-0 sm:min-w-0 sm:px-3 md:flex ${
              isActive("/about")
                ? "bg-white text-[#2D2B2C] shadow-2xs font-semibold"
                : "text-[#5A5551] hover:text-[#2D2B2C] hover:bg-white/70"
            }`}
          >
            <User className="w-3.5 h-3.5 text-[#544F49]" />
            <span className="hidden md:inline">关于</span>
          </Link>

          <button
            ref={moreButtonRef}
            type="button"
            onClick={() => setIsMoreOpen((current) => !current)}
            aria-label="更多导航"
            aria-expanded={isMoreOpen}
            aria-controls="mobile-more-navigation"
            className={`flex min-h-10 min-w-10 items-center justify-center rounded-full text-xs transition-colors md:hidden ${isMoreOpen || isActive("/projects") || isActive("/now") || isActive("/archive") || isActive("/about") ? "bg-white text-[#2D2B2C] shadow-2xs" : "text-[#5A5551] hover:bg-white/70"}`}
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </button>

          {isMoreOpen && (
            <div
              id="mobile-more-navigation"
              role="menu"
              aria-label="更多导航"
              className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-44 space-y-1 rounded-2xl border border-[var(--nav-border)] bg-[var(--surface)]/96 p-2 text-[var(--foreground)] shadow-[0_16px_40px_rgba(38,53,42,0.18)] backdrop-blur-2xl md:hidden"
            >
              {[
                { href: "/projects", label: "项目", icon: Layers3 },
                { href: "/now", label: "近况", icon: Clock3 },
                { href: "/archive", label: "归档", icon: Archive },
                { href: "/about", label: "关于", icon: User },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    ref={index === 0 ? firstMoreLinkRef : undefined}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setIsMoreOpen(false)}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${isActive(item.href) ? "bg-[var(--accent-green)] text-[#F0F5F1]" : "hover:bg-[var(--surface-2)]"}`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Theme toggle (夜间模式切换) */}
          <ThemeToggle />

          {/* 显眼清晰边框的内嵌搜索按钮 (与导航栏融为一体) */}
          <button
            type="button"
            onClick={triggerSearch}
            className="flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full border border-[#2D2B2C]/20 bg-black/4 px-2 py-1 text-xs font-medium text-[#2D2B2C] shadow-2xs transition-all hover:border-[#36513B]/50 hover:bg-white dark:border-white/25 dark:bg-white/10 dark:text-[#E2EBE4] dark:hover:border-[#7CD090]/50 dark:hover:bg-[#1E2721] sm:min-h-0 sm:min-w-0 sm:px-3 group"
            title="全局搜索"
            aria-label="全局搜索"
          >
            <Search className="w-3.5 h-3.5 text-[#36513B] dark:text-[#7CD090] group-hover:scale-110 transition-transform flex-shrink-0" />
            <span className="hidden text-[#333031] dark:text-[#E2EBE4] font-semibold transition-colors lg:inline">
              搜索...
            </span>
          </button>

        </div>

      </div>
    </header>
  );
}
