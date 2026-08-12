"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { BookOpen, Gamepad2, ArrowRight, RefreshCw, Copy, Check, Loader2, Sparkles, Quote } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/*
  "醉后不知天在水",
  "满床清梦压星河",
];
*/

const STATIC_DESCRIPTION = "凌晨四点，我看见海棠花未眠。";

// Hitokoto Official Category Map
const HITOKOTO_TYPES: Record<string, string> = {
  a: "动漫经典",
  b: "漫画名句",
  c: "游戏物语",
  d: "文学名著",
  e: "原创灵感",
  f: "网络佳句",
  g: "其他金句",
  h: "哲学思考",
  i: "古风诗词",
  j: "网易云热评",
  k: "人生格言",
  l: "故事沉淀",
};

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [isLoadingHitokoto, setIsLoadingHitokoto] = useState(false);

  const [hitokotoData, setHitokotoData] = useState<{
    hitokoto: string;
    from: string;
    from_who: string | null;
    type: string;
  }>({
    hitokoto: "人们在清醒时说的话，有时比醉鬼的胡闹还要荒谬呢。",
    from: "原神",
    from_who: "温迪",
    type: "c",
  });

  // Fetch Hitokoto (一言) including Anime (a), Game (c), Netspeak (j), Poetry (i), Literature (d), Philosophy (h), Motto (k)
  const fetchHitokoto = async () => {
    setIsLoadingHitokoto(true);
    try {
      const res = await fetch("https://v1.hitokoto.cn/?c=i&c=d&c=h&c=k&c=a&c=c&c=j");
      if (res.ok) {
        const data = await res.json();
        setHitokotoData({
          hitokoto: data.hitokoto,
          from: data.from || "一言",
          from_who: data.from_who || null,
          type: data.type || "i",
        });
      }
    } catch (err) {
      console.error("Hitokoto API fetch failed:", err);
    } finally {
      setIsLoadingHitokoto(false);
    }
  };

  const handleCopyQuote = () => {
    const textToCopy = `“${hitokotoData.hitokoto}” —— ${hitokotoData.from_who ? hitokotoData.from_who + " " : ""}《${hitokotoData.from}》`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".hero-anim-item", {
      y: 35,
      opacity: 0,
      duration: 1.1,
      stagger: 0.15,
      ease: "power2.out",
      clearProps: "all",
    });
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className="relative isolate min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden bg-[var(--background)] px-6 sm:px-12 lg:px-20 pt-32 pb-16 md:pt-36 md:pb-20 transition-colors duration-300">
      {/* 1. Full-Bleed High-Res User Background Wallpaper */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Image
          src="/hero-ai-bg.jpg"
          alt="Cloud的数字小屋 诗意晨曦背景壁纸"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-[center_45%] brightness-[1.03] saturate-[1.05] transition-transform duration-1000 scale-[1.01]"
        />

        {/* Seamless Morning Light Overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(244,240,234,0.92)_0%,rgba(244,240,234,0.70)_50%,rgba(244,240,234,0.25)_100%),linear-gradient(180deg,rgba(244,240,234,0.20)_0%,rgba(244,240,234,0.75)_100%)] dark:bg-[linear-gradient(90deg,rgba(18,22,20,0.92)_0%,rgba(18,22,20,0.72)_50%,rgba(18,22,20,0.30)_100%),linear-gradient(180deg,rgba(18,22,20,0.20)_0%,rgba(18,22,20,0.80)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,rgba(253,252,249,0.55),transparent_45%),radial-gradient(circle_at_78%_22%,rgba(196,106,74,0.12),transparent_30%)] dark:bg-[radial-gradient(circle_at_25%_35%,rgba(26,32,28,0.40),transparent_45%)]" />
      </div>

      {/* Main introduction */}
      <div className="relative z-10 w-full max-w-6xl mx-auto pt-2">
        <div className="max-w-2xl lg:max-w-3xl text-left space-y-7 sm:space-y-8">
          
          {/* Avatar & "云归何处" Persona Capsule Badge */}
          <div className="hero-anim-item inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#FDFCF9]/90 dark:bg-[#1A201C]/90 border border-black/8 dark:border-white/12 backdrop-blur-xl shadow-[0_4px_20px_rgba(44,43,42,0.04)] transition-all duration-300 hover:bg-[#FDFCF9] group">
            <div className="relative flex-shrink-0">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-[#384E3F]/20 dark:ring-white/20 shadow-sm bg-white/20 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/my-avatar.jpg"
                  alt="云归何处 Avatar"
                  fill
                  priority
                  sizes="(max-width: 640px) 36px, 40px"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#384E3F] dark:bg-[#7DA186] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#384E3F] dark:bg-[#7DA186]" />
              </span>
              <span className="text-sm font-semibold tracking-wider text-[#2C2B2A] dark:text-[#EAE6E1]">
                云归何处
              </span>
            </div>
          </div>

          {/* Main Title & Description */}
          <div className="space-y-4 pt-1">
            <h1
              className="hero-anim-item text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#26352A] dark:text-[#F0F5F1] leading-[1.15]"
            >
              醉后不知天在水
            </h1>
            
            <p className="hero-anim-item text-lg sm:text-xl text-[#5A5551] dark:text-[#A09990] leading-relaxed max-w-xl font-normal">
              {STATIC_DESCRIPTION}
            </p>
          </div>

          {/* Action Capsule Buttons */}
          <div className="hero-anim-item flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/notes"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#384E3F] dark:bg-[#7DA186] hover:bg-[#26352A] text-[#FDFCF9] dark:text-[#121614] font-semibold text-sm sm:text-base transition-all duration-200 shadow-[0_12px_28px_-8px_rgba(56,78,63,0.35)] hover:-translate-y-1 active:translate-y-0 group/btn"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#EAE5DC] dark:text-[#121614]" />
              <span>随笔笔记</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </Link>

            <Link
              href="/playground"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#FDFCF9]/90 dark:bg-[#1A201C]/90 hover:bg-white text-[#2C2B2A] dark:text-[#EAE6E1] border border-black/8 dark:border-white/12 backdrop-blur-xl font-semibold text-sm sm:text-base transition-all duration-200 hover:-translate-y-1 active:translate-y-0 shadow-[0_4px_20px_rgba(44,43,42,0.04)] group/btn2"
            >
              <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#C46A4A]" />
              <span>灵感游乐场</span>
            </Link>
          </div>

        </div>
      </div>

      {/* 每日一言 */}
      <div className="relative z-10 w-full max-w-4xl sm:max-w-5xl mx-auto pt-6 pb-2">
        <div className="hero-anim-item relative bg-[#FDFCF9]/92 dark:bg-[#1A201C]/92 hover:bg-[#FDFCF9] backdrop-blur-2xl border border-black/8 dark:border-white/12 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_16px_40px_rgba(44,43,42,0.06)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.3)] transition-all duration-300 group space-y-3.5">
          
          {/* Header Row: Category Badge (Left) + Refresh & Copy Actions (Right) */}
          <div className="flex items-center justify-between gap-4 border-b border-black/6 dark:border-white/8 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#F4F0EA] dark:bg-[#242C27] border border-black/6 dark:border-white/8 flex items-center justify-center text-[#384E3F] dark:text-[#7DA186]">
                <Quote className="w-3.5 h-3.5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F4F0EA] dark:bg-[#242C27] text-[11px] font-bold text-[#C46A4A] dark:text-[#E29878] border border-[#C46A4A]/15 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C46A4A]" />
                <span>{HITOKOTO_TYPES[hitokotoData.type] || "每日一言"}</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={fetchHitokoto}
                disabled={isLoadingHitokoto}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4F0EA] dark:bg-[#242C27] hover:bg-[#EAE5DC] text-[#2C2B2A] dark:text-[#EAE6E1] border border-black/6 dark:border-white/8 text-xs font-semibold transition-all active:scale-95 disabled:opacity-60"
                title="随机抽取一言"
              >
                {isLoadingHitokoto ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C46A4A]" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 text-[#78726A]" />
                )}
                <span>{isLoadingHitokoto ? "换一言..." : "换一言"}</span>
              </button>

              <button
                onClick={handleCopyQuote}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#384E3F] dark:bg-[#7DA186] hover:bg-[#26352A] text-[#FDFCF9] dark:text-[#121614] text-xs font-semibold shadow-xs transition-all active:scale-95"
                title="复制此句"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "已复制" : "复制"}</span>
              </button>
            </div>
          </div>

          {/* Quote Body (Center/Left) */}
          <blockquote className="text-lg sm:text-xl md:text-2xl font-bold text-[#2C2B2A] dark:text-[#EAE6E1] leading-relaxed tracking-wide pt-1">
            “{hitokotoData.hitokoto}”
          </blockquote>

          {/* Citation */}
          <div className="text-right pt-1">
            <cite className="not-italic text-xs sm:text-sm font-mono text-[#78726A] dark:text-[#9E988E] tracking-tight inline-block border-b border-black/6 dark:border-white/8 pb-0.5">
              —— {hitokotoData.from_who ? hitokotoData.from_who + " · " : ""}《{hitokotoData.from}》
            </cite>
          </div>

        </div>
      </div>

      {/* 4. Natural Soft Ambient Fade Transition */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent via-[var(--background)]/60 to-[var(--background)] pointer-events-none z-[2]" />
    </section>
  );
}
