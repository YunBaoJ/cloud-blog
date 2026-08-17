import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Layers3, MonitorSmartphone, Server, Database, ShieldCheck, Cpu, Code2, CheckCircle2, Sparkles } from "lucide-react";
import { DORMITORY_SYSTEM_PROJECT } from "@/data/projects";
import ProjectScreenshotGallery from "./ProjectScreenshotGallery";

export default function DormitorySystemProjectPage() {
  const project = DORMITORY_SYSTEM_PROJECT;

  return (
    <main className="min-h-[100dvh] bg-transparent px-4 pb-24 pt-28 text-[var(--foreground)] sm:px-8 lg:px-12 lg:pb-32 lg:pt-32">
      <div className="mx-auto max-w-6xl space-y-16 sm:space-y-24">
        
        {/* Top Navigation Back */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent-green)] transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>返回数字小屋首页</span>
          </Link>
        </div>

        {/* 1. Project Hero Header */}
        <header className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border-line-color)] bg-[var(--surface)]/80 p-8 sm:p-12 lg:p-16 shadow-[0_20px_60px_rgba(45,43,44,0.06)] backdrop-blur-xl">
          {/* Ambient Background Aura */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(54,81,59,0.12)_0%,transparent_70%)]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(140,74,49,0.10)_0%,transparent_70%)]" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-green)]/30 bg-[var(--accent-green)]/10 px-3.5 py-1 text-xs font-semibold text-[var(--accent-green)]">
                <Layers3 className="size-3.5" />
                <span>工程实战案例</span>
              </span>
              <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-medium text-[var(--muted)] border border-[var(--border-line-color)]">
                {project.status}
              </span>
              <span className="rounded-full bg-[#E2EBE4] dark:bg-[#23382C] px-3 py-1 text-xs font-semibold text-[#36513B] dark:text-[#7CD090]">
                RBAC 权限体系
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--foreground)] leading-tight">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-[var(--muted)]">
              {project.summary}
            </p>

            {/* Quick Tech Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[var(--border-line-color)]">
              <div>
                <span className="block text-[11px] font-mono text-[var(--muted)] uppercase tracking-wider">前端技术栈</span>
                <span className="text-sm font-bold text-[var(--foreground)]">Vue 3 + Element Plus</span>
              </div>
              <div>
                <span className="block text-[11px] font-mono text-[var(--muted)] uppercase tracking-wider">后端架构</span>
                <span className="text-sm font-bold text-[var(--foreground)]">Spring Boot 3 + Java 17</span>
              </div>
              <div>
                <span className="block text-[11px] font-mono text-[var(--muted)] uppercase tracking-wider">数据库持久化</span>
                <span className="text-sm font-bold text-[var(--foreground)]">MySQL 8.0 + MyBatis</span>
              </div>
              <div>
                <span className="block text-[11px] font-mono text-[var(--muted)] uppercase tracking-wider">工程规范</span>
                <span className="text-sm font-bold text-[var(--foreground)]">RESTful API 契约</span>
              </div>
            </div>
          </div>
        </header>

        {/* 2. Interactive Screenshot Gallery Showcase */}
        <section aria-labelledby="screenshots-title" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-green)]">
                <MonitorSmartphone className="size-4" />
                <span>交互界面实景</span>
              </div>
              <h2 id="screenshots-title" className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[var(--foreground)]">
                三类工作台多视角全景
              </h2>
            </div>
            <p className="text-xs text-[var(--muted)]">
              本地开发真实环境截图 · 姓名及学号等敏感信息已全面脱敏
            </p>
          </div>

          <ProjectScreenshotGallery screenshots={project.screenshots} />
        </section>

        {/* 3. System Architecture Layers */}
        <section aria-labelledby="architecture-title" className="space-y-8 rounded-[2.5rem] border border-[var(--border-line-color)] bg-[var(--surface)]/70 p-8 sm:p-12 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-green)]">
              <Cpu className="size-4" />
              <span>系统架构设计</span>
            </div>
            <h2 id="architecture-title" className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
              前后端分离的三层工程实现
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              清晰解耦的职责边界，为高可用与易维护提供架构支撑
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {project.architecture.map((layer, index) => {
              const icons = [Code2, Server, Database];
              const Icon = icons[index] || Server;
              return (
                <div
                  key={layer.title}
                  className="relative rounded-2xl border border-[var(--border-line-color)] bg-[var(--surface-2)]/60 p-6 space-y-4 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-[var(--accent-green)]/10 text-[var(--accent-green)] flex items-center justify-center">
                      <Icon className="size-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-[var(--accent-clay)]">
                      Layer 0{index + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--accent-green)] transition-colors">
                      {layer.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                      {layer.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Core Workflows Matrix */}
        <section aria-labelledby="workflows-title" className="space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-green)]">
              <ShieldCheck className="size-4" />
              <span>核心业务闭环</span>
            </div>
            <h2 id="workflows-title" className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
              全场景业务流程与权限控制
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {project.workflows.map((workflow, index) => (
              <div
                key={workflow.title}
                className="rounded-2xl border border-[var(--border-line-color)] bg-[var(--surface)] p-6 sm:p-8 space-y-3 shadow-xs hover:border-[var(--accent-green)]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold text-[var(--accent-clay)] font-mono">
                    <CheckCircle2 className="size-4 text-[var(--accent-green)]" />
                    <span>Workflow 0{index + 1}</span>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  {workflow.title}
                </h3>
                <p className="text-xs leading-relaxed text-[var(--muted)]">
                  {workflow.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Bottom Navigation Bar */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-[var(--border-line-color)]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--surface-2)] hover:bg-[var(--surface)] text-xs font-semibold text-[var(--foreground)] border border-[var(--border-line-color)] transition-all shadow-xs"
          >
            <ArrowLeft className="size-4" />
            <span>返回首页</span>
          </Link>

          <Link
            href="/notes"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--accent-green)] hover:bg-[#2A402F] text-xs font-semibold text-white transition-all shadow-md group"
          >
            <Sparkles className="size-4 text-[#7CD090]" />
            <span>阅读技术随笔与架构思考</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </footer>

      </div>
    </main>
  );
}
