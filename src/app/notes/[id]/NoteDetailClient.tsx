"use client";

import { useState, useRef } from "react";
import Footer from "@/components/Footer";
import ArticleTOC from "@/components/ArticleTOC";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Eye, ChevronRight, ChevronLeft, Copy, Check, Type, Sparkles } from "lucide-react";
import { NoteItem } from "@/data/mockData";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface NoteDetailClientProps {
  note: NoteItem;
  prevNote: NoteItem | null;
  nextNote: NoteItem | null;
}

function highlightCodeTokens(code: string): React.ReactNode[] {
  const lines = code.split("\n");
  return lines.map((line, lineIdx) => {
    // 1. Comments
    if (line.trim().startsWith("//") || line.trim().startsWith("#")) {
      return (
        <div key={lineIdx} className="italic text-[#7A8B7E]">
          {line}
        </div>
      );
    }

    // Tokenize line
    const tokenRegex = /(\b(?:import|export|from|default|const|let|var|function|return|async|await|if|else|interface|type|class|try|catch|new|of|in|as)\b|".*?"|'.*?'|`.*?`|\b\d+\b|\/\/.*)/g;
    const parts = line.split(tokenRegex);

    return (
      <div key={lineIdx} className="table-row">
        <span className="table-cell select-none text-right pr-4 text-[#4E6354] font-mono text-[11px]">
          {lineIdx + 1}
        </span>
        <span className="table-cell whitespace-pre">
          {parts.map((part, pIdx) => {
            if (/^(import|export|from|default|const|let|var|function|return|async|await|if|else|interface|type|class|try|catch|new|of|in|as)$/.test(part)) {
              return <span key={pIdx} className="text-[#E8C68A] font-bold">{part}</span>;
            }
            if (/^["'`].*["'`]$/.test(part)) {
              return <span key={pIdx} className="text-[#E49A74]">{part}</span>;
            }
            if (/^\d+$/.test(part)) {
              return <span key={pIdx} className="text-[#7AB8E6]">{part}</span>;
            }
            if (part.startsWith("//")) {
              return <span key={pIdx} className="italic text-[#7A8B7E]">{part}</span>;
            }
            return <span key={pIdx} className="text-[#E2EBE4]">{part}</span>;
          })}
        </span>
      </div>
    );
  });
}

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 rounded-2xl bg-[#18231C] border border-white/12 overflow-hidden shadow-xl group">
      {/* Code Header Bar with Mac Window Dots */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#121A15] border-b border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block" />
          </div>
          <span className="text-[11px] text-[#9EB3A4] font-semibold uppercase tracking-wider ml-2">
            {lang || "code"}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/8 hover:bg-white/15 text-[#D1E0D4] hover:text-white transition-all active:scale-95 border border-white/10 text-xs font-medium"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">已复制!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#9EB3A4]" />
              <span>复制代码</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content with Line Numbers & Syntax Highlighting */}
      <pre className="p-4 sm:p-5 overflow-x-auto font-mono text-xs sm:text-sm text-[#E2EBE4] leading-relaxed bg-[#18231C]">
        <code className="table w-full border-collapse">
          {highlightCodeTokens(code)}
        </code>
      </pre>
    </div>
  );
}

function renderFormattedInlineText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-bold text-[#2D2B2C] dark:text-[#F0F5F1]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={index} className="italic text-[#36513B] dark:text-[#7CD090]">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-[#E2EBE4] dark:bg-[#24382A] text-[#36513B] dark:text-[#7CD090] font-mono text-xs font-semibold mx-0.5"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function ArticleMarkdownRenderer({ content }: { content: string }) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let currentLang = "code";

  lines.forEach((line, idx) => {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <CodeBlock key={`code-${idx}`} code={codeBuffer.join("\n")} lang={currentLang} />
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        currentLang = line.replace("```", "").trim() || "code";
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 id={`heading-${idx}`} key={idx} className="text-xl sm:text-2xl font-bold text-[#2D2B2C] dark:text-[#F0F5F1] pt-6 pb-2 border-b border-[#2D2B2C]/8 dark:border-white/10 scroll-mt-28">
          {renderFormattedInlineText(trimmed.replace("### ", ""))}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 id={`heading-${idx}`} key={idx} className="text-2xl sm:text-3xl font-bold text-[#2D2B2C] dark:text-[#F0F5F1] pt-8 pb-3 border-b border-[#2D2B2C]/10 dark:border-white/10 flex items-center gap-2 scroll-mt-28">
          <span className="w-2.5 h-6 bg-[#36513B] rounded-full inline-block" />
          {renderFormattedInlineText(trimmed.replace("## ", ""))}
        </h2>
      );
    } else if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote key={idx} className="my-6 pl-4 py-3 border-l-4 border-[#36513B] bg-[#FAF7F2] dark:bg-[#23382C] rounded-r-2xl italic text-[#5A5551] dark:text-[#9EB3A4]">
          {renderFormattedInlineText(trimmed.replace("> ", ""))}
        </blockquote>
      );
    } else {
      elements.push(
        <p key={idx} className="leading-relaxed font-normal">
          {renderFormattedInlineText(trimmed)}
        </p>
      );
    }
  });

  return <div className="space-y-5">{elements}</div>;
}

