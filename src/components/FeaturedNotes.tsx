"use client";

import { useRef } from "react";
import type { NoteItem } from "@/lib/notes";
import { Code2, Camera, Sparkles, Clock, Calendar, ArrowRight, BookOpen, Tag } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface FeaturedNotesProps {
  initialNotes: NoteItem[];
}

export default function FeaturedNotes({ initialNotes }: FeaturedNotesProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featuredNotesList = initialNotes;

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".note-card-anim", {
      y: 25,
      opacity: 0,
      scale: 0.98,
      duration: 0.5,
      stagger: 0.08,
      ease: "power2.out",
      clearProps: "all",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 82%",
      },
    });
  }, { scope: sectionRef });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Code2":
        return <Code2 className="w-5 h-5 text-[#36513B]" />;
      case "Camera":
        return <Camera className="w-5 h-5 text-[#8C4A31]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#2A5270]" />;
    }
  };

  const mainFeaturedNote = featuredNotesList[0];
  const sideNotes = featuredNotesList.slice(1, 3);

  return (
    <section ref={sectionRef} id="notes" className="relative w-full py-20 md:py-28 px-4 bg-transparent">
      {/* Soft Pine & Bamboo Ambient Background Glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#36513B]/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="note-card-anim flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E2EBE4] text-[#36513B] text-xs font-semibold tracking-wide shadow-2xs">
              <BookOpen className="w-3.5 h-3.5" />
              <span>记录与沉淀</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2B2C] tracking-tight">
              近期精选笔记 (Featured Notes)
            </h2>
            <p className="text-sm sm:text-base text-[#5A5551] max-w-lg font-normal">
              在严谨的代码逻辑与惬意的小屋生活之间，记录每一个值得长久留存的思考。
            </p>
          </div>

          <Link
            href="/notes"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#36513B] hover:text-[#283E2C] transition-colors group"
          >
            <span>进入笔记列表页 (24篇)</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Asymmetric Bento Grid (Left: Large Highlighted Card, Right: Stacked Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Featured Note (Left 7 Cols) */}
          <Link
            href="/notes"
            className="note-card-anim lg:col-span-7 group relative bg-white/90 backdrop-blur-xs rounded-3xl p-8 border border-white/90 shadow-[0_4px_24px_rgba(45,43,44,0.04)] hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(45,43,44,0.09)] transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E2EBE4] text-[#36513B] text-xs font-bold">
                  {getIcon(mainFeaturedNote.iconName)}
                  <span>主打推荐</span>
                </div>
                <span className="text-xs font-semibold text-[#8C4A31] bg-[#FAF0EA] px-3 py-1 rounded-full">
                  {mainFeaturedNote.category}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2B2C] group-hover:text-[#36513B] transition-colors leading-snug">
                  {mainFeaturedNote.title}
                </h3>
                <p className="text-sm sm:text-base text-[#5A5551] leading-relaxed font-normal">
                  {mainFeaturedNote.summary}
                </p>
              </div>

              {/* Tags list */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-[11px] font-mono text-[#7A736A] border border-[#2D2B2C]/5">
                  <Tag className="w-3 h-3 text-[#36513B]" />
                  <span>Next.js App Router</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-[11px] font-mono text-[#7A736A] border border-[#2D2B2C]/5">
                  <span>性能优化</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-[11px] font-mono text-[#7A736A] border border-[#2D2B2C]/5">
                  <span>架构设计</span>
                </span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#2D2B2C]/5 flex items-center justify-between text-xs text-[#7A736A] font-medium">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#36513B]" />
                  {mainFeaturedNote.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {mainFeaturedNote.readTime}
                </span>
              </div>

              <span className="text-[#36513B] font-bold group-hover:underline inline-flex items-center gap-1">
                阅读全文 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Right Column Stacked Notes (Right 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {sideNotes.map((note: NoteItem) => (
              <Link
                key={note.id}
                href="/notes"
                className="note-card-anim group relative bg-white/90 backdrop-blur-xs rounded-3xl p-6 border border-white/90 shadow-[0_4px_24px_rgba(45,43,44,0.04)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(45,43,44,0.07)] transition-all duration-300 flex flex-col justify-between flex-1"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#7A736A] border border-white/80">
                      {note.category}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white border border-white/80 flex items-center justify-center shadow-2xs">
                      {getIcon(note.iconName)}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#2D2B2C] group-hover:text-[#36513B] transition-colors leading-snug line-clamp-2">
                    {note.title}
                  </h3>
                  <p className="text-xs text-[#5A5551] line-clamp-2 leading-relaxed font-normal">
                    {note.summary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#2D2B2C]/5 flex items-center justify-between text-[11px] text-[#7A736A]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>{note.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>{note.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
