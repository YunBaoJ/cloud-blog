"use client";

import { useState } from "react";
import Link from "next/link";
import { Feather, Heart, Mail, Globe, ArrowUp } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/site";

const INSPIRATIONS = [
  { text: "代码是写给未来的自己与同行的情书，愿它干净、清澈、余音绕梁。", author: "Cloud · 代码探索" },
  { text: "胶片最迷人的地方，在于它不可逆的静止与对时间无声的敬畏。", author: "Cloud · 胶片观察" },
  { text: "翻开书页的呼吸，与键盘落下的声音，都是静心生活的深沉节奏。", author: "Cloud · 晨间仪式" },
  { text: "完美的视觉不是元素的堆砌，而是把多余的噪音删减到无法再减。", author: "Design Taste" },
  { text: "保持好奇，保持对细节无理取的苛求，这是手艺人最浪漫的坚持。", author: "Wabi-Sabi Craft" },
];

export default function Footer() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [shuffling, setShuffling] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextQuote = () => {
    setShuffling(true);
    setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % INSPIRATIONS.length);
      setShuffling(false);
    }, 150);
  };

  const handleCopyQuote = () => {
    const current = INSPIRATIONS[quoteIndex];
    navigator.clipboard.writeText(`"${current.text}" — ${current.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentQuote = INSPIRATIONS[quoteIndex];

  return (
    <footer className="w-full bg-[#FAF7F2] dark:bg-[#141C16] text-[#5A5551] dark:text-[#9EB3A4] pt-16 pb-12 border-t border-[#2D2B2C]/8 dark:border-white/10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Replacement: Daily Inspiration & Wisdom Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#E2EBE4]/60 dark:bg-[#1E2721]/80 border border-[#36513B]/15 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#36513B]/10 dark:bg-[#7CD090]/15 text-[#36513B] dark:text-[#7CD090] text-xs font-bold tracking-wider">
              <span>灵光一闪 · 每日一言</span>
            </div>

            <div className={`transition-opacity duration-200 ${shuffling ? "opacity-0" : "opacity-100"}`}>
              <p className="text-base sm:text-lg font-medium text-[#2D2B2C] dark:text-[#F0F5F1] italic leading-relaxed">
                “{currentQuote.text}”
              </p>
              <p className="text-xs font-mono text-[#7A736A] dark:text-[#9EB3A4] mt-1">
                — {currentQuote.author}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-shrink-0">
            <button
              type="button"
              onClick={handleNextQuote}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#2A382E] border border-[#2D2B2C]/10 dark:border-white/10 text-[#2D2B2C] dark:text-[#F0F5F1] text-xs font-bold hover:bg-[#36513B] hover:text-white dark:hover:bg-[#7CD090] dark:hover:text-[#141C16] transition-all shadow-2xs active:scale-95 group"
            >
              <Feather className={`w-3.5 h-3.5 group-hover:rotate-45 transition-transform ${shuffling ? "animate-spin" : ""}`} />
              <span>换一换</span>
            </button>

            <button
              type="button"
              onClick={handleCopyQuote}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#36513B] dark:bg-[#7CD090] text-white dark:text-[#141C16] text-xs font-bold hover:bg-[#2A402E] transition-all shadow-2xs active:scale-95"
            >
              {copied ? (
                <span>已复制句子!</span>
              ) : (
                <span>复制此句</span>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-[#2D2B2C]/8">
          {/* Brand Info */}
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#E2EBE4] border border-[#D2DFD5] flex items-center justify-center text-[#36513B]">
                <Feather className="w-3.5 h-3.5" />
              </div>
              <span className="text-base font-bold text-[#2D2B2C] tracking-tight">
                Cloud 的数字小屋
              </span>
            </div>
            <p className="text-xs text-[#7A736A] max-w-sm leading-relaxed">
              这里记录写给机器的代码，也记录留给生活的诗意与摄影。感谢你的每一次停留。
            </p>
          </div>

          {/* Nav Links & Actions */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-[#5A5551]">
            <Link href="/notes" className="hover:text-[#36513B] transition-colors">
              随笔笔记
            </Link>
            <Link href="/gallery" className="hover:text-[#36513B] transition-colors">
              作品画廊
            </Link>
            <Link href="/playground" className="hover:text-[#36513B] transition-colors">
              灵感游乐场
            </Link>
            <Link href="/about" className="hover:text-[#36513B] transition-colors">
              关于小屋
            </Link>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#2D2B2C]/10 text-[#2D2B2C] hover:bg-[#36513B] hover:text-white transition-all shadow-2xs hover:scale-105 active:scale-95"
            >
              <span>回到顶部</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Social & Copyright */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A736A]">
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="p-2.5 rounded-full bg-white border border-[#2D2B2C]/8 hover:text-[#36513B] hover:border-[#36513B]/30 hover:scale-110 transition-all"
              aria-label={`发送邮件至 ${CONTACT_EMAIL}`}
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-white border border-[#2D2B2C]/8 hover:text-[#36513B] hover:border-[#36513B]/30 hover:scale-110 transition-all"
              aria-label="Code Repository"
            >
              <Globe className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} Cloud. Handcrafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#C46A4A] fill-[#C46A4A]/20 mx-0.5 animate-pulse" />
            <span>&amp; Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
