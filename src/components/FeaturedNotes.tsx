"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Calendar,
  Camera,
  Code2,
  Clock,
  Sparkles,
} from "lucide-react";
import type { NoteItem } from "@/lib/notes";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface FeaturedNotesProps {
  initialNotes: NoteItem[];
}

const NOTE_ROTATIONS = ["rotate-[2deg]", "-rotate-[2deg]", "rotate-[1.5deg]"];

function getCategoryIcon(iconName: string) {
  const className = "size-3.5";
  switch (iconName) {
    case "Code2":
      return <Code2 className={`${className} text-[#36513B] dark:text-[#7CD090]`} />;
    case "Camera":
      return <Camera className={`${className} text-[#8C4A31] dark:text-[#E5987D]`} />;
    default:
      return <Sparkles className={`${className} text-[#2B4C6F] dark:text-[#8EB8E5]`} />;
  }
}

export default function FeaturedNotes({ initialNotes }: FeaturedNotesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const notes = initialNotes.slice(0, 3);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".journal-card-anim", {
        y: 20,
        opacity: 0,
        scale: 0.98,
        duration: 0.5,
        stagger: 0.06,
        ease: "power2.out",
        clearProps: "all",
      });
    },
    { scope: containerRef }
  );

  if (notes.length === 0) return null;

  return (
    <section
      ref={containerRef}
      id="notes"
      className="relative min-h-[100dvh] w-full overflow-hidden border-t border-[#36513B]/16 bg-transparent px-4 py-20 select-none dark:border-white/16 sm:px-6 md:py-28 lg:px-8"
    >
      {/* Background Ambient Pine Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[#36513B]/6 dark:bg-[#7CD090]/4 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="journal-card-anim flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-3">
            <p className="font-mono text-[10px] font-bold tracking-[0.12em] text-[#6F7E70] uppercase">
              01 / FEATURED ESSAYS
            </p>
            <h2 className="font-[family-name:var(--section-heading-font)] text-5xl font-semibold leading-[0.9] tracking-[-0.1em] text-[#26352A] dark:text-[#F0F5F1] sm:text-6xl">
              精选<em className="ml-1 font-[family-name:var(--section-heading-font)] not-italic font-medium">笔记</em>
            </h2>
            <p className="text-sm sm:text-base text-[#5A5551] dark:text-[#9EB3A4] max-w-lg font-normal">
              从工程架构到生活感知，记录实践中沉淀下的思考与灵感。
            </p>
          </div>

          <Link
            href="/notes"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#36513B] dark:text-[#7CD090] hover:text-[#283E2C] dark:hover:text-white transition-colors group self-start sm:self-end"
          >
            <span>查看全部</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3 Artisan Journal 3D Flip Cards (Jitter-free Static Hitbox Architecture) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch pt-2">
          {notes.map((note, index) => (
            <div
              key={note.id}
              className="journal-card-anim group relative h-[420px] sm:h-[440px] w-full [perspective:1000px] cursor-pointer isolate"
            >
              {/* Invisible Hitbox Extension to completely eliminate edge flickers */}
              <div className="absolute -inset-4 pointer-events-auto" aria-hidden="true" />

              {/* 3D Rotating Flipper & Motion Holder */}
              <div className={`relative h-full w-full rounded-3xl shadow-[0_12px_32px_rgba(38,53,42,0.06)] transition-all duration-500 transform ${NOTE_ROTATIONS[index]} [transform-style:preserve-3d] group-hover:-translate-y-3 group-hover:rotate-0 group-hover:[transform:rotateY(180deg)] group-hover:shadow-[0_26px_50px_rgba(54,81,59,0.18)]`}>
                
                {/* ========================================================= */}
                {/* FRONT SIDE: 活页手帐封面 (Front Face) */}
                {/* ========================================================= */}
                <div className="absolute inset-0 h-full w-full rounded-3xl bg-[#FFFEF9] dark:bg-[#1C261F] border border-[#26352A]/12 dark:border-white/12 p-6 [backface-visibility:hidden] flex flex-col justify-between overflow-visible">
                  
                  {/* Top Washi Bookmark Ribbon (右上角和纸便签贴) */}
                  <div className="absolute -top-3.5 right-6 w-24 h-7 bg-[#F5E8D3]/90 dark:bg-[#2A3B30]/90 border border-[#E8D7BE]/70 dark:border-white/10 rotate-[2deg] backdrop-blur-2xs shadow-2xs z-20 pointer-events-none rounded-xs flex items-center justify-center">
                    <span className="font-mono text-[10px] font-bold text-[#8C4A31] dark:text-[#E5987D] tracking-wider">
                      NOTE · 0{index + 1}
                    </span>
                  </div>

                  {/* Left Binder Punch Holes (左侧活页扣孔细节) */}
                  <div className="absolute left-2.5 inset-y-8 w-2 flex flex-col justify-between pointer-events-none z-20 opacity-30 dark:opacity-40">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="size-2 rounded-full bg-[#2D2B2C]/30 dark:bg-white/30 border border-black/10" />
                    ))}
                  </div>

                  <div className="space-y-4 pl-3">
                    {/* Top Category Badge */}
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2EBE4] dark:bg-[#23382C] text-[11px] font-mono font-semibold text-[#36513B] dark:text-[#7CD090] border border-[#36513B]/10 dark:border-white/5">
                        {getCategoryIcon(note.iconName)}
                        <span>{note.category}</span>
                      </div>
                      <span className="font-mono text-xs text-[#7A736A] dark:text-[#9EB3A4]">
                        {note.readTime ?? "5 min"}
                      </span>
                    </div>

                    {/* Cover Image Frame */}
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-[#141C16] border border-[#2D2B2C]/8 dark:border-white/8">
                      <Image
                        src={note.coverImage || "/gallery/earth-atmosphere-space.png"}
                        alt={note.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Title & Synopsis */}
                    <div className="space-y-1.5">
                      <h3 className="min-h-[3.5rem] text-base font-bold leading-snug text-[#26352A] line-clamp-2 dark:text-[#F0F5F1] sm:text-lg">
                        {note.title}
                      </h3>

                      <p className="min-h-[2.75rem] text-xs leading-relaxed text-[#5A5551] line-clamp-2 dark:text-[#9EB3A4]">
                        {note.summary}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Bar */}
                  <div className="flex shrink-0 items-center justify-between border-t border-[#36513B]/12 pt-3 pl-3 text-xs text-[#6D7C6E] dark:border-white/8 dark:text-[#9EB3A4]">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Calendar className="size-3.5" />
                      <span>{note.date}</span>
                    </div>

                  </div>
                </div>

                {/* ========================================================= */}
                {/* BACK SIDE: 松针绿深度手记内页 (Back Face) */}
                {/* ========================================================= */}
                <div className="absolute inset-0 h-full w-full rounded-3xl bg-[#36513B] dark:bg-[#16241B] text-white p-6 [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-between border border-[#36513B]/40 shadow-2xl overflow-hidden">
                  
                  {/* Left Punch Holes on Back */}
                  <div className="absolute right-2.5 inset-y-8 w-2 flex flex-col justify-between pointer-events-none z-20 opacity-30">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="size-2 rounded-full bg-white/30 border border-white/10" />
                    ))}
                  </div>

                  <div className="space-y-4 pr-3">
                    <div className="flex items-center justify-between text-xs text-white/80 font-mono">
                      <span className="font-bold text-[#E5987D]">
                        NOTE · 0{index + 1}
                      </span>
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px]">
                        <Clock className="size-3 text-[#E5987D]" />
                        <span>{note.readTime ?? "5 min"}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white leading-tight">
                      {note.title}
                    </h3>

                    {/* Excerpt Box */}
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs">
                      <span className="block font-mono text-[9px] text-[#E5987D] uppercase tracking-wider mb-1">
                        ESSAY THESIS
                      </span>
                      <p className="text-xs text-white/90 leading-relaxed line-clamp-4">
                        “{note.summary}”
                      </p>
                    </div>
                  </div>

                  {/* Read Article CTA Button */}
                  <Link
                    href={`/notes/${note.id}`}
                    className="w-full py-3 rounded-full bg-white text-[#36513B] hover:bg-[#F0F5F1] transition-all font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:scale-105 active:scale-95 z-30"
                  >
                    <span>进入阅读全文</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
