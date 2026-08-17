import type { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowLeft, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Code2, 
  Database, 
  Server, 
  ExternalLink,
  BookOpen,
  Sparkles,
  MonitorSmartphone 
} from "lucide-react";
import { DORMITORY_SYSTEM_PROJECT } from "@/data/projects";
import ProjectScreenshotGallery from "./ProjectScreenshotGallery";
import SystemArchitectureDiagrams from "./SystemArchitectureDiagrams";

export const metadata: Metadata = {
  title: "智慧宿舍管理系统 | 案例研究",
  description:
    "面向高校三端角色的宿舍综合管理系统，基于 Spring Boot 3 与 Vue 3 的全栈工程实践与架构设计。",
  openGraph: {
    title: "智慧宿舍管理系统 · 案例研究 | Cloud 的数字小屋",
    description:
      "面向高校三端角色的宿舍综合管理系统，基于 Spring Boot 3 与 Vue 3 的全栈工程实践与架构设计。",
  },
};

export default function DormitorySystemPage() {
  const project = DORMITORY_SYSTEM_PROJECT;

  return (
    <main className="min-h-screen bg-transparent py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 1. Header Navigation & Title */}
        <header className="space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent-green)] transition-colors group"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            <span>返回主页</span>
          </Link>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E2EBE4] dark:bg-[#23382C] px-3 py-1 text-xs font-semibold text-[#36513B] dark:text-[#7CD090]">
                <Layers className="size-3.5" />
                <span>全栈工程案例</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-medium text-[var(--muted)] border border-[var(--border-line-color)]">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{project.status}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--foreground)]">
              {project.title}
            </h1>
            <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-[var(--muted)]">
              {project.summary}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[var(--border-line-color)]">
              <div>
                <span className="block text-[11px] font-mono text-[var(--muted)] uppercase tracking-wider">前端技术栈</span>
                <span className="text-sm font-bold text-[var(--foreground)]">Vue 3 + Vite + Element+</span>
              </div>
              <div>
                <span className="block text-[11px] font-mono text-[var(--muted)] uppercase tracking-wider">后端架构</span>
                <span className="text-sm font-bold text-[var(--foreground)]">Spring Boot 3 + Java 17</span>
              </div>
              <div>
                <span className="block text-[11px] font-mono text-[var(--muted)] uppercase tracking-wider">数据库持久化</span>
                <span className="text-sm font-bold text-[var(--foreground)]">MySQL 8.0 + MyBatis+</span>
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
                <span>交互界面实景 (26 张全量页面)</span>
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

        {/* 3. Deep Architecture & Sequence Diagrams */}
        <section aria-labelledby="architecture-diagrams-title">
          <SystemArchitectureDiagrams />
        </section>

        {/* 4. Deep Tech Article Promo Banner */}
        <section className="rounded-3xl border border-[var(--border-line-color)] bg-[var(--surface)] p-6 sm:p-10 shadow-sm relative overflow-hidden group">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-green)]">
                <BookOpen className="size-4" />
                <span>技术随笔沉淀</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                从零构建智慧宿舍管理系统：架构设计与实战权衡
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                详细拆解 Spring Boot 3 与 Vue 3 的前后端工程实践、RBAC 细粒度权限控制、双向 Token 校验机制与状态机审批流实现。
              </p>
            </div>
            <Link
              href="/notes/dormitory-system-architecture"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--accent-green)] text-white text-xs font-bold shadow-md hover:brightness-95 active:scale-[0.98] transition-all shrink-0"
            >
              <span>阅读深度长文</span>
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </section>

        {/* 5. System Architecture Layers */}
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

        {/* 6. Core Workflows Matrix */}
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

        {/* 7. Bottom Navigation Bar */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-[var(--border-line-color)]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent-green)] transition-colors group"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            <span>返回主页</span>
          </Link>

          <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
            <span>最后更新：2026年3月</span>
            <span>·</span>
            <span>Cloud 的数字小屋</span>
          </div>
        </footer>

      </div>
    </main>
  );
}
