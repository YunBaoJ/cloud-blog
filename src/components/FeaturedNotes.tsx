"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, Calendar, Camera, Code2, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { NoteItem } from "@/lib/notes";

gsap.registerPlugin(ScrollTrigger);

interface FeaturedNotesProps {
  initialNotes: NoteItem[];
}

function NoteIcon({ iconName }: { iconName: string }) {
  const className = "h-5 w-5";

  switch (iconName) {
    case "Code2":
      return <Code2 className={`${className} text-[#36513B]`} aria-hidden="true" />;
    case "Camera":
      return <Camera className={`${className} text-[#A46A4D]`} aria-hidden="true" />;
    default:
      return <Sparkles className={`${className} text-[#718F6E]`} aria-hidden="true" />;
  }
}

export default function FeaturedNotes({ initialNotes }: FeaturedNotesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const notes = initialNotes.slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.from(".featured-note-entry", {
      y: 18,
      opacity: 0,
      duration: 0.45,
      stagger: 0.08,
      ease: "power2.out",
      clearProps: "all",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 82%",
      },
    });
  }, { scope: sectionRef });

  if (notes.length === 0) return null;

  return (
    <section ref={sectionRef} id="notes" className="w-full border-t border-[#36513B]/16 bg-transparent px-4 py-16 dark:border-white/16 sm:px-6 md:py-20 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="featured-note-entry max-w-2xl">
          <h2 className="font-[family-name:var(--section-heading-font)] text-5xl font-semibold leading-[0.9] tracking-[-0.1em] text-[#26352A] dark:text-[#F0F5F1] sm:text-6xl">
            精选<em className="ml-1 font-[family-name:var(--section-heading-font)] not-italic font-medium">笔记</em>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#627161] dark:text-[#9EB3A4] sm:text-base">
            从工程实践到日常感受，展开一页，读完一个此刻仍值得保留的想法。
          </p>
        </div>

        <div className="featured-note-entry mt-10 overflow-hidden rounded-[22px] border border-[#36513B]/14 bg-[#FFFEF9]/82 shadow-[0_18px_38px_rgba(38,53,42,0.08)] dark:border-white/14 dark:bg-[#1D2920]/78">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {notes.map((note, index) => {
              const isActive = activeIndex === index;

              return (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  className={`featured-note-entry group relative flex min-h-[286px] flex-col p-6 transition-[background-color,transform,box-shadow] duration-300 motion-reduce:transition-none sm:p-7 lg:min-h-[332px] lg:p-8 ${
                    index > 0 ? "border-t border-[#36513B]/12 lg:border-l lg:border-t-0 dark:border-white/12" : ""
                  } ${
                    isActive
                      ? "z-10 bg-[#E4E9DD]/72 shadow-[0_14px_28px_rgba(38,53,42,0.1)] lg:-translate-y-2 dark:bg-[#314132]/82"
                      : "bg-transparent hover:bg-[#F6F4EC]/76 dark:hover:bg-white/5"
                  }`}
                >
                  <span className={`absolute left-0 top-7 h-11 w-[3px] rounded-r-full transition-colors duration-300 motion-reduce:transition-none ${isActive ? "bg-[#718F6E]" : "bg-transparent group-hover:bg-[#9DB289]"}`} aria-hidden="true" />

                  <div className="flex items-center justify-between gap-4 text-[11px] font-medium text-[#748176] dark:text-[#A7B5AA]">
                    <span className="inline-flex items-center gap-2">
                      <NoteIcon iconName={note.iconName} />
                      {note.category}
                    </span>
                    <span className="shrink-0">{note.date}</span>
                  </div>

                  <div className="mt-8">
                    <p className="font-mono text-[10px] font-semibold tracking-[0.12em] text-[#8A9A88]">{String(index + 1).padStart(2, "0")}</p>
                    <h3 className="mt-3 text-[22px] font-semibold leading-snug tracking-[-0.045em] text-[#26352A] transition-colors duration-300 group-hover:text-[#36513B] dark:text-[#F0F5F1] sm:text-2xl">
                      {note.title}
                    </h3>
                    <p className={`mt-4 text-sm leading-7 text-[#627161] transition-[max-height,opacity] duration-300 motion-reduce:transition-none dark:text-[#A7B5AA] ${isActive ? "max-h-24 opacity-100" : "max-h-14 overflow-hidden opacity-75"}`}>
                      {note.summary}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-[#36513B]/12 pt-5 text-sm font-semibold text-[#36513B] dark:border-white/12 dark:text-[#B8CEB4]">
                    <span className="inline-flex items-center gap-1.5 text-[#748176] dark:text-[#A7B5AA]"><Calendar className="h-3.5 w-3.5" aria-hidden="true" />{note.readTime ?? "阅读笔记"}</span>
                    <span className="inline-flex items-center gap-1.5">阅读全文 <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <Link href="/notes" className="featured-note-entry mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#36513B] transition-colors hover:text-[#26352A] dark:text-[#B8CEB4] dark:hover:text-white">
          查看全部笔记
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
