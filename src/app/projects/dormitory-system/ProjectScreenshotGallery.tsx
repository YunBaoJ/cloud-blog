"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn, Shield, UserCheck, GraduationCap, KeyRound, CheckCircle2, Layers, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import type { ProjectCaseStudy } from "@/data/projects";

type Screenshot = ProjectCaseStudy["screenshots"][number];

const ROLE_META = [
  {
    role: "统一身份认证登录",
    path: "/login",
    tag: "全局安全入口",
    icon: KeyRound,
    accent: "var(--accent-clay)",
    highlights: [
      "支持学生、宿管与管理员三端统一认证与凭证分发",
      "基于 JWT 的无状态鉴权与双向 Token 校验机制",
      "根据身份自动定向至对应角色的专属动态工作台",
    ],
    techPoints: "Spring Security / JWT / BCrypt 密码加密",
  },
  {
    role: "系统管理员总览",
    path: "/admin/overview",
    tag: "全局中枢看板",
    icon: Shield,
    accent: "var(--accent-green)",
    highlights: [
      "全校楼宇、楼层与宿舍床位资源可视化拓扑分布",
      "RBAC 细粒度角色与系统运维操作日志全流程审计",
      "全站数据报表聚合，支持多条件筛选与批量导出",
    ],
    techPoints: "Element Plus / ECharts 图表 / 动态权限路由",
  },
  {
    role: "宿管日常工作台",
    path: "/manager/workbench",
    tag: "楼栋运营枢纽",
    icon: UserCheck,
    accent: "#2A5270",
    highlights: [
      "实时入住、调宿办理与房态空闲/满员即时变色看板",
      "学生报修工单接单、流转、指派与完成状态归档",
      "外来访客进出留痕登记与夜间晚归异常考勤记录",
    ],
    techPoints: "状态机审批流 / WebSocket 提醒 / 房态图谱",
  },
  {
    role: "学生个人服务台",
    path: "/student/portal",
    tag: "学生自助服务",
    icon: GraduationCap,
    accent: "#B8623D",
    highlights: [
      "在线查看当前入住寝室、床位信息与室友通讯录",
      "水电费用账单实时查询与在线快捷缴费申请",
      "宿舍设施损坏一键拍照报修与工单实时进度追踪",
    ],
    techPoints: "响应式移动端兼容 / 表单防抖提交 / 进度步骤条",
  },
];

