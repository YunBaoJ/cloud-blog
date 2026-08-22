"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { BookOpen, Gamepad2, ArrowRight } from "lucide-react";
import TextType from "@/components/ui/TextType";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const STATIC_DESCRIPTION = "凌晨四点，我看见海棠花未眠。";
const HERO_BG = "/hero/hero-ryo-hd.png";

// Cinema filter preset: CSS filter + rich atmospheric scrim gradient
const CINEMA_IMG_FILTER = "brightness(0.82) contrast(1.05) saturate(0.92)";
const CINEMA_SCRIM = [
  "linear-gradient(90deg,rgba(15,20,18,0.72) 0%,rgba(15,20,18,0.35) 45%,rgba(15,20,18,0.08) 80%)",
  "linear-gradient(180deg,rgba(15,20,18,0.18) 0%,transparent 40%,rgba(15,20,18,0.55) 100%)",
].join(",");

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

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

  return (
    <section 
      ref={heroRef} 
      className="relative isolate min-h-[100dvh] w-full flex flex-col overflow-hidden bg-[#17211B] px-6 sm:px-12 lg:px-20 pt-24 pb-16 md:pb-20 transition-colors duration-300"
      aria-label="首页视觉展示区"
    >
      {/* 1. Full-Bleed High-Res Background Wallpaper with Locked Cinema Filter */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <Image
          src={HERO_BG}
          alt="Kasumi的数字小屋背景壁纸"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-[right_center] transition-all duration-700"
          style={{ filter: CINEMA_IMG_FILTER }}
        />
        {/* Cinema Scrim overlay */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{ background: CINEMA_SCRIM }}
        />
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center py-12 md:py-16">
        <div className="max-w-3xl sm:max-w-4xl text-left space-y-8 sm:space-y-10">
          
          {/* Avatar & Persona Capsule Badge */}
          <div className="hero-anim-item inline-flex items-center gap-3.5 px-4 py-2 mb-10 sm:mb-14 rounded-full bg-white/14 border border-white/25 backdrop-blur-xl shadow-xl transition-all duration-300 hover:bg-white/20 group">
            <div className="relative flex-shrink-0">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/80 shadow-md bg-white/10 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/avatar/my-avatar.jpg"
                  alt="Kasumi 的头像"
                  fill
                  priority
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-sm font-semibold tracking-wider text-[#FAF7F2]">
                Kasumi · 数字小屋
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
              />
            </h1>
            
            <p className="hero-anim-item text-base sm:text-xl text-[#F7F8F1]/85 leading-relaxed max-w-xl font-normal pt-1">
              {STATIC_DESCRIPTION}
            </p>
          </div>

          {/* Action Capsule Buttons */}
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
              <span>掌机游乐场</span>
            </Link>
          </div>

        </div>
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
