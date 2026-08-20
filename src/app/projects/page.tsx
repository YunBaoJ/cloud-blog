import type { Metadata } from "next";
import { Layers3 } from "lucide-react";
import ProjectArchiveStack from "@/components/ProjectArchiveStack";
import { PROJECT_ARCHIVE_ITEMS } from "@/data/projects";

export const metadata: Metadata = {
  title: "项目档案",
  description: "已完成案例与后续实践计划的个人项目档案。",
};

export default function ProjectsPage() {
  const publishedCount = PROJECT_ARCHIVE_ITEMS.filter((item) => item.status === "开发中").length;
  const planningCount = PROJECT_ARCHIVE_ITEMS.length - publishedCount;

  return (
    <main className="min-h-screen bg-transparent px-4 py-28 sm:px-6 sm:py-36 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-[var(--border-line-color)] pb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E2EBE4] px-3.5 py-1 text-xs font-semibold text-[#36513B] dark:bg-[#23382C] dark:text-[#7CD090]">
            <Layers3 className="size-3.5" aria-hidden="true" />
            项目档案
          </div>
          <div className="mt-5 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">正在做的事</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                只保留已经完成、正在推进或尚待记录的真实项目。未公开的内容不会伪装成案例。
              </p>
            </div>
            <p className="text-xs font-medium text-[var(--muted)]">{publishedCount} 个案例 · {planningCount} 项后续记录</p>
          </div>
        </header>

        <section className="py-12" aria-labelledby="project-archive-list">
          <h2 id="project-archive-list" className="sr-only">项目列表</h2>
          <ProjectArchiveStack items={PROJECT_ARCHIVE_ITEMS} variant="index" />
        </section>
      </div>
    </main>
  );
}
