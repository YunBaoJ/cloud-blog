"use client";

import Image from "next/image";
import { useState } from "react";
import { BookOpen, Gamepad2, ArrowRight, RefreshCw, Copy, Check, Loader2, Sparkles, Quote } from "lucide-react";
import TextType from "@/components/TextType";

// Upper and Lower parts of the classic poem
const POETIC_TITLES = [
  "醉后不知天在水",
  "满床清梦压星河",
];

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

  return (
    <section className="relative isolate min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden bg-[#121A15] px-6 sm:px-12 lg:px-20 pt-32 pb-16 md:pt-36 md:pb-20">
      {/* 1. Full-Bleed High-Res User Background Wallpaper */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Image
          src="/hero-ai-bg-user.jpg"
          alt="Cloud的数字小屋 诗意夜色背景壁纸"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-[center_45%] brightness-[0.95] saturate-[1.08] transition-transform duration-1000 scale-[1.01]"
        />

        {/* Masterclass Precision Scrim Overlays for Crystal Contrast & Warm Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,26,21,0.85)_0%,rgba(18,26,21,0.50)_45%,rgba(18,26,21,0.08)_78%),linear-gradient(180deg,rgba(18,26,21,0.22)_0%,rgba(18,26,21,0.03)_50%,rgba(18,26,21,0.55)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_40%,rgba(247,248,241,0.16),transparent_36%),radial-gradient(circle_at_70%_25%,rgba(241,167,124,0.18),transparent_35%)]" />
      </div>

      {/* 2. Main Hero Content Pipeline */}
      <div className="relative z-10 w-full max-w-6xl mx-auto pt-2">
        <div className="max-w-2xl lg:max-w-3xl text-left space-y-7 sm:space-y-8">
          
          {/* Avatar & "云归何处" Persona Capsule Badge */}
          <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/16 border border-white/25 backdrop-blur-2xl shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all duration-300 hover:bg-white/22 hover:border-white/35 group">
            <div className="relative flex-shrink-0">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-1.5 ring-white/80 shadow-xs bg-white/20 transition-transform duration-300 group-hover:scale-105">
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
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#86AB89] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#86AB89]" />
              </span>
              <span className="text-sm font-semibold tracking-wider text-[#F7F8F1]">
                云归何处
              </span>
            </div>
          </div>

          {/* Main Typewriter Title & Description */}
          <div className="space-y-4 pt-1">
            <TextType
              as="h1"
              text={POETIC_TITLES}
              typingSpeed={110}
              deletingSpeed={75}
              pauseDuration={3600}
              showCursor={true}
              cursorCharacter="_"
              cursorClassName="font-mono text-[#F1A77C] font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl ml-2 inline-block drop-shadow-[0_0_20px_rgba(241,167,124,0.9)]"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F7F8F1] leading-[1.15] drop-shadow-[0_4px_28px_rgba(0,0,0,0.6)] min-h-[4.5rem] sm:min-h-[5.8rem] flex items-center flex-wrap"
            />
            
            <p className="text-lg sm:text-xl text-[#F7F8F1]/92 leading-relaxed max-w-xl font-normal drop-shadow-md">
              {STATIC_DESCRIPTION}
            </p>
          </div>

          {/* Action Capsule Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="/notes"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#F7F8F1] hover:bg-white text-[#2D2B2C] font-semibold text-sm sm:text-base transition-all duration-200 shadow-[0_12px_32px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-1 active:translate-y-0 group/btn"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#36513B]" />
              <span>随笔笔记</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </a>

            <a
              href="/playground"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-white/16 hover:bg-white/26 text-[#F7F8F1] border border-white/25 backdrop-blur-xl font-semibold text-sm sm:text-base transition-all duration-200 hover:-translate-y-1 active:translate-y-0 shadow-sm group/btn2"
            >
              <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#E0A899]" />
              <span>灵感游乐场</span>
            </a>
          </div>

        </div>
      </div>

      {/* 3. Apple Liquid Acrylic Hitokoto Quote Capsule (规范书写格式：出处置于语录右下方) */}
      <div className="relative z-10 w-full max-w-4xl sm:max-w-5xl mx-auto pt-6 pb-2">
        <div className="relative bg-white/14 hover:bg-white/18 backdrop-blur-2xl border border-white/25 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.32)] transition-all duration-300 group space-y-3.5">
          
          {/* Header Row: Category Badge (Left) + Refresh & Copy Actions (Right) */}
          <div className="flex items-center justify-between gap-4 border-b border-white/12 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 border border-white/25 flex items-center justify-center text-[#F1A77C] shadow-2xs">
                <Quote className="w-3.5 h-3.5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold text-[#F7F8F1] border border-white/20 inline-flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#F1A77C]" />
                <span>{HITOKOTO_TYPES[hitokotoData.type] || "每日一言"}</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={fetchHitokoto}
                disabled={isLoadingHitokoto}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-[#FAF7F2] hover:text-[#2D2B2C] text-[#F7F8F1] border border-white/30 text-xs font-semibold transition-all active:scale-95 disabled:opacity-60 shadow-2xs"
                title="随机抽取一言"
              >
                {isLoadingHitokoto ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#86AB89]" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 text-[#86AB89]" />
                )}
                <span>{isLoadingHitokoto ? "换一言..." : "换一言"}</span>
              </button>

              <button
                onClick={handleCopyQuote}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F7F8F1] hover:bg-white text-[#2D2B2C] text-xs font-semibold shadow-md transition-all active:scale-95"
                title="复制此句"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#36513B]" /> : <Copy className="w-3.5 h-3.5 text-[#36513B]" />}
                <span>{copied ? "已复制" : "复制"}</span>
              </button>
            </div>
          </div>

          {/* Quote Body (Center/Left) */}
          <blockquote className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#F7F8F1] leading-relaxed tracking-wide pt-1 drop-shadow-sm">
            “{hitokotoData.hitokoto}”
          </blockquote>

          {/* Citation (Right Aligned Bottom - 符合标准中文诗词/名言书写格式) */}
          <div className="text-right pt-1">
            <cite className="not-italic text-xs sm:text-sm font-mono text-[#F7F8F1]/90 tracking-tight inline-block border-b border-white/20 pb-0.5 drop-shadow-xs">
              —— {hitokotoData.from_who ? hitokotoData.from_who + " · " : ""}《{hitokotoData.from}》
            </cite>
          </div>

        </div>
      </div>

      {/* 4. Natural Soft Ambient Fade Transition */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent via-[#121A15]/45 to-[#FAF7F2] pointer-events-none z-[2]" />
    </section>
  );
}
