"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, Feather, Sparkles, BookOpen, User, Camera, Archive, MessageSquare, Search } from "lucide-react";
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
    <header className="fixed top-5 inset-x-0 z-50 w-full pointer-events-none px-4 sm:px-6 lg:px-8">
      {/* Centered Floating Nav Container */}
      <div className="max-w-6xl mx-auto flex items-center justify-center">
        
        {/* Apple Acrylic Liquid Glass Floating Pill Bar */}
        <div className="pointer-events-auto relative inline-flex items-center gap-1 sm:gap-1.5 rounded-full p-1.5 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl saturate-150"
          style={{
            background: "var(--nav-bg)",
            border: "1px solid var(--nav-border)",
            boxShadow: "0 10px 32px -4px rgba(0,0,0,0.10), inset 0 1px 1px 0 rgba(255,255,255,0.55)",
          }}
        >
          
          {/* 1. 小屋主页 */}
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all group/home ${
              isActive("/")
                ? "bg-white text-[#2D2B2C] shadow-2xs"
                : "text-[#5A5551] hover:text-[#2D2B2C] hover:bg-white/70"
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-[#E2EBE4] border border-[#D2DFD5] flex items-center justify-center text-[#36513B] group-hover/home:rotate-12 transition-transform">
              <Feather className="w-3 h-3" />
            </div>
            <span className="tracking-tight font-bold">小屋主页</span>
          </Link>

          {/* 2. 随笔笔记 */}
          <Link
            href="/notes"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isActive("/notes")
                ? "bg-white text-[#2D2B2C] shadow-2xs font-semibold"
                : "text-[#5A5551] hover:text-[#2D2B2C] hover:bg-white/70"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#4E7A56]" />
            <span className="hidden sm:inline">随笔笔记</span>
            <span className="sm:hidden">笔记</span>
          </Link>

          {/* 3. 摄影画廊 */}
          <Link
            href="/gallery"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isActive("/gallery")
                ? "bg-white text-[#2D2B2C] shadow-2xs font-semibold"
                : "text-[#5A5551] hover:text-[#2D2B2C] hover:bg-white/70"
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-[#8C4A31]" />
            <span className="hidden md:inline">摄影画廊</span>
          </Link>

          {/* 4. 灵感游乐场 */}
          <Link
            href="/playground"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isActive("/playground")
                ? "bg-white text-[#2D2B2C] shadow-2xs font-semibold"
                : "text-[#5A5551] hover:text-[#2D2B2C] hover:bg-white/70"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C46A4A]" />
            <span className="hidden sm:inline">游乐场</span>
          </Link>

          {/* 5. 留言板 (新增) */}
          <Link
            href="/guestbook"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isActive("/guestbook")
                ? "bg-white text-[#2D2B2C] shadow-2xs font-semibold"
                : "text-[#5A5551] hover:text-[#2D2B2C] hover:bg-white/70"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#8C4A31]" />
            <span className="hidden md:inline">留言板</span>
          </Link>

          {/* 6. 文章归档 */}
          <Link
            href="/archive"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
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
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[#2D2B2C] dark:text-[#E2EBE4] bg-black/4 dark:bg-white/10 border border-[#2D2B2C]/20 dark:border-white/25 hover:border-[#36513B]/50 dark:hover:border-[#7CD090]/50 hover:bg-white dark:hover:bg-[#1E2721] transition-all shadow-2xs group"
            title="全局搜索"
            aria-label="全局搜索"
          >
            <Search className="w-3.5 h-3.5 text-[#36513B] dark:text-[#7CD090] group-hover:scale-110 transition-transform flex-shrink-0" />
            <span className="text-[#333031] dark:text-[#E2EBE4] font-semibold transition-colors">
              搜索...
            </span>
          </button>

        </div>

      </div>
    </header>
  );
}
