"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { PenLine, Camera, Mail } from "lucide-react";
import TextType from "@/components/ui/TextType";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z" />
    </svg>
  );
}

function BilibiliIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m8 4.5 2.5 2.5M16 4.5 13.5 7" />
      <rect x="3" y="7" width="18" height="13.5" rx="3.5" />
      <circle cx="8.5" cy="13" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="13" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

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
          <div className="hero-anim-item flex flex-wrap items-center gap-3 pt-2">
            {/* 1. 随笔 */}
            <Link
              href="/notes"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#FAF7F2] hover:bg-white text-[#26352A] font-semibold text-xs sm:text-sm transition-all duration-300 shadow-[0_18px_42px_-24px_rgba(0,0,0,0.7)] hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-18px_rgba(0,0,0,0.8)] active:translate-y-0"
            >
              <PenLine className="w-4 h-4 text-[#26352A]" />
              <span>随笔</span>
            </Link>

            {/* 2. 相册 */}
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white/12 hover:bg-white/20 text-[#FAF7F2]/90 hover:text-white border border-white/24 hover:border-white/40 backdrop-blur-xl font-medium text-xs sm:text-sm transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
            >
              <Camera className="w-4 h-4" />
              <span>相册</span>
            </Link>

            {/* 3. 社交外链胶囊 (GitHub, Bilibili, QQ 邮箱) */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-white/12 border border-white/24 backdrop-blur-xl shadow-sm transition-all duration-300 hover:bg-white/20 hover:border-white/40">
              <a
                href="https://github.com/YunBaoJ/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full p-1.5 text-[#FAF7F2]/80 hover:text-white hover:bg-white/14 hover:scale-110 transition-all duration-200"
                aria-label="GitHub 主页"
                title="GitHub: YunBaoJ"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://space.bilibili.com/110698935"
                target="_blank"
                rel="noreferrer"
                className="rounded-full p-1.5 text-[#FAF7F2]/80 hover:text-white hover:bg-white/14 hover:scale-110 transition-all duration-200"
                aria-label="哔哩哔哩个人空间"
                title="哔哩哔哩: Kasumi8"
              >
                <BilibiliIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:2445686870@qq.com"
                className="rounded-full p-1.5 text-[#FAF7F2]/80 hover:text-white hover:bg-white/14 hover:scale-110 transition-all duration-200"
                aria-label="QQ 邮箱"
                title="QQ 邮箱: 2445686870@qq.com"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
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
