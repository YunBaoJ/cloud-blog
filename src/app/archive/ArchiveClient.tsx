"use client";

import { useState, useRef } from "react";
import Footer from "@/components/Footer";
import type { NoteItem } from "@/lib/notes";
import { Archive, Search, Tag, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface ArchiveClientProps {
  initialNotes: NoteItem[];
}

export default function ArchiveClient({ initialNotes }: ArchiveClientProps) {
  const notesList = initialNotes;
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const mainRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".archive-card-anim", {
      y: 20,
      opacity: 0,
      stagger: 0.05,
      duration: 0.5,
      ease: "power2.out",
      clearProps: "all",
    });
  }, { scope: mainRef, dependencies: [selectedCategory, selectedTag, searchQuery] });

  const categories = ["全部", "代码与思考", "生活与摄影", "前端与设计"];

  const allTags = Array.from(
    new Set(notesList.flatMap((note) => note.tags || []))
  );

  const ALL_CATEGORIES = categories.filter((c) => c !== "全部");
  const ALL_TAGS = allTags;
  const activeCategory = selectedCategory === "全部" ? null : selectedCategory;
  const setActiveCategory = (cat: string | null) => setSelectedCategory(cat ?? "全部");
  const activeTag = selectedTag;
  const setActiveTag = setSelectedTag;

  const filteredNotes = notesList.filter((note: NoteItem) => {
    const matchesCategory = selectedCategory === "全部" || note.category === selectedCategory;
    const matchesTag = !selectedTag || (note.tags && note.tags.includes(selectedTag));
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTag && matchesSearch;
  });

  const notesByYear = filteredNotes.reduce((acc, note) => {
    const year = note.date.split("-")[0] || "2026";
    if (!acc[year]) acc[year] = [];
    acc[year].push(note);
    return acc;
  }, {} as Record<string, NoteItem[]>);

  const years = Object.keys(notesByYear).sort((a, b) => Number(b) - Number(a));
  const grouped = years.map((yr) => [yr, notesByYear[yr]] as [string, NoteItem[]]);

  return (
    <main ref={mainRef} className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,rgba(232,240,248,0.75),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(43,76,111,0.06),transparent_50%)] bg-[#FAF8F5] dark:bg-[#142219] text-[var(--foreground)]">
      {/* Header Section */}
      <section className="relative px-5 pb-9 pt-28 sm:px-8 lg:px-12 lg:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[var(--accent-green)]">
            <Archive className="size-4" strokeWidth={1.8} />
            <span>按年份 · 标签 · 分类归档</span>
            </div>
          <h1 className="text-4xl font-light tracking-[-0.05em] text-[var(--foreground)] sm:text-5xl">
            文章归档
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            全部 {notesList.length} 篇文章按时间轴与分类脉络梳理，点击卡片直达阅读。
          </p>
          </div>

          {/* Search Bar */}
          <div className="relative mt-12 max-w-lg border-t border-[var(--border-line-color)] pt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A736A]" />
            <input
              type="text"
              placeholder="搜索文章标题或摘要…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#2D2B2C]/10 text-sm text-[#2D2B2C] placeholder:text-[#B0A99F] focus:outline-none focus:border-[#36513B]/50 focus:ring-2 focus:ring-[#36513B]/10 transition-all shadow-sm"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 py-12 flex flex-col lg:flex-row gap-10">

        {/* Sidebar — Category & Tag Filters */}
        <aside className="lg:w-64 flex-shrink-0 space-y-8">

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-[#2D2B2C]/8 shadow-xs text-center space-y-1">
              <span className="text-2xl font-extrabold text-[#36513B]">{notesList.length}</span>
              <p className="text-[11px] text-[#7A736A] font-medium">全部文章</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#2D2B2C]/8 shadow-xs text-center space-y-1">
              <span className="text-2xl font-extrabold text-[#8C4A31]">{ALL_CATEGORIES.length}</span>
              <p className="text-[11px] text-[#7A736A] font-medium">内容分类</p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#2D2B2C] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#36513B]" />
              分类筛选
            </h3>
            <div className="space-y-1.5">
              <button
                onClick={() => setActiveCategory(null)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  !activeCategory
                    ? "bg-[#36513B] text-white shadow-sm"
                    : "bg-white hover:bg-[#F4F1EA] text-[#5A5551] border border-[#2D2B2C]/8"
                }`}
              >
                全部分类
              </button>
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-[#36513B] text-white shadow-sm"
                      : "bg-white hover:bg-[#F4F1EA] text-[#5A5551] border border-[#2D2B2C]/8"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Cloud */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#2D2B2C] uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#8C4A31]" />
              标签云
            </h3>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeTag === tag
                      ? "bg-[#8C4A31] text-white shadow-sm"
                      : "bg-[#FAF0EA] text-[#8C4A31] hover:bg-[#8C4A31] hover:text-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* Main Timeline */}
        <section className="flex-1 space-y-12 pb-16">
          {grouped.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <p className="text-4xl">🔍</p>
              <p className="text-[#7A736A] text-base">没有找到匹配的文章，换个关键词试试？</p>
            </div>
          ) : (
            grouped.map(([year, notes]) => (
              <div key={year} className="space-y-4">
                {/* Year Heading */}
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#2B4C6F]" />
                  <h2 className="text-xl font-bold text-[#2D2B2C]">
                    {year} 年
                  </h2>
                  <span className="text-xs font-mono text-[#7A736A] px-2 py-0.5 rounded-full bg-[#E2EBE4]">
                    {notes.length} 篇
                  </span>
                  <div className="flex-1 h-px bg-[#2D2B2C]/10" />
                </div>

                {/* Timeline List */}
                <div className="pl-4 border-l-2 border-[#2D2B2C]/10 space-y-3">
                  {notes.map((note) => (
                    <Link
                      key={note.id}
                      href={`/notes/${note.id}`}
                      className="archive-card-anim group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-white border border-[#2D2B2C]/6 hover:border-[#36513B]/30 hover:shadow-[0_4px_20px_rgba(54,81,59,0.08)] transition-all gap-3"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#7A736A]">
                          <span className="font-mono">{note.date}</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#E2EBE4] text-[#36513B] font-semibold">
                            {note.category}
                          </span>
                          <span className="text-[#B0A99F]">{note.readTime}</span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-[#2D2B2C] group-hover:text-[#36513B] transition-colors leading-snug">
                          {note.title}
                        </h3>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {note.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#FAF0EA] text-[#8C4A31]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#36513B] self-start sm:self-center flex-shrink-0 group-hover:gap-2.5 transition-all">
                        <span>阅读全文</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>

      </div>

      <Footer />
    </main>
  );
}
