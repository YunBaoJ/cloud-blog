import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Home, BookOpen, Camera } from "lucide-react";

export const metadata: Metadata = {
  title: "404 - 页面不存在",
  description: "你访问的页面不存在或已被移动。",
};

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] bg-transparent text-[var(--foreground)] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-lg w-full text-center space-y-10">

          {/* Large 404 display */}
          <div className="space-y-3">
            <p className="text-[120px] sm:text-[160px] font-extrabold leading-none text-[var(--foreground)]/10 select-none tracking-tighter">
              404
            </p>
            <div className="-mt-8 space-y-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
                这里什么都没有
              </h1>
              <p className="text-base text-[var(--muted)] leading-relaxed max-w-sm mx-auto">
                你访问的页面可能已被移动、删除，或者从未存在过。就像一张曝光过度的胶片，什么也留不下。
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[var(--border-line-color)]" />
            <span className="text-xs font-mono text-[var(--muted)]">迷路了？试试这里</span>
            <div className="flex-1 h-px bg-[var(--border-line-color)]" />
          </div>

          {/* Quick nav links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/"
              className="group flex flex-col items-center gap-2 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border-line-color)] hover:border-[color:var(--accent-green)]/40 hover:shadow-[0_8px_24px_rgba(54,81,59,0.10)] transition-all"
            >
              <Home className="w-5 h-5 text-[var(--accent-green)] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-[var(--foreground)]">回到首页</span>
            </Link>

            <Link
              href="/notes"
              className="group flex flex-col items-center gap-2 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border-line-color)] hover:border-[color:var(--accent-green)]/40 hover:shadow-[0_8px_24px_rgba(54,81,59,0.10)] transition-all"
            >
              <BookOpen className="w-5 h-5 text-[var(--accent-green)] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-[var(--foreground)]">随笔笔记</span>
            </Link>

            <Link
              href="/gallery"
              className="group flex flex-col items-center gap-2 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border-line-color)] hover:border-[color:var(--accent-clay)]/40 hover:shadow-[0_8px_24px_rgba(140,74,49,0.10)] transition-all"
            >
              <Camera className="w-5 h-5 text-[var(--accent-clay)] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-[var(--foreground)]">作品画廊</span>
            </Link>
          </div>

          {/* Back button */}
          <BackButton />

        </div>
      </div>

      <Footer />
    </main>
  );
}
