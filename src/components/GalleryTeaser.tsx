"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageIcon, ArrowRight, Calendar } from "lucide-react";
import { GALLERY_PHOTOS } from "@/data/siteContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FEATURED_ARTWORKS = GALLERY_PHOTOS.slice(0, 3);
const rotations = ["-rotate-3", "rotate-2", "-rotate-1"];

export default function GalleryTeaser() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".gallery-card-anim", {
      y: 20,
      opacity: 0,
      scale: 0.98,
      duration: 0.4,
      stagger: 0.06,
      ease: "power2.out",
      clearProps: "all",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
      },
    });
  }, { scope: containerRef });
  return (
    <section ref={containerRef} className="relative w-full py-20 md:py-28 px-4 bg-transparent overflow-hidden">
      {/* Background Pine & Bamboo Accent */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#36513B]/8 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="gallery-card-anim flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF0EA] text-[#8C4A31] text-xs font-semibold tracking-wide shadow-2xs">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>视觉收藏</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2B2C] tracking-tight">
              作品画廊 (Gallery)
            </h2>
            <p className="text-sm sm:text-base text-[#5A5551] max-w-lg font-normal">
              收录插画、动漫与日常灵感；每一张作品都可以从这里展开。
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8C4A31] hover:text-[#6E3622] transition-colors group"
          >
            <span>浏览全部作品</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Polaroid Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {FEATURED_ARTWORKS.map((photo, index) => (
            <Link
              key={photo.id}
              href="/gallery"
              className={`gallery-card-anim group relative bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgba(45,43,44,0.06)] hover:shadow-[0_20px_40px_rgba(45,43,44,0.12)] transition-all duration-500 transform ${rotations[index]} hover:rotate-0 hover:-translate-y-2 flex flex-col justify-between`}
            >
              {/* Semi-transparent Washi Tape (和纸胶带) */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#F5E8D3]/85 border border-[#E8D7BE]/70 rotate-[-1deg] backdrop-blur-2xs shadow-2xs z-10 pointer-events-none rounded-xs flex items-center justify-center">
                <span className="w-16 h-px bg-amber-900/10" />
              </div>

              {/* Photo Image Container */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF7F2] mb-4 border border-[#2D2B2C]/5">
                <Image
                  src={photo.src}
                  alt={photo.title}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md text-[10px] font-medium text-white">
                  {photo.categoryLabel}
                </div>
              </div>

              {/* Label */}
              <div className="space-y-2 px-1">
                <h3 className="text-base font-bold text-[#2D2B2C] group-hover:text-[#8C4A31] transition-colors leading-snug">
                  {photo.title}
                </h3>
                
                <div className="flex items-center justify-between text-xs text-[#7A736A] font-medium">
                  <span>{photo.source}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{photo.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