export default function ProjectScreenshotGallery({
  screenshots,
}: {
  screenshots: ProjectCaseStudy["screenshots"];
}) {
  const [activeTab, setActiveTab] = useState(1); // 默认展示管理员总览
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentShot = screenshots[activeTab] || screenshots[0];
  const currentMeta = ROLE_META[activeTab] || ROLE_META[0];
  const CurrentIcon = currentMeta.icon;

  // 键盘快捷操作：数字 1-4 切换视角，Esc 退出放大，左右箭头切图
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === "Escape" && isLightboxOpen) {
        setIsLightboxOpen(false);
        return;
      }

      if (isLightboxOpen) {
        if (e.key === "ArrowLeft") {
          setActiveTab((prev) => (prev > 0 ? prev - 1 : screenshots.length - 1));
        } else if (e.key === "ArrowRight") {
          setActiveTab((prev) => (prev < screenshots.length - 1 ? prev + 1 : 0));
        }
      }

      if (["1", "2", "3", "4"].includes(e.key)) {
        const index = parseInt(e.key, 10) - 1;
        if (index >= 0 && index < screenshots.length) {
          setActiveTab(index);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, screenshots.length]);

  // 控制放大预览时的页面背景滚动
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]);

  return (
    <div className="mt-8">
      {/* Taobao-style Side-by-Side Showcase Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ===================== 左侧：主视区与缩略图 ===================== */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* macOS Simulated Browser Frame */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#2D2B2C]/10 dark:border-white/12 bg-white/95 dark:bg-[#1C261F]/95 shadow-[0_16px_50px_rgba(45,43,44,0.06)] backdrop-blur-xl transition-all">
            {/* Topbar */}
            <div className="flex items-center justify-between border-b border-[#2D2B2C]/8 dark:border-white/10 bg-[#FAF7F2] dark:bg-[#16221B] px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
                <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white dark:bg-[#1C261F] px-3 py-1 text-[11px] font-mono text-[#7A736A] dark:text-[#9EB3A4] border border-[#2D2B2C]/8 dark:border-white/10 max-w-xs truncate">
                <span>dormitory-system{currentMeta.path}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-[#36513B] dark:text-[#7CD090]">
                <span>视角 {activeTab + 1}/4</span>
              </div>
            </div>

            {/* Main Interactive Screen with Click-to-Zoom */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="group relative block aspect-[16/10] w-full overflow-hidden bg-[#FAF7F2] dark:bg-[#141F18] cursor-zoom-in outline-none text-left"
              aria-label={`放大查看：${currentShot.title || currentShot.alt}`}
            >
              <Image
                key={currentShot.src}
                src={currentShot.src}
                alt={currentShot.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.01]"
              />
              
              {/* Hover Quick Zoom Cue */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/15">
                <div className="flex items-center gap-2 rounded-full bg-white/95 dark:bg-black/85 px-4 py-2 text-xs font-bold text-[#2D2B2C] dark:text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 shadow-xl border border-[#2D2B2C]/10 dark:border-white/20">
                  <ZoomIn className="size-4 text-[#36513B] dark:text-[#7CD090]" />
                  <span>点击放大全屏查看</span>
                </div>
              </div>
            </button>

            {/* Bottom Screen Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#FAF7F2]/60 dark:bg-[#16221B]/60 border-t border-[#2D2B2C]/8 dark:border-white/10 text-xs text-[#5A5551] dark:text-[#9EB3A4]">
              <span className="font-medium text-[#2D2B2C] dark:text-[#F0F5F1] truncate max-w-sm">
                {currentShot.title || currentShot.alt}
              </span>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="text-[11px] font-semibold text-[#36513B] dark:text-[#7CD090] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ZoomIn className="size-3.5" />
                <span>全屏放大</span>
              </button>
            </div>
          </div>

          {/* E-Commerce Thumbnail Track (紧贴主图下方，无需上下滚动) */}
          <div className="grid grid-cols-4 gap-3">
            {screenshots.map((shot, idx) => {
              const isActive = activeTab === idx;
              const meta = ROLE_META[idx] || ROLE_META[0];
              const Icon = meta.icon;

              return (
                <button
                  key={shot.src}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  onMouseEnter={() => setActiveTab(idx)} // 仿淘宝悬停即切，体验极致流畅
                  className={`group relative flex flex-col items-center gap-1.5 p-1.5 rounded-2xl border transition-all text-center cursor-pointer bg-white/80 dark:bg-[#1C261F]/80 backdrop-blur-md ${
                    isActive
                      ? "border-[#36513B] dark:border-[#7CD090] ring-2 ring-[#36513B]/20 dark:ring-[#7CD090]/30 shadow-md scale-[1.02]"
                      : "border-[#2D2B2C]/8 dark:border-white/10 opacity-70 hover:opacity-100 hover:border-[#36513B]/40"
                  }`}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-[#FAF7F2] dark:bg-[#141F18]">
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      sizes="(max-width: 640px) 25vw, 15vw"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#2D2B2C] dark:text-[#F0F5F1] truncate px-1 w-full justify-center">
                    <Icon className={`size-3 shrink-0 ${isActive ? "text-[#36513B] dark:text-[#7CD090]" : "text-[#7A736A]"}`} />
                    <span className="truncate">{meta.role.split(" - ")[0].replace("系统", "").replace("统一身份认证", "登录")}</span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* ===================== 右侧：视角规格选择与业务详情 ===================== */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Detail Card (淘宝商品属性面板风格) */}
          <div className="rounded-3xl border border-[#2D2B2C]/10 dark:border-white/12 bg-white/90 dark:bg-[#1C261F]/90 p-6 sm:p-8 shadow-[0_16px_48px_rgba(45,43,44,0.06)] backdrop-blur-xl space-y-6">
            
            {/* Title & Tag */}
            <div className="space-y-2 border-b border-[#2D2B2C]/8 dark:border-white/10 pb-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E2EBE4] dark:bg-[#23382C] px-3 py-1 text-xs font-semibold text-[#36513B] dark:text-[#7CD090]">
                  <CurrentIcon className="size-3.5" />
                  <span>{currentMeta.tag}</span>
                </span>
                <span className="font-mono text-xs font-semibold text-[#8C4A31] dark:text-[#E5987D]">
                  {currentMeta.path}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#2D2B2C] dark:text-[#F0F5F1] tracking-tight">
                {currentMeta.role}
              </h3>
              <p className="text-xs text-[#5A5551] dark:text-[#9EB3A4] leading-relaxed">
                {currentShot.alt}
              </p>
            </div>

            {/* Spec Selector (角色规格切换) */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#2D2B2C] dark:text-[#F0F5F1] flex items-center gap-1.5">
                <Layers className="size-3.5 text-[#36513B] dark:text-[#7CD090]" />
                <span>快速切换工作台视角：</span>
              </span>

              <div className="grid grid-cols-2 gap-2">
                {ROLE_META.map((meta, idx) => {
                  const Icon = meta.icon;
                  const isActive = activeTab === idx;
                  return (
                    <button
                      key={meta.role}
                      type="button"
                      onClick={() => setActiveTab(idx)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        isActive
                          ? "border-[#36513B] dark:border-[#7CD090] bg-[#FAF7F2] dark:bg-[#23382C] text-[#36513B] dark:text-[#7CD090] font-bold shadow-xs"
                          : "border-[#2D2B2C]/8 dark:border-white/8 bg-white/50 dark:bg-white/5 text-[#5A5551] dark:text-[#9EB3A4] hover:bg-white hover:border-[#36513B]/30"
                      }`}
                    >
                      <Icon className="size-3.5 shrink-0" />
                      <span className="truncate">{meta.role}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Business Highlights List */}
            <div className="space-y-3 pt-1">
              <span className="text-xs font-bold text-[#2D2B2C] dark:text-[#F0F5F1] flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-[#36513B] dark:text-[#7CD090]" />
                <span>核心业务闭环特性：</span>
              </span>

              <ul className="space-y-2">
                {currentMeta.highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-xs text-[#5A5551] dark:text-[#9EB3A4] leading-relaxed"
                  >
                    <CheckCircle2 className="size-3.5 text-[#36513B] dark:text-[#7CD090] shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Implementation Badge */}
            <div className="rounded-2xl bg-[#FAF7F2] dark:bg-[#16221B] p-3.5 border border-[#2D2B2C]/6 dark:border-white/8 space-y-1">
              <span className="block text-[10px] font-mono text-[#7A736A] uppercase tracking-wider">
                技术实现点 (Tech Stack)
              </span>
              <span className="block text-xs font-semibold text-[#2D2B2C] dark:text-[#F0F5F1]">
                {currentMeta.techPoints}
              </span>
            </div>

            {/* Big Zoom Action Trigger Button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#36513B] hover:bg-[#283E2C] text-white text-xs font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <ZoomIn className="size-4 text-[#E2EBE4]" />
              <span>放大查看高清全景细节</span>
            </button>

          </div>

        </div>

      </div>

      {/* ===================== 全屏灯箱模态弹窗 (模仿画廊点开预览效果) ===================== */}
      {mounted && isLightboxOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="截图高清全景查看"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--background)]/85 dark:bg-[#142219]/90 backdrop-blur-md p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLightboxOpen(false);
          }}
        >
          {/* 中间背景板卡片 (纯净展示大图) */}
          <div className="relative max-w-5xl w-full rounded-3xl bg-[var(--surface)] p-3 sm:p-5 shadow-[0_24px_70px_rgba(14,24,18,0.18)] border border-[var(--border-line-color)] flex flex-col items-center gap-3">
            
            {/* Topbar: 视角信息 + 关闭按钮 */}
            <div className="w-full flex items-center justify-between px-2 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--foreground)]">
                  {currentShot.title || currentShot.alt}
                </span>
                <span className="text-xs text-[var(--muted)] font-mono">
                  ({activeTab + 1}/{screenshots.length})
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="rounded-full p-2 text-[var(--muted)] ring-1 ring-[var(--border-line-color)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] active:scale-[0.98] cursor-pointer"
                aria-label="关闭预览"
                title="关闭 (Esc)"
              >
                <X className="size-4" strokeWidth={2} />
              </button>
            </div>

            {/* 核心高清大图展示框 */}
            <div className="relative w-full flex items-center justify-center overflow-hidden rounded-2xl bg-white dark:bg-[#141F18] border border-[var(--border-line-color)] p-2 sm:p-4 shadow-inner min-h-[50vh]">
              {/* Prev Button */}
              <button
                type="button"
                onClick={() => setActiveTab((prev) => (prev > 0 ? prev - 1 : screenshots.length - 1))}
                className="absolute left-4 z-10 inline-flex size-10 items-center justify-center rounded-full bg-white/95 dark:bg-[#23382C]/95 text-[var(--foreground)] shadow-md hover:scale-105 active:scale-95 transition-all border border-[var(--border-line-color)] cursor-pointer"
                title="上一张 (←)"
                aria-label="上一张"
              >
                <ChevronLeft className="size-5" />
              </button>

              {/* Screenshot Image (纯粹大图) */}
              <Image
                src={currentShot.src}
                alt={currentShot.alt}
                width={currentShot.width || 1440}
                height={currentShot.height || 900}
                priority
                className="max-h-[75vh] w-auto h-auto object-contain mx-auto rounded-lg select-none shadow-sm"
              />

              {/* Next Button */}
              <button
                type="button"
                onClick={() => setActiveTab((prev) => (prev < screenshots.length - 1 ? prev + 1 : 0))}
                className="absolute right-4 z-10 inline-flex size-10 items-center justify-center rounded-full bg-white/95 dark:bg-[#23382C]/95 text-[var(--foreground)] shadow-md hover:scale-105 active:scale-95 transition-all border border-[var(--border-line-color)] cursor-pointer"
                title="下一张 (→)"
                aria-label="下一张"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            {/* 底部缩略圆点指示器 */}
            <div className="flex items-center gap-2 py-1">
              {screenshots.map((s, idx) => (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeTab === idx ? "w-6 bg-[var(--accent-green)]" : "w-2 bg-[var(--border-line-color)] hover:bg-[var(--muted)]"
                  }`}
                  title={`切换到第 ${idx + 1} 张`}
                />
              ))}
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}

// 保留 ProjectScreenshotPreview 导出以兼容旧引用
export function ProjectScreenshotPreview({
  screenshot,
  priority = false,
  children,
}: {
  screenshot: Screenshot;
  priority?: boolean;
  children?: ReactNode;
}) {
  return <>{children}</>;
}
