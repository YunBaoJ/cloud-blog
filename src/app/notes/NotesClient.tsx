"use client";

import Footer from "@/components/Footer";
import type { NoteItem } from "@/lib/notes";
import { ArrowRight, BookOpen, Clock, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface NotesClientProps {
  initialNotes: NoteItem[];
}

const categories = [
  { label: "全部", value: "全部" },
  { label: "代码", value: "代码与思考" },
  { label: "生活", value: "生活与摄影" },
  { label: "设计", value: "前端与设计" },
];

export default function NotesClient({ initialNotes }: NotesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredNotes = initialNotes.filter((note) => {
    const matchesCategory = selectedCategory === "全部" || note.category === selectedCategory;
    const matchesSearch =
      normalizedQuery.length === 0 ||
      note.title.toLowerCase().includes(normalizedQuery) ||
      note.summary.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-transparent text-[var(--foreground)]">
      <section className="px-5 pb-8 pt-28 sm:px-8 lg:px-12 lg:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between gap-8 border-b border-[var(--border-line-color)] pb-10">
            <div className="max-w-3xl">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-[var(--accent-green)]">
                <BookOpen className="size-4" strokeWidth={1.8} aria-hidden="true" />
                <span>随笔笔记</span>
              </div>
              <h1 className="text-4xl font-light tracking-[-0.05em] text-[var(--foreground)] sm:text-5xl">
                随笔笔记
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base sm:leading-7">
                记录技术实践、设计观察与日常灵感，慢慢整理成一份持续生长的个人杂志。
              </p>
            </div>
            <span className="hidden shrink-0 pb-1 text-sm text-[var(--muted)] sm:block">
              共 {initialNotes.length} 篇
            </span>
          </div>

          <div className="mx-auto flex max-w-[68.75rem] flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
            <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 md:w-auto" aria-label="文章分类">
              {categories.map((category) => {
                const isActive = selectedCategory === category.value;

                return (
                  <button
                    key={category.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-[color,background-color,border-color,transform] duration-200 active:translate-y-px motion-reduce:transition-none ${
                      isActive
                        ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                        : "border-[var(--border-line-color)] bg-[var(--surface)]/70 text-[var(--muted)] hover:border-[var(--accent-green)]/40 hover:text-[var(--foreground)]"
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>

            <label className="relative block w-full md:w-72">
              <span className="sr-only">搜索随笔</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="搜索随笔"
                className="min-h-11 w-full rounded-full border border-[var(--border-line-color)] bg-[var(--surface)]/80 py-2 pl-11 pr-4 text-sm text-[var(--foreground)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--muted)] focus:border-[var(--accent-green)] focus:ring-4 focus:ring-[var(--accent-green)]/10"
              />
            </label>
          </div>
        </div>
      </section>

      <section className="mx-auto min-h-[50vh] max-w-[75rem] px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="mx-auto mb-4 flex max-w-[68.75rem] items-baseline justify-between border-b border-[var(--border-line-color)] pb-3">
          <h2 className="text-xl font-medium tracking-[-0.025em] sm:text-2xl">全部文章</h2>
          <span className="text-xs text-[var(--muted)]">按时间更新</span>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border-line-color)] bg-[var(--surface)]/70 px-6 py-16 text-center">
            <p className="text-lg font-semibold">没有找到文章</p>
            <p className="mt-2 text-sm text-[var(--muted)]">换一个关键词或分类试试。</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("全部");
                setSearchQuery("");
              }}
              className="mt-5 min-h-11 rounded-full bg-[var(--foreground)] px-5 text-sm font-semibold text-[var(--background)] transition-transform active:translate-y-px"
            >
              重置筛选
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredNotes.map((note, index) => {
              const imageOnRight = index % 2 === 1;
              const cardAlignment = [
                "lg:justify-self-start",
                "lg:justify-self-end",
                "lg:justify-self-center",
                "lg:justify-self-start lg:translate-x-6",
              ][index % 4];

              return (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className={`notes-index-card group relative grid w-full max-w-[68.75rem] min-h-[13.5rem] grid-cols-1 overflow-hidden rounded-2xl border border-[var(--border-line-color)] bg-[var(--surface)]/80 shadow-[0_8px_26px_rgba(38,53,42,0.05)] transition-[transform,border-color,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:border-[color:var(--accent-green)]/40 hover:bg-[var(--surface)] hover:shadow-[0_16px_38px_rgba(38,53,42,0.10)] focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-green)]/20 active:translate-y-0 md:h-[13.5rem] md:min-h-[13.5rem] motion-reduce:transition-none motion-reduce:hover:transform-none motion-reduce:focus-visible:transform-none ${cardAlignment} ${
                    imageOnRight
                      ? "md:grid-cols-[minmax(0,1.18fr)_minmax(17rem,0.82fr)]"
                      : "md:grid-cols-[minmax(17rem,0.82fr)_minmax(0,1.18fr)]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 z-20 h-[3px] origin-left scale-x-0 bg-linear-to-r from-[var(--accent-green)] via-[var(--accent-green)] to-[var(--accent-clay)] transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none ${
                      imageOnRight ? "md:origin-right" : ""
                    }`}
                  />

                  <div
                    className={`notes-index-media relative order-1 aspect-video min-h-0 overflow-hidden md:h-[13.5rem] md:aspect-auto md:min-h-[13.5rem] ${
                      imageOnRight ? "md:order-2 md:[clip-path:polygon(6%_0,100%_0,100%_100%,0_100%)]" : "md:[clip-path:polygon(0_0,94%_0,100%_100%,0_100%)]"
                    }`}
                  >
                    <Image
                      fill
                      src={note.coverImage || "/og-cover.jpg"}
                      alt={note.coverAlt || ""}
                      sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1200px) 38vw, 430px"
                      className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.035] group-focus-visible:scale-[1.035] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
                    />
                  </div>

                  <div
                    className={`order-2 flex min-w-0 flex-col justify-center overflow-hidden px-6 py-7 sm:px-8 md:h-[13.5rem] md:px-10 md:py-4 lg:px-12 ${
                      imageOnRight ? "md:order-1" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 text-xs font-semibold text-[var(--accent-green)]">
                      <span className="font-mono tracking-[0.1em] text-[var(--accent-clay)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{note.category}</span>
                      <time dateTime={note.date}>{note.date}</time>
                    </div>

                    <h2 className="mt-2.5 line-clamp-2 text-[1.45rem] font-medium leading-snug tracking-[-0.03em] text-[var(--foreground)] sm:text-[1.65rem]">
                      {note.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)] sm:text-[0.9375rem] md:line-clamp-1">
                      {note.summary}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-6">
                      <span className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)]">
                        <Clock className="size-3.5" strokeWidth={1.7} aria-hidden="true" />
                        {note.readTime}
                      </span>
                      <span className="inline-flex min-h-9 items-center gap-2 text-sm font-semibold text-[var(--foreground)] transition-[gap,color] duration-200 group-hover:gap-3.5 group-hover:text-[var(--accent-green)] group-focus-visible:gap-3.5 group-focus-visible:text-[var(--accent-green)] motion-reduce:transition-none">
                        阅读全文
                        <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
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
