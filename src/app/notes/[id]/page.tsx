import Footer from "@/components/Footer";
import ReadingProgress from "@/components/ReadingProgress";
import { FEATURED_NOTES } from "@/data/mockData";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Eye, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

// Inline Markdown Parser for **bold**, *italic*, and `inline code`
function renderFormattedInlineText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-bold text-[#2D2B2C]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={index} className="italic text-[#36513B]">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-[#E2EBE4] text-[#36513B] font-mono text-xs font-semibold mx-0.5"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
// Custom Markdown to HTML Converter Component for Clean Rich Typography
function ArticleMarkdownRenderer({ content }: { content: string }) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];

  lines.forEach((line, idx) => {
    // Code block toggle
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        // Close code block
        elements.push(
          <div key={`code-${idx}`} className="my-6 rounded-2xl bg-[#1E2721] p-5 sm:p-6 border border-white/10 overflow-x-auto shadow-md">
            <pre className="font-mono text-xs sm:text-sm text-[#E2EBE4] leading-relaxed">
              <code>{codeBuffer.join("\n")}</code>
            </pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    const trimmed = line.trim();

    if (!trimmed) {
      return;
    }

    // Headings with IDs for TOC scrolling
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 id={`heading-${idx}`} key={idx} className="text-xl sm:text-2xl font-bold text-[#2D2B2C] pt-6 pb-2 border-b border-[#2D2B2C]/8 scroll-mt-28">
          {renderFormattedInlineText(trimmed.replace("### ", ""))}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 id={`heading-${idx}`} key={idx} className="text-2xl sm:text-3xl font-bold text-[#2D2B2C] pt-8 pb-3 border-b border-[#2D2B2C]/10 flex items-center gap-2 scroll-mt-28">
          <span className="w-2.5 h-6 bg-[#36513B] rounded-full inline-block" />
          {renderFormattedInlineText(trimmed.replace("## ", ""))}
        </h2>
      );
    } else if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 id={`heading-${idx}`} key={idx} className="text-3xl sm:text-4xl font-bold text-[#2D2B2C] pt-10 pb-4 scroll-mt-28">
          {renderFormattedInlineText(trimmed.replace("# ", ""))}
        </h1>
      );
    }
    // Blockquote
    else if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote key={idx} className="my-6 p-5 sm:p-6 rounded-2xl bg-[#F4F1EA] border-l-4 border-[#36513B] italic text-base sm:text-lg text-[#3A3839] shadow-2xs">
          {renderFormattedInlineText(trimmed.replace("> ", ""))}
        </blockquote>
      );
    }
    // Horizontal Rule
    else if (trimmed === "---") {
      elements.push(<hr key={idx} className="my-8 border-[#2D2B2C]/10" />);
    }
    // List item
    else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      elements.push(
        <li key={idx} className="ml-6 list-disc text-base sm:text-lg text-[#3A3839] leading-relaxed my-1.5">
          {renderFormattedInlineText(trimmed.substring(2))}
        </li>
      );
    }
    // Standard Paragraph
    else {
      elements.push(
        <p key={idx} className="text-base sm:text-lg text-[#3A3839] leading-relaxed my-4 font-serif">
          {renderFormattedInlineText(trimmed)}
        </p>
      );
    }
  });

  return <div className="space-y-2">{elements}</div>;
}