export default function NoteDetailClient({ note, prevNote, nextNote }: NoteDetailClientProps) {
  const [fontSizeLevel, setFontSizeLevel] = useState<"sm" | "base" | "lg">("base");
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header items stagger entrance
    gsap.from(".note-header-anim", {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.7,
      ease: "power2.out",
      clearProps: "all",
    });

    // Content paper card fade in
    gsap.from(".note-paper-card", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.35,
      clearProps: "all",
    });
  }, { scope: containerRef });

  const fontSizeClass = fontSizeLevel === "sm"
    ? "text-sm text-[#3A3638] dark:text-[#D1E0D4]"
    : fontSizeLevel === "lg"
    ? "text-lg text-[#2D2B2C] dark:text-[#E2EBE4]"
    : "text-base text-[#333031] dark:text-[#D9E5DC]";

  // Extract TOC items from markdown content
  const tocItems = note.content
    .split("\n")
    .map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("### ")) {
        return { id: `heading-${idx}`, title: trimmed.replace("### ", "").replace(/\*\*/g, ""), level: 3 };
      }
      if (trimmed.startsWith("## ")) {
        return { id: `heading-${idx}`, title: trimmed.replace("## ", "").replace(/\*\*/g, ""), level: 2 };
      }
      if (trimmed.startsWith("# ")) {
        return { id: `heading-${idx}`, title: trimmed.replace("# ", "").replace(/\*\*/g, ""), level: 1 };
      }
      return null;
    })
    .filter(Boolean) as { id: string; title: string; level: number }[];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FAF7F2] dark:bg-[#141C16] text-[#2D2B2C] dark:text-[#F0F5F1] transition-colors duration-300">
      {/* Left Floating TOC Sidebar — Follows scroll on the left */}
      <ArticleTOC items={tocItems} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 xl:pl-20 pt-28 pb-20 space-y-10">
        {/* Top Controls */}
        <div className="flex items-center justify-between">
          <Link
            href="/notes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A5551] dark:text-[#9EB3A4] hover:text-[#36513B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回随笔列表</span>
          </Link>

          {/* Font Size Adjuster Controls */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#1E2721] p-1 rounded-2xl border border-[#2D2B2C]/8 dark:border-white/10 shadow-2xs">
            <Type className="w-3.5 h-3.5 text-[#7A736A] ml-2 mr-1" />
            <button
              onClick={() => setFontSizeLevel("sm")}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                fontSizeLevel === "sm"
                  ? "bg-[#36513B] text-white shadow-2xs"
                  : "text-[#7A736A] hover:bg-gray-100 dark:hover:bg-white/10"
              }`}
            >
              小
            </button>
            <button
              onClick={() => setFontSizeLevel("base")}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                fontSizeLevel === "base"
                  ? "bg-[#36513B] text-white shadow-2xs"
                  : "text-[#7A736A] hover:bg-gray-100 dark:hover:bg-white/10"
              }`}
            >
              中
            </button>
            <button
              onClick={() => setFontSizeLevel("lg")}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                fontSizeLevel === "lg"
                  ? "bg-[#36513B] text-white shadow-2xs"
                  : "text-[#7A736A] hover:bg-gray-100 dark:hover:bg-white/10"
              }`}
            >
              大
            </button>
          </div>
        </div>

        {/* Header Section */}
        <div className="space-y-4 text-center sm:text-left border-b border-[#2D2B2C]/8 dark:border-white/10 pb-8">
          <div className="note-header-anim flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E2EBE4] dark:bg-[#23382C] text-[#36513B] dark:text-[#7CD090]">
              {note.category}
            </span>
            {note.tags.map((tag) => (
              <span key={tag} className="text-xs text-[#7A736A] dark:text-[#9EB3A4]">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="note-header-anim text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2D2B2C] dark:text-[#F0F5F1] leading-tight">
            {note.title}
          </h1>

          <div className="note-header-anim flex items-center justify-center sm:justify-start gap-4 text-xs text-[#7A736A] dark:text-[#9EB3A4] font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {note.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {note.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {note.views} 阅读
            </span>
          </div>
        </div>

        {/* Restored Original White Paper Rounded Reading Card */}
        <div className="note-paper-card w-full bg-white/95 dark:bg-[#1E2721]/90 backdrop-blur-sm rounded-3xl p-8 sm:p-14 md:p-16 border border-white dark:border-white/10 shadow-[0_8px_32px_rgba(45,43,44,0.04)]">
          <div className={`space-y-6 ${fontSizeClass}`}>
            <ArticleMarkdownRenderer content={note.content} />
          </div>
        </div>

        {/* Masterclass Next / Previous Article Navigation Section */}
        <div className="space-y-6 pt-6">
          {/* Eyebrow Header */}
          <div className="flex items-center justify-between border-b border-[#2D2B2C]/10 dark:border-white/10 pb-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#36513B] dark:text-[#7CD090] tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#8C4A31] dark:text-[#E5987D]" />
              <span>延伸阅读与探索</span>
            </div>
            <Link
              href="/notes"
              className="text-xs font-semibold text-[#7A736A] dark:text-[#9EB3A4] hover:text-[#36513B] dark:hover:text-[#7CD090] inline-flex items-center gap-1 transition-colors"
            >
              <span>浏览全部随笔笔记</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Navigation Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {prevNote ? (
              <Link
                href={`/notes/${prevNote.id}`}
                className="group relative p-6 rounded-3xl bg-white/90 dark:bg-[#1E2721]/90 hover:bg-[#FAF0EA]/80 dark:hover:bg-[#33221C]/80 backdrop-blur-md border border-[#2D2B2C]/8 dark:border-white/10 hover:border-[#8C4A31]/30 dark:hover:border-[#E5987D]/30 shadow-[0_4px_20px_rgba(45,43,44,0.03)] hover:shadow-[0_12px_32px_rgba(140,74,49,0.12)] transition-all duration-300 flex items-center justify-between gap-5"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#FAF0EA] dark:bg-[#38231C] border border-[#8C4A31]/20 dark:border-[#E5987D]/20 flex items-center justify-center text-[#8C4A31] dark:text-[#E5987D] flex-shrink-0 group-hover:-translate-x-1.5 transition-transform">
                  <ChevronLeft className="w-5 h-5" />
                </div>

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-[#8C4A31] dark:text-[#E5987D] uppercase tracking-wider">
                      ← 上一篇
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8C4A31]/10 dark:bg-[#E5987D]/15 text-[#8C4A31] dark:text-[#E5987D] font-medium">
                      {prevNote.category}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-[#2D2B2C] dark:text-[#F0F5F1] group-hover:text-[#8C4A31] dark:group-hover:text-[#E5987D] transition-colors truncate leading-snug">
                    {prevNote.title}
                  </h4>
                </div>
              </Link>
            ) : <div />}

            {nextNote ? (
              <Link
                href={`/notes/${nextNote.id}`}
                className="group relative p-6 rounded-3xl bg-white/90 dark:bg-[#1E2721]/90 hover:bg-[#E2EBE4]/80 dark:hover:bg-[#1E3324]/80 backdrop-blur-md border border-[#2D2B2C]/8 dark:border-white/10 hover:border-[#36513B]/30 dark:hover:border-[#7CD090]/30 shadow-[0_4px_20px_rgba(45,43,44,0.03)] hover:shadow-[0_12px_32px_rgba(54,81,59,0.12)] transition-all duration-300 flex items-center justify-between gap-5 text-right"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#36513B]/10 dark:bg-[#7CD090]/15 text-[#36513B] dark:text-[#7CD090] font-medium">
                      {nextNote.category}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#36513B] dark:text-[#7CD090] uppercase tracking-wider">
                      下一篇 →
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-[#2D2B2C] dark:text-[#F0F5F1] group-hover:text-[#36513B] dark:group-hover:text-[#7CD090] transition-colors truncate leading-snug">
                    {nextNote.title}
                  </h4>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-[#E2EBE4] dark:bg-[#23382C] border border-[#36513B]/20 dark:border-[#7CD090]/20 flex items-center justify-center text-[#36513B] dark:text-[#7CD090] flex-shrink-0 group-hover:translate-x-1.5 transition-transform">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </Link>
            ) : <div />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
