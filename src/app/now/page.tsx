import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpenText,
  Clock3,
  Gamepad2,
  Images,
} from "lucide-react";
import { GALLERY_PHOTOS, NOW_UPDATES, PLAYGROUND_ITEMS } from "@/data/siteContent";
import { getAllNotes } from "@/lib/notes";
import { buildActivityItems } from "./activity.mts";

export const metadata: Metadata = {
  title: "近况",
  description: "查看数字小屋最近新增的笔记、图集与常驻游乐项目。",
  openGraph: {
    title: "近况 | Kasumi 的数字小屋",
    description: "查看数字小屋最近发生的变化。",
  },
};

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00`));
}

export default function NowPage() {
  const notes = getAllNotes();
  const activities = buildActivityItems(notes, GALLERY_PHOTOS, 8);
  const latestDate = activities[0]?.date;
  const statusItems = [
    { label: "笔记", value: notes.length, Icon: BookOpenText },
    { label: "图集", value: GALLERY_PHOTOS.length, Icon: Images },
    { label: "游乐", value: PLAYGROUND_ITEMS.length, Icon: Gamepad2 },
  ];

  return (
    <main className="min-h-[100dvh] bg-transparent px-5 pb-24 pt-28 text-[var(--foreground)] sm:px-8 lg:px-12 lg:pb-32 lg:pt-32">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[var(--accent-green)]">
            <Clock3 className="size-4" strokeWidth={1.8} />
            <span>近况</span>
          </div>
          <h1 className="text-4xl font-light tracking-[-0.04em] sm:text-5xl">
            近况
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            看看最近写下的文字、收进图集的画面，以及仍在开放的小游戏。
          </p>
          <div className="mt-12 border-t border-[var(--border-line-color)]" />
        </header>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.55fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-xs font-semibold text-[var(--accent-green)]">
              小屋状态
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {latestDate ? `最近更新于 ${formatDate(latestDate)}` : "等待第一条更新"}
            </p>

            <dl className="mt-7 grid grid-cols-3 gap-3 rounded-3xl border border-white/70 bg-[var(--surface)]/72 p-4 shadow-[0_16px_45px_rgba(51,72,58,0.08)] backdrop-blur-md dark:border-white/10">
              {statusItems.map(({ label, value, Icon }) => (
                <div key={label} className="min-w-0">
                  <dt className="flex items-center gap-1.5 text-[11px] text-[var(--muted)]">
                    <Icon className="size-3.5" strokeWidth={1.7} />
                    {label}
                  </dt>
                  <dd className="mt-2 text-2xl font-light tracking-[-0.04em]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            {NOW_UPDATES.length > 0 && (
              <section className="mt-6 rounded-3xl border border-white/70 bg-[var(--surface)]/72 p-5 shadow-[0_16px_45px_rgba(51,72,58,0.06)] backdrop-blur-md dark:border-white/10" aria-labelledby="now-update-title">
                <p id="now-update-title" className="text-xs font-semibold text-[var(--accent-green)]">正在做</p>
                <ol className="mt-4 space-y-4">
                  {NOW_UPDATES.slice(0, 3).map((update) => (
                    <li key={`${update.date}-${update.title}`}>
                      <time dateTime={update.date} className="text-[11px] text-[var(--muted)]">{formatDate(update.date)}</time>
                      <h2 className="mt-1 text-sm font-semibold tracking-[-0.02em]">{update.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{update.summary}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </aside>

          <section aria-labelledby="recent-activity-title">
            <h2
              id="recent-activity-title"
              className="text-2xl font-medium tracking-[-0.035em]"
            >
              最近发生
            </h2>

            {activities.length > 0 ? (
              <ol className="mt-4">
                {activities.map((item, index) => (
                  <li key={item.id} className={index === 0 ? "pt-2" : undefined}>
                    <Link
                      href={item.href}
                      className={`group grid min-h-28 gap-5 border-b border-[var(--border-line-color)] outline-none transition-[border-color,transform] hover:border-[var(--accent-green)] focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-[var(--accent-green)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)] active:scale-[0.995] motion-reduce:transition-none sm:grid-cols-[minmax(0,1fr)_8.5rem] ${index === 0 ? "pb-9 pt-5" : "py-7"}`}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
                          <span
                            className={
                              item.kind === "gallery"
                                ? "text-[var(--accent-clay)]"
                                : "text-[var(--accent-green)]"
                            }
                          >
                            {item.kind === "gallery" ? "图集" : "笔记"}
                          </span>
                          <time dateTime={item.date}>{formatDate(item.date)}</time>
                        </div>

                        <h3
                          className={`mt-3 font-medium tracking-[-0.025em] transition-colors group-hover:text-[var(--accent-green)] ${index === 0 ? "text-2xl" : "text-xl"}`}
                        >
                          {item.title}
                        </h3>

                        {item.summary && (
                          <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                            {item.summary}
                          </p>
                        )}

                        <span className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-[var(--accent-green)]">
                          {item.kind === "gallery" ? "查看图集" : "阅读笔记"}
                          <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                        </span>
                      </div>

                      {item.image && (
                        <div className="self-start overflow-hidden rounded-2xl bg-[var(--surface-2)]">
                          <Image
                            src={item.image.src}
                            width={item.image.width}
                            height={item.image.height}
                            sizes="(max-width: 639px) 100vw, 136px"
                            alt={item.image.alt}
                            className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.025] motion-reduce:transition-none"
                          />
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-6 rounded-3xl bg-[var(--surface)]/72 px-6 py-12 text-sm leading-6 text-[var(--muted)] ring-1 ring-[var(--border-line-color)]">
                小屋还没有更新记录，游乐场仍然开放。
              </p>
            )}

            <Link
              href="/playground"
              className="group mt-12 flex min-h-28 items-center justify-between gap-5 rounded-3xl border border-white/70 bg-[var(--surface)]/72 px-6 py-5 outline-none shadow-[0_16px_45px_rgba(51,72,58,0.07)] backdrop-blur-md transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[var(--accent-green)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)] active:scale-[0.99] motion-reduce:transition-none dark:border-white/10"
            >
              <span className="flex min-w-0 items-center gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--accent-green)]">
                  <Gamepad2 className="size-5" strokeWidth={1.7} />
                </span>
                <span>
                  <span className="block text-base font-semibold">继续闲逛</span>
                  <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">
                    小游戏一直在这里，不需要等更新。
                  </span>
                </span>
              </span>
              <ArrowUpRight className="size-4 shrink-0 text-[var(--accent-green)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
