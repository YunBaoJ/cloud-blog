import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Layers3, MonitorSmartphone } from "lucide-react";
import { DORMITORY_SYSTEM_PROJECT } from "@/data/projects";
import ProjectScreenshotGallery, { ProjectScreenshotPreview } from "./ProjectScreenshotGallery";

export default function DormitorySystemProjectPage() {
  const project = DORMITORY_SYSTEM_PROJECT;
  return (
    <main className="min-h-[100dvh] bg-transparent px-5 pb-24 pt-28 text-[var(--foreground)] sm:px-8 lg:px-12 lg:pb-32 lg:pt-32">
      <div className="mx-auto max-w-6xl">
        <header className="grid gap-10 border-b border-[var(--border-line-color)] pb-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-end lg:gap-16">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[var(--accent-green)]">
              <Layers3 className="size-4" strokeWidth={1.8} aria-hidden="true" />
              <span>项目案例</span>
            </div>
            <h1 className="mt-5 text-4xl font-light tracking-[-0.05em] sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
              {project.summary}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="rounded-full bg-[var(--surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-green)] ring-1 ring-[var(--border-line-color)]">
                {project.status}
              </span>
            </div>
          </div>
          <figure className="overflow-hidden rounded-[1.5rem] bg-[var(--surface)] ring-1 ring-[var(--border-line-color)] shadow-[0_18px_50px_rgba(45,43,44,0.08)]">
            <ProjectScreenshotPreview screenshot={project.screenshots[0]} priority>
              <Image
                src={project.screenshots[0].src}
                alt={project.screenshots[0].alt}
                width={project.screenshots[0].width}
                height={project.screenshots[0].height}
                priority
                sizes="(max-width: 1023px) 100vw, 55vw"
                className="h-auto w-full"
              />
            </ProjectScreenshotPreview>
          </figure>
        </header>

        <section className="pt-14 sm:pt-18" aria-labelledby="project-screenshots-title">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[var(--accent-green)]">
                <MonitorSmartphone className="size-4" strokeWidth={1.8} aria-hidden="true" />
                <span>界面记录</span>
              </div>
              <h2 id="project-screenshots-title" className="mt-3 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                从登录到三类工作台
              </h2>
            </div>
            <p className="hidden text-right text-xs leading-5 text-[var(--muted-foreground)] sm:block">
              本地开发环境截图，示例姓名已脱敏
            </p>
          </div>

          <ProjectScreenshotGallery screenshots={project.screenshots} featured={false} />
          <p className="mt-4 text-xs leading-5 text-[var(--muted-foreground)] sm:hidden">
            本地开发环境截图，示例姓名已脱敏
          </p>
        </section>

        <section className="mt-20 border-y border-[var(--border-line-color)] py-10" aria-labelledby="project-architecture-title">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold tracking-wide text-[var(--accent-green)]">系统结构</p>
            <h2 id="project-architecture-title" className="mt-3 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
              前后端分离的三层实现
            </h2>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[repeat(3,minmax(0,1fr))] lg:gap-10">
            {project.architecture.map((layer, index) => (
              <div key={layer.title} className="relative pr-8 last:pr-0">
                <p className="text-sm font-semibold text-[var(--foreground)]">{layer.title}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{layer.description}</p>
                {index < project.architecture.length - 1 ? (
                  <ArrowRight className="absolute right-0 top-1 hidden size-4 text-[var(--accent-apricot)] lg:block" strokeWidth={1.8} aria-hidden="true" />
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-20 grid gap-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:gap-24">
          <section aria-labelledby="project-workflows-title">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[var(--accent-green)]">
              <span>功能梳理</span>
            </div>
            <h2 id="project-workflows-title" className="mt-3 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
              已实现内容
            </h2>
            <div className="mt-8 divide-y divide-[var(--border-line-color)] border-y border-[var(--border-line-color)]">
              {project.workflows.map((workflow, index) => (
                <div key={workflow.title} className="grid gap-3 py-6 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-6">
                  <span className="text-xs font-semibold tracking-wide text-[var(--accent-apricot)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.02em]">{workflow.title}</h3>
                    <p className="mt-2 max-w-[52ch] text-sm leading-7 text-[var(--muted-foreground)]">
                      {workflow.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="self-start rounded-[1.5rem] bg-[var(--surface)] p-7 ring-1 ring-[var(--border-line-color)] sm:p-8">
            <p className="text-[11px] font-semibold tracking-wide text-[var(--accent-green)]">技术实现</p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">{project.stack.join(" · ")}</p>
            <div className="mt-8 border-t border-[var(--border-line-color)] pt-6">
              <p className="text-[11px] font-semibold tracking-wide text-[var(--accent-green)]">当前进展</p>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">{project.currentFocus}</p>
            </div>
            <div className="mt-8 border-t border-[var(--border-line-color)] pt-6">
              <p className="text-[11px] font-semibold tracking-wide text-[var(--accent-green)]">本人负责</p>
              <ul className="mt-3 space-y-3 text-sm leading-7 text-[var(--foreground)]">
                {project.responsibilities.map((responsibility) => (
                  <li key={responsibility}>{responsibility}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <div className="mt-20 border-t border-[var(--border-line-color)] pt-8">
          <Link
            href="/about"
            className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold outline-none transition-colors duration-200 hover:text-[var(--accent-green)] focus-visible:text-[var(--accent-green)] focus-visible:ring-2 focus-visible:ring-[var(--accent-green)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)] motion-reduce:transition-none"
          >
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transition-none" strokeWidth={1.8} aria-hidden="true" />
            返回关于页
          </Link>
        </div>
      </div>
    </main>
  );
}
