"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { X, ZoomIn, Shield, UserCheck, GraduationCap, KeyRound, CheckCircle2, ArrowRight, Layers, Sparkles, Laptop, ShieldCheck } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState(1); // 默认高亮展示管理员总览
  const currentShot = screenshots[activeTab] || screenshots[0];
  const currentMeta = ROLE_META[activeTab] || ROLE_META[0];
  const CurrentIcon = currentMeta.icon;

  // 支持数字键 1-4 快捷切换
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["1", "2", "3", "4"].includes(e.key) && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        const index = parseInt(e.key, 10) - 1;
        if (index >= 0 && index < screenshots.length) {
          setActiveTab(index);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screenshots.length]);

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

            {/* Main Interactive Screen with Zoom */}
            <ProjectScreenshotPreview screenshot={currentShot} priority>
              <div className="group relative aspect-[16/10] w-full overflow-hidden bg-[#FAF7F2] dark:bg-[#141F18] cursor-zoom-in">
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
                  <div className="flex items-center gap-2 rounded-full bg-white/90 dark:bg-black/80 px-4 py-2 text-xs font-semibold text-[#2D2B2C] dark:text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 shadow-lg border border-[#2D2B2C]/10 dark:border-white/20">
                    <ZoomIn className="size-4 text-[#36513B] dark:text-[#7CD090]" />
                    <span>点击放大全屏查看</span>
                  </div>
                </div>
              </div>
            </ProjectScreenshotPreview>

            {/* Bottom Screen Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#FAF7F2]/60 dark:bg-[#16221B]/60 border-t border-[#2D2B2C]/8 dark:border-white/10 text-xs text-[#5A5551] dark:text-[#9EB3A4]">
              <span className="font-medium text-[#2D2B2C] dark:text-[#F0F5F1] truncate max-w-sm">
                {currentShot.title || currentShot.alt}
              </span>
              <span className="text-[10px] font-mono text-[#7A736A]">
                按键盘 1-4 快速切图
              </span>
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

            {/* Zoom Action Button */}
            <ProjectScreenshotPreview screenshot={currentShot}>
              <div className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#36513B] hover:bg-[#283E2C] text-white text-xs font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                <ZoomIn className="size-4 text-[#E2EBE4]" />
                <span>放大查看高清界面细节</span>
              </div>
            </ProjectScreenshotPreview>

          </div>

        </div>

      </div>
    </div>
  );
}

export function ProjectScreenshotPreview({
  screenshot,
  priority = false,
  children,
}: {
  screenshot: Screenshot;
  priority?: boolean;
  children?: ReactNode;
}) {
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!selectedScreenshot) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelectedScreenshot(null);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleDialogKeyDown);
    return () => {
      document.removeEventListener("keydown", handleDialogKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    };
  }, [selectedScreenshot]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={(event) => {
          triggerRef.current = event.currentTarget;
          setSelectedScreenshot(screenshot);
        }}
        className="block w-full cursor-zoom-in outline-none transition-all duration-200 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#36513B] focus-visible:ring-inset motion-reduce:transition-none"
        aria-label={`放大查看：${screenshot.alt}`}
      >
        {children ?? (
          <Image
            src={screenshot.src}
            alt={screenshot.alt}
            width={screenshot.width}
            height={screenshot.height}
            priority={priority}
            sizes={priority ? "(max-width: 1280px) 100vw, 1152px" : "(max-width: 767px) 100vw, (max-width: 1280px) 33vw, 384px"}
            className="h-auto w-full"
          />
        )}
      </button>

      {selectedScreenshot ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="截图放大预览"
          className="fixed inset-0 z-50 overflow-y-auto bg-[#FAF8F4]/95 dark:bg-[#142219]/95 p-4 backdrop-blur-md sm:p-8 flex items-center justify-center"
          onClick={(event) => {
            if (!panelRef.current?.contains(event.target as Node)) {
              setSelectedScreenshot(null);
            }
          }}
        >
          <div className="relative max-w-6xl w-full">
            <div ref={panelRef} className="relative w-full overflow-hidden rounded-2xl bg-white dark:bg-[#1C261F] p-3 text-[#2D2B2C] dark:text-[#F0F5F1] shadow-2xl ring-1 ring-[#2D2B2C]/10 dark:ring-white/20">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setSelectedScreenshot(null)}
                className="absolute right-5 top-5 z-10 inline-flex size-10 items-center justify-center rounded-full bg-white/90 dark:bg-[#23382C] text-[#2D2B2C] dark:text-white shadow-md border border-[#2D2B2C]/10 dark:border-white/20 transition-transform duration-200 hover:scale-110 active:scale-95"
                aria-label="关闭放大预览"
              >
                <X className="size-5" strokeWidth={2} aria-hidden="true" />
              </button>
              <Image
                src={selectedScreenshot.src}
                alt={selectedScreenshot.alt}
                width={selectedScreenshot.width}
                height={selectedScreenshot.height}
                sizes="100vw"
                className="h-auto max-h-[85vh] w-full object-contain mx-auto rounded-xl"
              />
              <div className="p-3.5 text-center text-xs text-[#5A5551] dark:text-[#9EB3A4] font-medium bg-[#FAF7F2] dark:bg-[#16221B] mt-2 rounded-lg">
                {selectedScreenshot.title} · {selectedScreenshot.alt}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
