"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { BookOpen, Gamepad2, ArrowRight, ArrowDown, Feather, Sparkles, Image as ImageIcon, Check } from "lucide-react";
import TextType from "@/components/ui/TextType";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const STATIC_DESCRIPTION = "凌晨四点，我看见海棠花未眠。";

// Available wallpapers for testing
const WALLPAPERS = [
  { id: "user-final", name: "最新下载壁纸", src: "/hero-user-final.png" },
  { id: "custom-2", name: "原版山田葵(人物右移无遮挡)", src: "/hero-custom-bg-2.jpg" },
  { id: "ryo-exact", name: "山田葵 1:1精准重绘版", src: "/hero-ryo-exact.jpg" },
  { id: "classic", name: "月色花枝", src: "/bg-image.png" },
];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [currentBg, setCurrentBg] = useState<string>("/hero-user-final.png");
  const [showPicker, setShowPicker] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("sora_hero_bg");
    if (saved) setCurrentBg(saved);
  }, []);

  const handleSelectBg = (src: string) => {
    setCurrentBg(src);
    localStorage.setItem("sora_hero_bg", src);
  };

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".hero-anim-item", {
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.18,
      ease: "power3.out",
      clearProps: "all",
    });
  }, { scope: heroRef });

  const getObjectPosition = (src: string) => {
    if (src.includes("hero-user-final")) {
      return "object-[center_center]";
    }
    if (src.includes("hero-custom-bg-2")) {
      return "object-[right_center]";
    }
    if (src.includes("hero-ryo-exact")) {
      return "object-[right_center]";
    }
    if (src.includes("bg-image")) {
      return "object-[62%_center]";
    }
    return "object-[center_center]";
  };

  return (
    <section ref={heroRef} className="relative isolate min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden bg-[#17211B] px-6 sm:px-12 lg:px-20 pt-28 pb-16 md:pt-32 md:pb-20 transition-colors duration-300">
      {/* 1. Full-Bleed High-Res User Background Wallpaper */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <Image
          key={currentBg}
          src={currentBg}
          alt="Sora的数字客房背景壁纸"
          fill
          priority
          unoptimized
          sizes="100vw"
          className={`object-cover ${getObjectPosition(currentBg)} brightness-[0.85] saturate-[1.12] dark:brightness-[0.7] transition-all duration-700 scale-[1.01]`}
        />

        {/* 2. Official SpringBlog Dual-Stage Scrim Filter Overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,33,27,0.84)_0%,rgba(23,33,27,0.50)_45%,rgba(23,33,27,0.15)_80%),linear-gradient(180deg,rgba(23,33,27,0.25)_0%,rgba(23,33,27,0.10)_50%,rgba(23,33,27,0.70)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_42%,rgba(247,248,241,0.22),transparent_36%),radial-gradient(circle_at_68%_28%,rgba(217,134,95,0.22),transparent_32%)] dark:bg-[radial-gradient(circle_at_20%_42%,rgba(241,244,234,0.13),transparent_34%),radial-gradient(circle_at_68%_28%,rgba(241,167,124,0.18),transparent_32%)]" />
      </div>

      {/* [TEMPORARY FEATURE] Self-Service Background Wallpaper Switcher (Easy to remove anytime) */}
      <div className="absolute top-28 right-6 sm:right-12 z-30">
        <div className="relative">
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-white/90 shadow-lg transition-all duration-200 cursor-pointer"
            title="自主选择壁纸"
          >
            <ImageIcon className="w-4 h-4 text-[#D79B7B]" />
            <span>选择背景</span>
          </button>

          {showPicker && (
            <div className="absolute right-0 mt-2.5 w-56 p-3 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/20 shadow-2xl space-y-2 text-white z-50">
              <div className="text-[11px] font-bold text-white/60 px-1 pb-1 border-b border-white/10 flex items-center justify-between">
                <span>壁纸选集 (默认不自动换)</span>
                <button onClick={() => setShowPicker(false)} className="text-white/40 hover:text-white">✕</button>
              </div>
              <div className="space-y-1.5 pt-1">
                {WALLPAPERS.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => handleSelectBg(wp.src)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                      currentBg === wp.src
                        ? "bg-white/25 text-white font-bold ring-1 ring-white/40"
                        : "hover:bg-white/10 text-white/80"
                    }`}
                  >
                    <span>{wp.name}</span>
                    {currentBg === wp.src && <Check className="w-3.5 h-3.5 text-[#9DB289]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center py-12 md:py-16">
        <div className="max-w-3xl sm:max-w-4xl text-left space-y-8 sm:space-y-10">
          
          {/* Avatar & Persona Capsule Badge */}
          <div className="hero-anim-item inline-flex items-center gap-3.5 px-4 py-2 mb-10 sm:mb-14 rounded-full bg-white/14 border border-white/25 backdrop-blur-xl shadow-xl transition-all duration-300 hover:bg-white/20 group">
            <div className="relative flex-shrink-0">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/80 shadow-md bg-white/10 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/my-avatar.jpg"
                  alt="Sora Avatar"
                  fill
                  priority
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9DB289] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#9DB289]" />
              </span>
              <span className="text-sm font-semibold tracking-wider text-[#FAF7F2]">
                Sora · 数字客房
              </span>
            </div>
          </div>

          {/* Hero Title with Typing Animation */}
          <div className="space-y-4">
            <h1
              className="hero-anim-item text-4xl sm:text-6xl md:text-7xl lg:text-[4.75rem] font-extrabold tracking-tight text-[#F7F8F1] leading-[1.09] drop-shadow-[0_15px_38px_rgba(0,0,0,0.36)]"
            >
              <TextType
                text={["此间主人", "Kasumi", "醉后不知天在水", "满床清梦压星河"]}
                typingSpeed={90}
                deletingSpeed={50}
                pauseDuration={2500}
                showCursor={true}
                cursorCharacter="_"
                cursorClassName="text-[#D79B7B] ml-1.5 font-bold"
                as="span"
              />
            </h1>
            
            <p className="hero-anim-item text-base sm:text-xl text-[#F7F8F1]/85 leading-relaxed max-w-xl font-normal pt-1">
              {STATIC_DESCRIPTION}
            </p>
          </div>

          {/* Action Capsule Buttons (Shrunk to refined size) */}
          <div className="hero-anim-item flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              href="/notes"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#FAF7F2] hover:bg-white text-[#26352A] font-semibold text-xs sm:text-sm transition-all duration-200 shadow-[0_10px_28px_-10px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 active:translate-y-0 group/btn"
            >
              <BookOpen className="w-4 h-4 text-[#506A50]" />
              <span>随笔笔记</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </Link>

            <Link
              href="/playground"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white/16 hover:bg-white/25 text-[#FAF7F2] border border-white/35 backdrop-blur-xl font-semibold text-xs sm:text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-md group/btn2"
            >
              <Gamepad2 className="w-4 h-4 text-[#D79B7B]" />
              <span>灵感游乐场</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom Status Dock & Scroll Navigation */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between pt-6 pb-4">
        <div className="hero-anim-item hidden sm:flex items-center gap-3 px-4.5 py-2.5 rounded-full border border-white/20 bg-white/14 backdrop-blur-xl shadow-lg text-xs font-medium text-[#FAF7F2]/90">
          <Feather className="w-4 h-4 text-[#D79B7B]" />
          <span>随笔文字与思考</span>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <Sparkles className="w-3.5 h-3.5 text-[#9DB289]" />
          <span>胶片与记录切片</span>
        </div>

        <a
          href="#latest-sections"
          className="hero-anim-item ml-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/14 hover:bg-white/22 backdrop-blur-xl text-xs font-semibold text-[#FAF7F2] transition-all duration-300 shadow-md group"
        >
          <span>探索下方</span>
          <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
        </a>
      </div>

      {/* 4. Official SpringBlog Parallax Wave Divider */}
      <div className="home-hero-wave pointer-events-none absolute inset-x-0 -bottom-[1px] z-[3]" aria-hidden="true">
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
            <use href="#home-gentle-wave" x="48" y="1.5" className="wave-layer wave-layer-2" />
            <use href="#home-gentle-wave" x="48" y="3" className="wave-layer wave-layer-3" />
            <use href="#home-gentle-wave" x="48" y="4.5" className="wave-layer wave-layer-4" />
          </g>
        </svg>
      </div>
    </section>
  );
}
