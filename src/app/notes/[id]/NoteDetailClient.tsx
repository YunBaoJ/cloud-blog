"use client";

import { useState, useRef } from "react";
import Footer from "@/components/Footer";
import ArticleTOC from "@/components/ArticleTOC";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Eye, ChevronRight, ChevronLeft, Copy, Check, Type, Sparkles, Maximize2, Minimize2, ChevronDown, ChevronUp, Share2, Bookmark, X } from "lucide-react";
import type { NoteItem } from "@/lib/notes";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReadingPreferences } from "@/lib/useReadingPreferences";
import { notify } from "@/lib/toast";

interface RelatedNote {
  id: string;
  title: string;
  summary: string;
  category: string;
}

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface NoteDetailClientProps {
  note: NoteItem;
  prevNote: NoteItem | null;
  nextNote: NoteItem | null;
  relatedNotes: RelatedNote[];
}

function highlightCodeTokens(code: string): React.ReactNode[] {
  const lines = code.split("\n");
  return lines.map((line, lineIdx) => {
    const lineNumber = lineIdx + 1;

    // 1. Comments
    if (line.trim().startsWith("//") || line.trim().startsWith("#")) {
      return (
        <div key={lineIdx} className="flex min-w-full leading-relaxed">
          <span className="w-7 sm:w-9 shrink-0 select-none text-right pr-3.5 text-[#4E6354] font-mono text-xs">
            {lineNumber}
          </span>
          <span className="flex-1 whitespace-pre italic text-[#7A8B7E]">
            {line}
          </span>
        </div>
      );
    }

    // Tokenize line
    const tokenRegex = /(\b(?:import|export|from|default|const|let|var|function|return|async|await|if|else|interface|type|class|try|catch|new|of|in|as)\b|".*?"|'.*?'|`.*?`|\b\d+\b|\/\/.*)/g;
    const parts = line.split(tokenRegex);

    return (
      <div key={lineIdx} className="flex min-w-full leading-relaxed">
        <span className="w-7 sm:w-9 shrink-0 select-none text-right pr-3.5 text-[#4E6354] font-mono text-xs">
          {lineNumber}
        </span>
        <span className="flex-1 whitespace-pre">
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const linesCount = code.split("\n").length;
  const isLongCode = linesCount > 6;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="relative my-6 rounded-2xl bg-[#141C16] border border-white/10 overflow-hidden shadow-xl group">
        {/* Code Header Bar with Mac Window Dots */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0D140E] border-b border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block" />
            </div>
            <span className="text-[11px] text-[#9EB3A4] font-bold uppercase tracking-wider ml-2 font-mono">
              {lang || "code"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Independent Fullscreen Window Button */}
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="p-1 rounded-xl bg-white/8 hover:bg-white/15 text-[#9EB3A4] hover:text-white transition-all active:scale-95 border border-white/10"
              title="独立全屏窗口查看"
              aria-label="独立全屏窗口查看"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Copy Button */}
            <button
              type="button"
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
        </div>

        {/* Code Content Container — Snappy 150ms Response */}
        <div
          className={`p-4 sm:p-5 overflow-x-auto font-mono text-xs sm:text-sm text-[#E2EBE4] leading-relaxed bg-[#141C16] relative transition-all duration-150 ease-out ${
            isLongCode && !isExpanded ? "max-h-[190px] overflow-hidden" : "max-h-none"
          }`}
        >
          <div className="inline-block min-w-full">
            {highlightCodeTokens(code)}
          </div>

          {/* Gradient Overlay for Collapsed State */}
          {isLongCode && !isExpanded && (
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#141C16] via-[#141C16]/85 to-transparent pointer-events-none" />
          )}
        </div>

        {/* Bottom In-place Expand / Hide Collapse Toggle Bar */}
        {isLongCode && (
          <div className="px-4 py-2 bg-[#0D140E] border-t border-white/10 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white/6 hover:bg-white/12 text-xs font-semibold text-[#7CD090] hover:text-white transition-all border border-white/10 active:scale-95"
            >
              {isExpanded ? (
                <>
                  <span>隐藏 / 收起代码</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>展开完整代码 ({linesCount} 行)</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Independent Fullscreen Window Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md p-4 sm:p-8 flex flex-col items-center justify-center animate-in fade-in duration-150"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="w-full max-w-5xl max-h-[90vh] bg-[#141C16] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#0D140E] border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <span className="text-sm font-mono font-bold text-[#7CD090] uppercase tracking-wider ml-2">
                  {lang || "code"} · 独立沉浸式视窗 ({linesCount} 行)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all active:scale-95 border border-white/10"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">已复制!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#9EB3A4]" />
                      <span>复制代码</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#9EB3A4] hover:text-white transition-all active:scale-95 border border-white/10"
                  title="关闭窗口"
                  aria-label="关闭窗口"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Fullscreen Code Content */}
            <div className="p-6 overflow-auto flex-1 font-mono text-sm leading-relaxed bg-[#141C16]">
              <div className="inline-block min-w-full">
                {highlightCodeTokens(code)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
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

function slugifyTitle(text: string, index: number): string {
  const clean = text
    .replace(/^#+\s*/, "")
    .replace(/\*\*/g, "")
    .replace(/[`'"]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00\u9fa5]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  const base = clean || "heading";
  return `heading-${index}-${base}`;
}

function ArticleMarkdownRenderer({ content, fontSizeLevel }: { content: string; fontSizeLevel: "sm" | "base" | "lg" }) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let currentLang = "code";
  let headingIndex = 0;
  let listItems: string[] = [];
  let orderedList = false;

  const flushList = (key: number) => {
    if (listItems.length === 0) return;
    const List = orderedList ? "ol" : "ul";
    elements.push(
      <List key={`list-${key}`} className={`space-y-2 pl-6 leading-relaxed ${orderedList ? "list-decimal" : "list-disc"}`}>
        {listItems.map((item, itemIndex) => (
          <li key={`${key}-${itemIndex}`}>{renderFormattedInlineText(item)}</li>
        ))}
      </List>
    );
    listItems = [];
  };

  // Heading sizes tuned to font size control
  const h2Size = fontSizeLevel === "sm"
    ? "text-lg sm:text-xl font-bold"
    : fontSizeLevel === "lg"
    ? "text-2xl sm:text-3xl font-bold"
    : "text-xl sm:text-2xl font-bold";

  const h3Size = fontSizeLevel === "sm"
    ? "text-base sm:text-lg font-bold"
    : fontSizeLevel === "lg"
    ? "text-xl sm:text-2xl font-bold"
    : "text-lg sm:text-xl font-bold";

  lines.forEach((line, idx) => {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <CodeBlock key={`code-${idx}`} code={codeBuffer.join("\n")} lang={currentLang} />
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        flushList(idx);
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
    if (!trimmed) {
      flushList(idx);
      return;
    }

    const unorderedMatch = trimmed.match(/^[-*]\s+(.+)/);
    const orderedMatch = trimmed.match(/^\d+\.\s+(.+)/);
    if (unorderedMatch || orderedMatch) {
      const nextOrdered = Boolean(orderedMatch);
      if (listItems.length > 0 && orderedList !== nextOrdered) flushList(idx);
      orderedList = nextOrdered;
      listItems.push((orderedMatch || unorderedMatch)?.[1] ?? "");
      return;
    }

    flushList(idx);

    if (trimmed.startsWith("# ")) {
      return;
    } else if (trimmed === "---") {
      elements.push(<hr key={idx} className="my-8 border-[#2D2B2C]/10 dark:border-white/10" />);
    } else if (trimmed.startsWith("### ")) {
      const headingId = slugifyTitle(trimmed, headingIndex++);
      elements.push(
        <h3 id={headingId} key={idx} className={`${h3Size} text-[#2D2B2C] dark:text-[#F0F5F1] pt-6 pb-2 border-b border-[#2D2B2C]/8 dark:border-white/10 scroll-mt-28`}>
          {renderFormattedInlineText(trimmed.replace("### ", ""))}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      const headingId = slugifyTitle(trimmed, headingIndex++);
      elements.push(
        <h2 id={headingId} key={idx} className={`${h2Size} text-[#2D2B2C] dark:text-[#F0F5F1] pt-8 pb-3 border-b border-[#2D2B2C]/10 dark:border-white/10 flex items-center gap-2.5 scroll-mt-28`}>
          <span className="w-2.5 h-6 bg-[#36513B] dark:bg-[#7CD090] rounded-full inline-block" />
          {renderFormattedInlineText(trimmed.replace("## ", ""))}
        </h2>
      );
    } else if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote key={idx} className="my-6 border-l-2 border-[#36513B]/60 bg-[#FAF7F2] py-3.5 pl-5 italic text-[#4A4541] dark:border-[#7CD090]/60 dark:bg-[#23382C] dark:text-[#AEC2B4]">
          {renderFormattedInlineText(trimmed.replace("> ", ""))}
        </blockquote>
      );
    } else {
      elements.push(
        <p key={idx} className="leading-relaxed sm:leading-[1.85] font-normal tracking-wide">
          {renderFormattedInlineText(trimmed)}
        </p>
      );
    }
  });

  flushList(lines.length);
  if (inCodeBlock && codeBuffer.length > 0) {
    elements.push(<CodeBlock key="code-final" code={codeBuffer.join("\n")} lang={currentLang} />);
  }

  return <div className="space-y-6">{elements}</div>;
}

export default function NoteDetailClient({ note, prevNote, nextNote, relatedNotes }: NoteDetailClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    fontSize: fontSizeLevel,
    setFontSize: setFontSizeLevel,
    savedProgress,
    resumeReading,
    dismissResume,
  } = useReadingPreferences(note.id);

  const handleShare = async () => {
    const shareData = {
      title: note.title,
      text: note.summary,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        notify("已打开系统分享", "success");
      } else {
        await navigator.clipboard.writeText(shareData.url);
        notify("文章链接已复制", "success");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      notify("分享失败，请稍后重试", "error");
    }
  };

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
    ? "text-sm sm:text-base text-[#3A3638] dark:text-[#D1E0D4]"
    : fontSizeLevel === "lg"
    ? "text-xl sm:text-2xl text-[#2D2B2C] dark:text-[#E2EBE4]"
    : "text-base sm:text-lg text-[#333031] dark:text-[#D9E5DC]";

  // Extract TOC items with identical heading index counter for 100% unique keys (h2 & h3 only)
  let tocHeadingIndex = 0;
  const tocItems = note.content
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("### ")) {
        const id = slugifyTitle(trimmed, tocHeadingIndex++);
        return { id, title: trimmed.replace("### ", "").replace(/\*\*/g, ""), level: 3 };
      }
      if (trimmed.startsWith("## ")) {
        const id = slugifyTitle(trimmed, tocHeadingIndex++);
        return { id, title: trimmed.replace("## ", "").replace(/\*\*/g, ""), level: 2 };
      }
      return null;
    })
    .filter(Boolean) as { id: string; title: string; level: number }[];

  return (
    <div ref={containerRef} className="min-h-screen bg-transparent text-[var(--foreground)] transition-colors duration-300">
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
        {/* Left Dynamic Sticky Track for ArticleTOC — 0 impact on main width, moves with page */}
        <div className="absolute -left-64 top-28 bottom-20 w-56 pointer-events-none">
          <div className="sticky top-28 pointer-events-auto">
            <ArticleTOC items={tocItems} />
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/notes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A5551] dark:text-[#9EB3A4] hover:text-[#36513B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回随笔列表</span>
          </Link>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-[var(--border-line-color)] bg-[var(--surface)]/90 px-3 text-xs font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-green)]/40"
            >
              <Share2 className="size-3.5 text-[var(--accent-green)]" aria-hidden="true" />
              <span className="hidden sm:inline">分享</span>
            </button>

            {/* Font Size Adjuster Controls */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#1E2721] p-1 rounded-2xl border border-[#2D2B2C]/8 dark:border-white/10 shadow-2xs">
            <Type className="w-3.5 h-3.5 text-[#7A736A] ml-2 mr-1" />
            <button
              onClick={() => setFontSizeLevel("sm")}
              aria-pressed={fontSizeLevel === "sm"}
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
              aria-pressed={fontSizeLevel === "base"}
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
              aria-pressed={fontSizeLevel === "lg"}
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
        </div>

        {savedProgress > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border-line-color)] bg-[var(--surface)]/88 px-4 py-3 text-sm shadow-[0_8px_24px_rgba(51,72,58,0.05)] backdrop-blur-sm sm:px-5">
            <div className="flex items-center gap-2.5 text-[var(--muted)]">
              <Bookmark className="size-4 text-[var(--accent-green)]" aria-hidden="true" />
              <span>上次读到 {savedProgress}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resumeReading}
                className="rounded-full bg-[var(--accent-green)] px-3.5 py-1.5 text-xs font-semibold text-[#F0F5F1] transition-transform hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none"
              >
                继续阅读
              </button>
              <button
                type="button"
                onClick={dismissResume}
                aria-label="关闭继续阅读提示"
                className="rounded-full p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

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
            <ArticleMarkdownRenderer content={note.content} fontSizeLevel={fontSizeLevel} />
          </div>
        </div>

        {/* Previous and next article navigation */}
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

          {relatedNotes.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedNotes.map((relatedNote) => (
                <Link
                  key={relatedNote.id}
                  href={`/notes/${relatedNote.id}`}
                  className="group border-l-2 border-[var(--border-line-color)] px-4 py-2 transition-[border-color,transform] hover:translate-x-1 hover:border-[var(--accent-green)] focus-visible:translate-x-1 focus-visible:border-[var(--accent-green)] focus-visible:outline-none motion-reduce:transition-none"
                >
                  <span className="text-[11px] font-semibold text-[var(--accent-green)]">{relatedNote.category}</span>
                  <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-[var(--foreground)]">{relatedNote.title}</h3>
                  <p className="mt-1 line-clamp-1 text-xs text-[var(--muted)]">{relatedNote.summary}</p>
                </Link>
              ))}
            </div>
          )}

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
