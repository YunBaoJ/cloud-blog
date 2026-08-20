"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { GALLERY_PHOTOS } from "@/data/siteContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FEATURED_ARTWORKS = GALLERY_PHOTOS.slice(0, 4);
const cardStyles = [
  { rotate: "-rotate-3 hover:rotate-0", offset: "lg:translate-y-0" },
  { rotate: "rotate-2 hover:rotate-0", offset: "lg:translate-y-6 sm:translate-y-3" },
  { rotate: "-rotate-2 hover:rotate-0", offset: "lg:-translate-y-2" },
  { rotate: "rotate-3 hover:rotate-0", offset: "lg:translate-y-4 sm:translate-y-3" },
];

interface GalleryTeaserProps {
  totalPhotosCount?: number;
}

export default function GalleryTeaser({ totalPhotosCount }: GalleryTeaserProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".gallery-card-anim", {
      y: 48,
      autoAlpha: 0,
      scale: 0.94,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
      clearProps: "all",
      overwrite: "auto",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 82%",
      },
    });
  }, { scope: containerRef });
  return (
    <section ref={containerRef} className="relative w-full py-20 md:py-28 px-4 bg-transparent border-t border-[#36513B]/16 dark:border-white/16 overflow-hidden">
      {/* Background Pine & Bamboo Accent */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#36513B]/8 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="gallery-card-anim flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <p className="font-mono text-[10px] font-bold tracking-[0.12em] text-[#6F7E70]">02 / VISUAL ARCHIVE</p>
            <h2 className="font-[family-name:var(--section-heading-font)] text-5xl font-semibold leading-[0.9] tracking-[-0.1em] text-[#26352A] dark:text-[#F0F5F1] sm:text-6xl">
              作品<em className="ml-1 font-[family-name:var(--section-heading-font)] not-italic font-medium">画廊</em>
            </h2>
            <p className="text-sm sm:text-base text-[#5A5551] max-w-lg font-normal">
              收录插画、动漫与日常灵感；每一张作品都可以从这里展开。
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8C4A31] hover:text-[#6E3622] transition-colors group"
          >
            <span>浏览全部作品 {totalPhotosCount ? `(${totalPhotosCount}幅)` : ""}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Polaroid Cards Grid (Jitter-free Static Hitbox Architecture) */}
        <div className="grid justify-items-center grid-cols-1 gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7 items-start">
          {FEATURED_ARTWORKS.map((photo, index) => {
            const style = cardStyles[index % cardStyles.length];
            return (
              <Link
                key={photo.id}
                href="/gallery"
                className={`gallery-card-anim group relative block w-full max-w-[320px] ${style.offset} cursor-pointer isolate`}
              >
                {/* Invisible Hitbox Extension */}
                <div className="absolute -inset-4 pointer-events-auto" aria-hidden="true" />

                {/* Inner Polaroid Card (Handles visual tilt, lift and zoom smoothly) */}
                <div className={`relative w-full bg-white p-4.5 rounded-2xl shadow-[0_10px_30px_rgba(45,43,44,0.06)] group-hover:shadow-[0_24px_50px_rgba(45,43,44,0.15)] transition-all duration-500 ease-out transform ${style.rotate} group-hover:rotate-0 group-hover:-translate-y-4 group-hover:scale-[1.03] group-hover:z-20 flex flex-col justify-between`}>
                  {/* Semi-transparent Washi Tape (和纸胶带) */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#F5E8D3]/85 border border-[#E8D7BE]/70 rotate-[-1deg] group-hover:rotate-0 group-hover:scale-105 backdrop-blur-2xs shadow-2xs z-10 pointer-events-none rounded-xs flex items-center justify-center transition-transform duration-300">
                    <span className="w-16 h-px bg-amber-900/10" />
                  </div>

                  {/* Photo Image Container */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF7F2] mb-4 border border-[#2D2B2C]/5">
                    <Image
                      src={photo.src}
                      alt={photo.title}
                      fill
                      priority
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
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
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
