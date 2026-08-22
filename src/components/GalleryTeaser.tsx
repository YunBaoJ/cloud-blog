"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { GALLERY_PHOTOS } from "@/data/siteContent";

const FEATURED_ARTWORKS = GALLERY_PHOTOS.slice(0, 4);
const cardStyles = [
  { rotate: "-rotate-2 hover:rotate-0", offset: "translate-y-0" },
  { rotate: "rotate-2 hover:rotate-0", offset: "translate-y-0 sm:translate-y-2" },
  { rotate: "-rotate-1 hover:rotate-0", offset: "translate-y-0" },
  { rotate: "rotate-2 hover:rotate-0", offset: "translate-y-0 sm:translate-y-2" },
];

export default function GalleryTeaser() {
  return (
    <section data-home-scroll-section className="relative min-h-[100dvh] w-full overflow-hidden border-t border-[#36513B]/16 bg-transparent px-4 py-20 dark:border-white/16 sm:px-6 md:py-28 lg:px-8">
      {/* Background Pine & Bamboo Accent */}
      <div data-home-scroll-ambient className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#36513B]/8 blur-3xl rounded-full pointer-events-none" />

      <div data-home-scroll-content className="relative z-10 mx-auto max-w-[1180px] space-y-8 sm:space-y-10">
        {/* Header */}
        <div className="gallery-card-anim flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-3">
            <h2 className="font-[family-name:var(--section-heading-font)] text-5xl font-semibold leading-[0.9] tracking-[-0.1em] text-[#26352A] dark:text-[#F0F5F1] sm:text-6xl">
              作品<em className="ml-1 font-[family-name:var(--section-heading-font)] not-italic font-medium">画廊</em>
            </h2>
            <p className="text-sm sm:text-base text-[#5A5551] dark:text-[#9EB3A4] max-w-lg font-normal">
              收录插画、动漫与日常灵感；每一张作品都可以从这里展开。
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#36513B] dark:text-[#7CD090] hover:text-[#283E2C] dark:hover:text-white transition-colors group self-start sm:self-end"
          >
            <span>完整画廊</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Polaroid Cards Grid (Jitter-free Static Hitbox Architecture) */}
        <div className="relative left-1/2 grid w-full -translate-x-1/2 grid-cols-1 items-start justify-items-center gap-6 pt-20 sm:grid-cols-2 lg:w-[min(1300px,calc(100vw-3rem))] lg:grid-cols-4 lg:gap-7">
          {FEATURED_ARTWORKS.map((photo, index) => {
            const style = cardStyles[index % cardStyles.length];
            return (
              <Link
                key={photo.id}
                href="/gallery"
                className={`gallery-card-anim group relative block w-full max-w-[340px] ${style.offset} cursor-pointer isolate lg:max-w-none`}
              >
                {/* Invisible Hitbox Extension */}
                <div className="absolute -inset-4 pointer-events-auto" aria-hidden="true" />

                {/* Inner Polaroid Card */}
                <div className={`relative flex w-full flex-col justify-between rounded-3xl border border-[#2D2B2C]/5 bg-white p-4 shadow-[0_10px_28px_rgba(45,43,44,0.08)] transition-all duration-500 ease-out transform dark:border-white/10 dark:bg-[#1C2A20] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)] ${style.rotate} group-hover:z-20 group-hover:-translate-y-3 group-hover:rotate-0 group-hover:scale-[1.02] group-hover:shadow-[0_22px_42px_rgba(45,43,44,0.16)]`}>
                  {/* Semi-transparent Washi Tape (和纸胶带) */}
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#F5E8D3]/85 dark:bg-[#2F4436]/90 border border-[#E8D7BE]/70 dark:border-white/15 rotate-[-1deg] group-hover:rotate-0 group-hover:scale-105 backdrop-blur-2xs shadow-2xs z-10 pointer-events-none rounded-xs flex items-center justify-center transition-transform duration-300">
                    <span className="w-12 h-px bg-amber-900/10 dark:bg-white/20" />
                  </div>

                  {/* Photo Image Container */}
                  <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl border border-[#2D2B2C]/5 bg-[#FAF7F2] dark:border-white/10 dark:bg-[#121B15]">
                    <Image
                      src={photo.src}
                      alt={photo.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-[9px] font-medium text-white">
                      {photo.categoryLabel}
                    </div>
                  </div>

                  {/* Label */}
                  <div className="space-y-2 px-0.5">
                    <h3 className="line-clamp-2 text-base font-bold leading-snug text-[#2D2B2C] transition-colors group-hover:text-[#36513B] dark:text-[#F0F5F1] dark:group-hover:text-[#7CD090]">
                      {photo.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs font-medium text-[#7A736A] dark:text-[#9EB3A4]">
                      <span>{photo.source}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
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
