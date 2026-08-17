"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers3, Server, Database, ShieldCheck, Sparkles } from "lucide-react";
import { DORMITORY_SYSTEM_PROJECT } from "@/data/projects";

export default function ProjectTeaser() {
  const project = DORMITORY_SYSTEM_PROJECT;
  const primaryShot = project.screenshots[1] || project.screenshots[0]; // admin overview

  return (
    <section className="w-full bg-transparent px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-green)]/20 bg-[var(--accent-green)]/10 px-3 py-1 text-xs font-semibold text-[var(--accent-green)] dark:text-[#7CD090]">
              <Layers3 className="size-3.5" />
              <span>精选工程案例</span>
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl lg:text-4xl">
              真实全栈业务系统
            </h2>
          </div>
          <Link
            href="/projects/dormitory-system"
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-green)] dark:text-[#7CD090] transition-colors hover:text-[var(--accent-clay)]"
          >
            <span>探索完整架构与设计细节</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Big Showcase Hero Banner */}
        <div className="group relative overflow-hidden rounded-[2rem] border border-[var(--border-line-color)] bg-gradient-to-br from-[#23382C] via-[#1E2E25] to-[#17241D] p-6 text-[#F6F4EC] shadow-[0_20px_50px_rgba(20,34,25,0.18)] transition-all duration-300 hover:shadow-[0_28px_70px_rgba(20,34,25,0.28)] sm:p-10 lg:p-12">
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(124,208,144,0.18)_0%,transparent_70%)]" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(217,134,95,0.14)_0%,transparent_70%)]" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
            {/* Left Info Column */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 font-semibold text-[#E4E9DD] backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-[#7CD090] animate-pulse" />
                  {project.status}
                </span>
                <span className="rounded-full border border-white/15 bg-white/6 px-3 py-1 text-[#D2DFD5] backdrop-blur-md">
                  Spring Boot 3 + Vue 3
                </span>
                <span className="rounded-full border border-white/15 bg-white/6 px-3 py-1 text-[#D2DFD5] backdrop-blur-md">
                  RBAC 三权分立
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl leading-tight">
                  {project.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#D2DFD5] sm:text-base">
                  {project.summary}
                </p>
              </div>

              {/* 3 Key Feature Points */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2">
                <div className="rounded-2xl border border-white/10 bg-white/6 p-3.5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#7CD090]">
                    <ShieldCheck className="size-4" />
                    <span>三端工作台</span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#C2CDC5] leading-normal">
                    管理员、宿管员与学生端独立权限流
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/6 p-3.5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#E5987D]">
                    <Server className="size-4" />
                    <span>RESTful API</span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#C2CDC5] leading-normal">
                    Spring Boot 统一异常与鉴权拦截
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/6 p-3.5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#8EB8E5]">
                    <Database className="size-4" />
                    <span>数据全闭环</span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#C2CDC5] leading-normal">
                    宿舍分配、报修审批、访客留痕
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  href="/projects/dormitory-system"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#FAF7F2] px-6 py-3 text-xs sm:text-sm font-bold text-[#1E2E25] shadow-lg transition-all duration-200 hover:bg-white hover:scale-105 active:scale-95"
                >
                  <Sparkles className="size-4 text-[var(--accent-clay)]" />
                  <span>查看交互式系统案例与截图</span>
                  <ArrowRight className="size-4 text-[#1E2E25] transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Mockup Preview Column */}
            <div className="relative group/mockup">
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-[#141F18]/90 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-[1.02]">
                {/* Simulated macOS Window Header */}
                <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#FF5F56]/80" />
                    <span className="h-3 w-3 rounded-full bg-[#FFBD2E]/80" />
                    <span className="h-3 w-3 rounded-full bg-[#27C93F]/80" />
                  </div>
                  <span className="font-mono text-[11px] text-white/50">
                    localhost:8080/admin/dashboard
                  </span>
                  <div className="w-10" />
                </div>

                {/* Screenshot Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60">
                  <Image
                    src={primaryShot.src}
                    alt={primaryShot.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover object-top transition-transform duration-700 group-hover/mockup:scale-105"
                  />
                  {/* Subtle glass reflection */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
                </div>
              </div>

              {/* Decorative Corner Badge */}
              <div className="absolute -bottom-3 -right-3 hidden sm:flex items-center gap-2 rounded-xl border border-white/20 bg-black/60 px-3.5 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-[#7CD090]" />
                <span>Vue 3 Element Plus</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
