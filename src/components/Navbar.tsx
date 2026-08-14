"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Feather, Sparkles, BookOpen, User, ImageIcon, Archive, Clock3, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import AmbientPlayer from "./AmbientPlayer";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const triggerSearch = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true, metaKey: true, bubbles: true })
    );
  };

  return (
    <header className="fixed inset-x-0 top-3 z-50 w-full px-2 pointer-events-none sm:top-5 sm:px-6 lg:px-8">
      {/* Centered Floating Nav Container */}
      <div className="max-w-6xl mx-auto flex items-center justify-center">
        
        {/* Apple Acrylic Liquid Glass Floating Pill Bar */}
        <div className="pointer-events-auto relative inline-flex max-w-[calc(100vw-1rem)] items-center gap-0.5 overflow-x-auto whitespace-nowrap rounded-full p-1 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl saturate-150 transition-all duration-300 [scrollbar-width:none] [&>*]:shrink-0 [&::-webkit-scrollbar]:hidden sm:max-w-[calc(100vw-3rem)] sm:gap-1.5 sm:p-1.5"
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

          {/* 4. 灵感游乐场 */}
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

          {/* 5. 近况 */}
          <Link
            href="/now"
            aria-label="近况"
            className={`flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-medium transition-all sm:min-h-0 sm:min-w-0 sm:px-3 ${
              isActive("/now")
                ? "bg-white text-[#2D2B2C] shadow-2xs font-semibold"
                : "text-[#5A5551] hover:text-[#2D2B2C] hover:bg-white/70"
            }`}
          >
            <Clock3 className="w-3.5 h-3.5 text-[var(--accent-clay)]" />
            <span className="hidden md:inline">近况</span>
          </Link>

          {/* 6. 文章归档 */}
          <Link
            href="/archive"
            aria-label="文章归档"
            className={`flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-medium transition-all sm:min-h-0 sm:min-w-0 sm:px-3 ${
              isActive("/archive")
                ? "bg-white text-[#2D2B2C] shadow-2xs font-semibold"
                : "text-[#5A5551] hover:text-[#2D2B2C] hover:bg-white/70"
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-[#2B4C6F]" />
            <span className="hidden lg:inline">归档</span>
          </Link>

          {/* 7. 关于小屋 */}
          <Link
            href="/about"
            aria-label="关于小屋"
            className={`flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-medium transition-all sm:min-h-0 sm:min-w-0 sm:px-3 ${
              isActive("/about")
                ? "bg-white text-[#2D2B2C] shadow-2xs font-semibold"
                : "text-[#5A5551] hover:text-[#2D2B2C] hover:bg-white/70"
            }`}
          >
            <User className="w-3.5 h-3.5 text-[#544F49]" />
            <span className="hidden md:inline">关于</span>
          </Link>

          {/* 软分隔线 */}
          <div className="h-4 w-px bg-[#2D2B2C]/10 dark:bg-[#EDE9E4]/10 mx-0.5" />

          {/* Ambient Player (白噪音播放器) */}
          <AmbientPlayer />

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
