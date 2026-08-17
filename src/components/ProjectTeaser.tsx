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
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#36513B]/15 bg-[#E2EBE4] px-3.5 py-1 text-xs font-semibold text-[#36513B] dark:bg-[#23382C] dark:text-[#7CD090] dark:border-white/10">
              <Layers3 className="size-3.5" />
              <span>精选工程案例</span>
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#2D2B2C] dark:text-[#F0F5F1] sm:text-3xl lg:text-4xl">
              真实全栈业务系统
            </h2>
            <p className="mt-2 text-sm text-[#5A5551] dark:text-[#9EB3A4] max-w-xl">
              结合 Spring Boot 3 与 Vue 3 的多角色宿舍日常运营与数据闭环系统。
            </p>
          </div>
          <Link
            href="/projects/dormitory-system"
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#36513B] dark:text-[#7CD090] transition-colors hover:text-[#8C4A31]"
          >
            <span>探索完整架构与设计细节</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Clean Paper Showcase Card */}
        <div className="group relative overflow-hidden rounded-[2rem] border border-[#2D2B2C]/8 dark:border-white/10 bg-white/85 dark:bg-[#1C261F]/85 p-6 shadow-[0_16px_48px_rgba(45,43,44,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_24px_64px_rgba(45,43,44,0.10)] sm:p-10 lg:p-12">
          {/* Subtle Ambient Aura */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(54,81,59,0.06)_0%,transparent_70%)]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(140,74,49,0.05)_0%,transparent_70%)]" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
            {/* Left Info Column */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E2EBE4] dark:bg-[#23382C] px-3 py-1 font-semibold text-[#36513B] dark:text-[#7CD090]">
                  <span className="h-2 w-2 rounded-full bg-[#36513B] dark:bg-[#7CD090] animate-pulse" />
                  {project.status}
                </span>
                <span className="rounded-full bg-[#FAF7F2] dark:bg-[#202E24] px-3 py-1 text-[#5A5551] dark:text-[#9EB3A4] border border-[#2D2B2C]/6 dark:border-white/10">
                  Spring Boot 3 + Vue 3
                </span>
                <span className="rounded-full bg-[#FAF7F2] dark:bg-[#202E24] px-3 py-1 text-[#5A5551] dark:text-[#9EB3A4] border border-[#2D2B2C]/6 dark:border-white/10">
                  RBAC 权限分立
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h3 className="text-2xl font-bold tracking-tight text-[#2D2B2C] dark:text-[#F0F5F1] sm:text-3xl lg:text-4xl leading-tight">
                  {project.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#5A5551] dark:text-[#9EB3A4] sm:text-base">
                  {project.summary}
                </p>
              </div>

              {/* 3 Key Feature Points */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2">
                <div className="rounded-2xl border border-[#2D2B2C]/6 dark:border-white/8 bg-[#FAF7F2] dark:bg-[#23382C]/40 p-4 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#36513B] dark:text-[#7CD090]">
                    <ShieldCheck className="size-4" />
                    <span>三端工作台</span>
                  </div>
                  <p className="mt-1.5 text-xs text-[#5A5551] dark:text-[#9EB3A4] leading-normal">
                    管理员、宿管员与学生端独立权限与视图
                  </p>
                </div>

                <div className="rounded-2xl border border-[#2D2B2C]/6 dark:border-white/8 bg-[#FAF7F2] dark:bg-[#23382C]/40 p-4 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8C4A31] dark:text-[#E5987D]">
                    <Server className="size-4" />
                    <span>RESTful API</span>
                  </div>
                  <p className="mt-1.5 text-xs text-[#5A5551] dark:text-[#9EB3A4] leading-normal">
                    Spring Boot 统一异常捕获与 JWT 鉴权
                  </p>
                </div>

                <div className="rounded-2xl border border-[#2D2B2C]/6 dark:border-white/8 bg-[#FAF7F2] dark:bg-[#23382C]/40 p-4 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#2A5270] dark:text-[#8EB8E5]">
                    <Database className="size-4" />
                    <span>数据全闭环</span>
                  </div>
                  <p className="mt-1.5 text-xs text-[#5A5551] dark:text-[#9EB3A4] leading-normal">
                    宿舍分配、报修审批、访客留痕与账单
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  href="/projects/dormitory-system"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#36513B] hover:bg-[#283E2C] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Sparkles className="size-4 text-[#E2EBE4]" />
                  <span>查看交互式系统案例与界面</span>
                  <ArrowRight className="size-4 text-white transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Mockup Preview Column (Clean Light Window) */}
            <div className="relative group/mockup">
              <div className="relative overflow-hidden rounded-2xl border border-[#2D2B2C]/10 dark:border-white/15 bg-white dark:bg-[#1E2E25] shadow-[0_16px_40px_rgba(45,43,44,0.10)] transition-transform duration-500 group-hover:scale-[1.02]">
                {/* Simulated macOS Window Header */}
                <div className="flex items-center justify-between border-b border-[#2D2B2C]/8 dark:border-white/10 bg-[#FAF7F2] dark:bg-[#16221B] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
                    <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                    <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <span className="font-mono text-[11px] text-[#7A736A] dark:text-[#9EB3A4]">
                    dormitory-system / admin
                  </span>
                  <div className="w-10" />
                </div>

                {/* Screenshot Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAF7F2] dark:bg-[#141F18]">
                  <Image
                    src={primaryShot.src}
                    alt={primaryShot.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover object-top transition-transform duration-700 group-hover/mockup:scale-105"
                  />
                </div>
              </div>

              {/* Decorative Corner Badge */}
              <div className="absolute -bottom-3 -right-3 hidden sm:flex items-center gap-2 rounded-xl border border-[#2D2B2C]/10 dark:border-white/15 bg-white/95 dark:bg-[#16221B]/95 px-3.5 py-2 text-xs font-semibold text-[#2D2B2C] dark:text-[#F0F5F1] shadow-lg backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-[#36513B] dark:bg-[#7CD090]" />
                <span>Vue 3 Element Plus</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