export default async function NoteDetailPage({ params }: NotePageProps) {
  const { id } = await params;
  const note = FEATURED_NOTES.find((n) => n.id === id);

  if (!note) {
    notFound();
  }

  // Find adjacent notes for navigation
  const currentIndex = FEATURED_NOTES.findIndex((n) => n.id === id);
  const prevNote = currentIndex > 0 ? FEATURED_NOTES[currentIndex - 1] : null;
  const nextNote = currentIndex < FEATURED_NOTES.length - 1 ? FEATURED_NOTES[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2D2B2C]">
      <ReadingProgress />

      {/* Article Header Hero */}
      <article className="relative pt-32 pb-16 px-6 sm:px-12 lg:px-20 border-b border-[#2D2B2C]/8 bg-gradient-to-b from-[#E2EBE4]/35 via-[#FAF7F2] to-[#FAF7F2]">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7A736A]">
            <Link href="/notes" className="hover:text-[#36513B] inline-flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              随笔笔记
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#7A736A]/50" />
            <span className="text-[#36513B]">{note.category}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2D2B2C] leading-tight">
            {note.title}
          </h1>

          {/* Author Persona Info & Meta Specs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#2D2B2C]/8">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#36513B]/20">
                <Image
                  src="/my-avatar.jpg"
                  alt="云归何处 Avatar"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#2D2B2C]">云归何处</h4>
                <p className="text-xs text-[#7A736A] font-mono">全栈开发者 · 光影记录者</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-[#7A736A]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#36513B]" />
                {note.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#8C4A31]" />
                {note.readTime}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                {note.views} 次阅读
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {note.tags?.map((t) => (
              <span key={t} className="px-3 py-1 rounded-full bg-white text-[#7A736A] text-xs font-mono border border-[#2D2B2C]/8 shadow-2xs">
                {t}
              </span>
            ))}
          </div>

        </div>
      </article>

      {/* Main Article Body — Original Max-W-6xl Expanded Reading Card */}
      <section className="py-10 pb-16 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto space-y-12">
        <div className="w-full bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-14 md:p-16 border border-white shadow-[0_8px_32px_rgba(45,43,44,0.04)]">
          <ArticleMarkdownRenderer content={note.content} />
        </div>

        {/* Masterclass Next / Previous Article Navigation Section */}
        <div className="space-y-6 pt-4">
          
          {/* Eyebrow Header */}
          <div className="flex items-center justify-between border-b border-[#2D2B2C]/10 pb-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#36513B] tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#8C4A31]" />
              <span>延伸阅读与探索</span>
            </div>
            <Link
              href="/notes"
              className="text-xs font-semibold text-[#7A736A] hover:text-[#36513B] inline-flex items-center gap-1 transition-colors"
            >
              <span>浏览全部 24 篇笔记</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Navigation Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {prevNote ? (
              <Link
                href={`/notes/${prevNote.id}`}
                className="group relative p-6 rounded-3xl bg-white/80 hover:bg-[#FAF0EA]/60 backdrop-blur-md border border-[#2D2B2C]/8 hover:border-[#8C4A31]/30 shadow-[0_4px_20px_rgba(45,43,44,0.03)] hover:shadow-[0_12px_32px_rgba(140,74,49,0.12)] transition-all duration-300 flex items-center justify-between gap-5"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#FAF0EA] border border-[#8C4A31]/20 flex items-center justify-center text-[#8C4A31] flex-shrink-0 group-hover:-translate-x-1.5 transition-transform">
                  <ChevronLeft className="w-5 h-5" />
                </div>

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-[#8C4A31] uppercase tracking-wider">
                      ← 上一篇
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8C4A31]/10 text-[#8C4A31] font-medium">
                      {prevNote.category}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#2D2B2C] group-hover:text-[#8C4A31] transition-colors truncate leading-snug">
                    {prevNote.title}
                  </h4>
                </div>
              </Link>
            ) : <div />}

            {nextNote ? (
              <Link
                href={`/notes/${nextNote.id}`}
                className="group relative p-6 rounded-3xl bg-white/80 hover:bg-[#E2EBE4]/60 backdrop-blur-md border border-[#2D2B2C]/8 hover:border-[#36513B]/30 shadow-[0_4px_20px_rgba(45,43,44,0.03)] hover:shadow-[0_12px_32px_rgba(54,81,59,0.12)] transition-all duration-300 flex items-center justify-between gap-5 text-right"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#36513B]/10 text-[#36513B] font-medium">
                      {nextNote.category}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#36513B] uppercase tracking-wider">
                      下一篇 →
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#2D2B2C] group-hover:text-[#36513B] transition-colors truncate leading-snug">
                    {nextNote.title}
                  </h4>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-[#E2EBE4] border border-[#36513B]/20 flex items-center justify-center text-[#36513B] flex-shrink-0 group-hover:translate-x-1.5 transition-transform">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </Link>
            ) : <div />}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
