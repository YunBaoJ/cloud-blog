import type { Metadata } from "next";
import ProjectArchiveStack from "@/components/ProjectArchiveStack";
import { PROJECT_ARCHIVE_ITEMS } from "@/data/projects";

export const metadata: Metadata = {
  title: "项目档案",
  description: "已完成案例与后续实践计划的个人项目档案。",
};

export default function ProjectsPage() {
  return (
    <main className="min-h-[100dvh] bg-transparent text-[var(--foreground)]">
      <section className="px-5 pb-24 pt-28 sm:px-8 lg:px-12 lg:pb-32 lg:pt-32">
        <div className="mx-auto max-w-6xl">
          <header className="border-b border-[var(--border-line-color)] pb-10">
            <h1 className="inner-page-title"><span className="inner-page-title__lead">项目</span><span className="inner-page-title__rest">档案</span></h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
              只保留已经完成、正在推进或尚待记录的真实项目。未公开的内容不会伪装成案例。
            </p>
          </header>

          <section className="py-16" aria-labelledby="project-archive-list">
            <h2 id="project-archive-list" className="sr-only">项目列表</h2>
            <ProjectArchiveStack items={PROJECT_ARCHIVE_ITEMS} variant="index" />
          </section>
        </div>
      </section>
    </main>
  );
}
