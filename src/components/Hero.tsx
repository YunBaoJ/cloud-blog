"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { BookOpen, Gamepad2, ArrowRight, RefreshCw, Copy, Check, Loader2, Sparkles, Quote } from "lucide-react";
import TextType from "@/components/ui/TextType";
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
    <section ref={heroRef} className="relative isolate min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden bg-[#17211B] px-6 sm:px-12 lg:px-20 pt-32 pb-16 md:pt-36 md:pb-20 transition-colors duration-300">
      {/* 1. Full-Bleed High-Res SpringBlog Official Background Wallpaper */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <Image
          src="/bg-image.png"
          alt="SpringBlog 官方月色与花枝背景壁纸"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-[62%_center] brightness-[0.82] saturate-[1.14] dark:brightness-[0.7] transition-transform duration-1000 scale-[1.01]"
        />

        {/* 2. Official SpringBlog Dual-Stage Scrim Filter Overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,33,27,0.82)_0%,rgba(23,33,27,0.46)_42%,rgba(23,33,27,0.12)_74%),linear-gradient(180deg,rgba(23,33,27,0.24)_0%,rgba(23,33,27,0.08)_50%,rgba(23,33,27,0.62)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_42%,rgba(247,248,241,0.2),transparent_34%),radial-gradient(circle_at_68%_28%,rgba(217,134,95,0.22),transparent_32%)] dark:bg-[radial-gradient(circle_at_20%_42%,rgba(241,244,234,0.13),transparent_34%),radial-gradient(circle_at_68%_28%,rgba(241,167,124,0.18),transparent_32%)]" />
      </div>

      {/* Main introduction */}
      <div className="relative z-10 w-full max-w-6xl mx-auto pt-2">
        <div className="max-w-2xl lg:max-w-3xl text-left space-y-7 sm:space-y-8">
          
          {/* Avatar & "云归何处" Persona Capsule Badge */}
          <div className="hero-anim-item inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/16 border border-white/25 backdrop-blur-xl shadow-lg transition-all duration-300 hover:bg-white/22 group">
            <div className="relative flex-shrink-0">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-white/80 shadow-md bg-white/10 transition-transform duration-300 group-hover:scale-105">
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
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9DB289] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9DB289]" />
              </span>
              <span className="text-sm font-semibold tracking-wider text-[#FAF7F2]">
                云归何处
              </span>
            </div>
          </div>

          {/* Main Title & Description */}
          <div className="space-y-4 pt-1">
            <h1
              className="hero-anim-item text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F7F8F1] leading-[1.15] drop-shadow-[0_18px_48px_rgba(0,0,0,0.35)]"
            >
              <TextType
                text={["此间主人", "Kasumi", "醉后不知天在水", "满床清梦压星河"]}
                typingSpeed={90}
                deletingSpeed={50}
                pauseDuration={2500}
                showCursor={true}
                cursorCharacter="_"
                cursorClassName="text-[#D79B7B] ml-1 font-bold"
                as="span"
              />
            </h1>
            
            <p className="hero-anim-item text-lg sm:text-xl text-[#F7F8F1]/82 leading-relaxed max-w-xl font-normal">
              {STATIC_DESCRIPTION}
            </p>
          </div>

          {/* Action Capsule Buttons */}
          <div className="hero-anim-item flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/notes"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#FAF7F2] hover:bg-white text-[#26352A] font-semibold text-sm sm:text-base transition-all duration-200 shadow-[0_12px_32px_-10px_rgba(0,0,0,0.35)] hover:-translate-y-1 active:translate-y-0 group/btn"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#506A50]" />
              <span>随笔笔记</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </Link>

            <Link
              href="/playground"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-white/16 hover:bg-white/25 text-[#FAF7F2] border border-white/35 backdrop-blur-xl font-semibold text-sm sm:text-base transition-all duration-200 hover:-translate-y-1 active:translate-y-0 shadow-lg group/btn2"
            >
              <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#D79B7B]" />
              <span>灵感游乐场</span>
            </Link>
          </div>

        </div>
      </div>

      {/* 每日一言 */}
      <div className="relative z-10 w-full max-w-4xl sm:max-w-5xl mx-auto pt-6 pb-2">
        <div className="hero-anim-item relative bg-white/14 hover:bg-white/18 backdrop-blur-2xl border border-white/25 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.20)] transition-all duration-300 group space-y-3.5">
          
          {/* Header Row: Category Badge (Left) + Refresh & Copy Actions (Right) */}
          <div className="flex items-center justify-between gap-4 border-b border-white/20 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center text-[#DCE7D8]">
                <Quote className="w-3.5 h-3.5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-bold text-[#FAF7F2] border border-white/20 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#D79B7B]" />
                <span>{HITOKOTO_TYPES[hitokotoData.type] || "每日一言"}</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={fetchHitokoto}
                disabled={isLoadingHitokoto}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-[#FAF7F2] border border-white/25 text-xs font-semibold transition-all active:scale-95 disabled:opacity-60"
                title="随机抽取一言"
              >
                {isLoadingHitokoto ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#DCE7D8]" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 text-[#DCE7D8]" />
                )}
                <span>{isLoadingHitokoto ? "换一言..." : "换一言"}</span>
              </button>

              <button
                onClick={handleCopyQuote}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-white text-[#26352A] text-xs font-semibold shadow-md transition-all active:scale-95"
                title="复制此句"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "已复制" : "复制"}</span>
              </button>
            </div>
          </div>

          {/* Quote Body (Center/Left) */}
          <blockquote className="text-lg sm:text-xl md:text-2xl font-bold text-[#FAF7F2] leading-relaxed tracking-wide pt-1">
            “{hitokotoData.hitokoto}”
          </blockquote>

          {/* Citation */}
          <div className="text-right pt-1">
            <cite className="not-italic text-xs sm:text-sm font-mono text-[#FAF7F2]/75 tracking-tight inline-block border-b border-white/20 pb-0.5">
              —— {hitokotoData.from_who ? hitokotoData.from_who + " · " : ""}《{hitokotoData.from}》
            </cite>
          </div>

        </div>
      </div>

      {/* 4. Official SpringBlog Parallax Wave Divider */}
      <div className="home-hero-wave pointer-events-none absolute inset-x-0 bottom-0 z-[3]" aria-hidden="true">
        <svg
          className="waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="home-gentle-wave"
              d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z"
            />
          </defs>
          <g className="wave-parallax">
            <use href="#home-gentle-wave" x="48" y="0" className="wave-layer wave-layer-1" />
            <use href="#home-gentle-wave" x="48" y="3" className="wave-layer wave-layer-2" />
            <use href="#home-gentle-wave" x="48" y="5" className="wave-layer wave-layer-3" />
            <use href="#home-gentle-wave" x="48" y="7" className="wave-layer wave-layer-4" />
          </g>
        </svg>
      </div>
    </section>
  );
}
