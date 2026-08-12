"use client";

import Footer from "@/components/Footer";
import type { NoteItem } from "@/lib/notes";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, Search, Code2, Camera, Sparkles, Calendar, Clock, Heart, Tag, ArrowRight } from "lucide-react";

interface NotesClientProps {
  initialNotes: NoteItem[];
}

export default function NotesClient({ initialNotes }: NotesClientProps) {
  const notesList = initialNotes;
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [likedNotes, setLikedNotes] = useState<Record<string, boolean>>({});

  const categories = ["全部", "代码与思考", "生活与摄影", "前端与设计"];

  // Collect all unique tags
  const allTags = Array.from(
    new Set(notesList.flatMap((note) => note.tags || []))
  );

  const filteredNotes = notesList.filter((note: NoteItem) => {
    const matchesCategory = selectedCategory === "全部" || note.category === selectedCategory;
    const matchesTag = !selectedTag || (note.tags && note.tags.includes(selectedTag));
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTag && matchesSearch;
  });

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

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_20%,rgba(226,235,228,0.75),transparent_60%),radial-gradient(circle_at_90%_80%,rgba(54,81,59,0.06),transparent_50%)] bg-[#FAF8F4] dark:bg-[#142219] text-[var(--foreground)]">
      {/* Page Header */}
      <section className="relative px-5 pb-9 pt-28 sm:px-8 lg:px-12 lg:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[var(--accent-green)]">
              <BookOpen className="size-4" strokeWidth={1.8} />
            <span>随笔笔记与长文 ({notesList.length} 篇)</span>
            </div>
          
          <h1 className="break-words text-4xl font-light tracking-[-0.05em] text-[var(--foreground)] sm:text-5xl">
            随笔笔记
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            记录针对前端技术架构、并发模型思考、深度阅读与生活光影的长文与随手笔记。点击可进入专属文章页面阅读。
          </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-12 border-t border-[var(--border-line-color)] pt-4 space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Category Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedTag(null);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      selectedCategory === cat && !selectedTag
                        ? "bg-[#36513B] text-white shadow-sm"
                        : "bg-white/80 text-[#5A5551] hover:bg-white hover:text-[#2D2B2C] border border-[#2D2B2C]/8"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A736A]" />
                <input
                  type="text"
                  placeholder="搜索笔记标题或内容..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/90 border border-[#2D2B2C]/10 text-xs text-[#2D2B2C] placeholder-[#7A736A] focus:outline-none focus:ring-2 focus:ring-[#36513B]/30 transition-all"
                />
              </div>
            </div>

            {/* Tag Cloud Filter */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-semibold text-[#7A736A] flex items-center gap-1 mr-1">
                <Tag className="w-3 h-3 text-[#36513B]" /> 热门标签:
              </span>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all ${
                    selectedTag === tag
                      ? "bg-[#8C4A31] text-white shadow-xs"
                      : "bg-white/60 text-[#7A736A] hover:bg-white hover:text-[#2D2B2C] border border-[#2D2B2C]/5"
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-xs text-[#8C4A31] hover:underline ml-2"
                >
                  清除标签筛选
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Notes Grid */}
      <section className="py-12 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto min-h-[50vh]">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-20 space-y-3 bg-white/60 rounded-3xl border border-[#2D2B2C]/5">
            <p className="text-lg font-semibold text-[#5A5551]">未找到匹配的随笔笔记</p>
            <p className="text-xs text-[#7A736A]">请尝试更换搜索关键词或选择其他分类。</p>
            <button
              onClick={() => {
                setSelectedCategory("全部");
                setSelectedTag(null);
                setSearchQuery("");
              }}
              className="mt-2 px-5 py-2 rounded-full bg-[#36513B] text-white text-xs font-semibold"
            >
              重置所有筛选
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredNotes.map((note: NoteItem) => {
              const isLiked = likedNotes[note.id];
              return (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="group relative bg-white/90 backdrop-blur-xs rounded-3xl p-6 border border-white/90 shadow-[0_4px_24px_rgba(45,43,44,0.04)] hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(45,43,44,0.08)] hover:border-[#36513B]/25 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header Pill & Category */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/90 border border-white/60 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                        {getIcon(note.iconName)}
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#36513B] border border-white/80">
                        {note.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-bold text-[#2D2B2C] group-hover:text-[#36513B] transition-colors line-clamp-2 mb-2.5 leading-snug">
                      {note.title}
                    </h2>

                    {/* Summary */}
                    <p className="text-sm text-[#5A5551] line-clamp-3 leading-relaxed mb-4 font-normal">
                      {note.summary}
                    </p>

                    {/* Tags List */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {note.tags?.map((t) => (
                        <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F4F1EA] text-[#7A736A]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Info */}
                  <div className="pt-4 border-t border-[#2D2B2C]/5 flex items-center justify-between text-xs text-[#7A736A]">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#7A736A]" />
                        {note.date}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-[#7A736A]" />
                        {note.readTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleLike(note.id, e)}
                        className="flex items-center gap-1 hover:text-[#8C4A31] transition-colors"
                        title="喜欢"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-[#8C4A31] text-[#8C4A31]" : ""}`} />
                        <span>{(note.likes || 90) + (isLiked ? 1 : 0)}</span>
                      </button>

                      <span className="inline-flex items-center text-[#36513B] font-semibold group-hover:translate-x-0.5 transition-transform">
                        阅读 <ArrowRight className="w-3 h-3 ml-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
