"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { X, ZoomIn, Shield, UserCheck, GraduationCap, KeyRound } from "lucide-react";
import type { ProjectCaseStudy } from "@/data/projects";

type Screenshot = ProjectCaseStudy["screenshots"][number];

const ROLE_ICONS = [
  KeyRound,       // 登录
  Shield,         // 管理员
  UserCheck,      // 宿管
  GraduationCap,  // 学生
];

export default function ProjectScreenshotGallery({
  screenshots,
}: {
  screenshots: ProjectCaseStudy["screenshots"];
}) {
  const [activeTab, setActiveTab] = useState(0);
  const currentShot = screenshots[activeTab] || screenshots[0];

  return (
    <div className="mt-8 space-y-6">
      {/* 1. Interactive Role View Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-white/70 dark:bg-[#1C261F]/70 border border-[#2D2B2C]/8 dark:border-white/10 max-w-2xl mx-auto backdrop-blur-xl shadow-xs">
        {screenshots.map((shot, idx) => {
          const Icon = ROLE_ICONS[idx] || Shield;
          const isActive = activeTab === idx;
          const roleName = (shot.title || shot.alt).split(" - ")[0].split("：")[0] || shot.alt;

          return (
            <button
              key={shot.src}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#36513B] text-white shadow-sm scale-[1.02] dark:bg-[#7CD090] dark:text-[#142219]"
                  : "text-[#5A5551] dark:text-[#9EB3A4] hover:text-[#2D2B2C] dark:hover:text-[#F0F5F1] hover:bg-white/80 dark:hover:bg-white/10"
              }`}
            >
              <Icon className={`size-3.5 ${isActive ? "text-white dark:text-[#142219]" : "text-[#36513B] dark:text-[#7CD090]"}`} />
              <span>{roleName}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Interactive macOS Browser Window Showcase (Clean Light Style) */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#2D2B2C]/10 dark:border-white/12 bg-white/90 dark:bg-[#1C261F]/90 shadow-[0_16px_50px_rgba(45,43,44,0.06)] backdrop-blur-xl transition-all">
        {/* Window Topbar */}
        <div className="flex items-center justify-between border-b border-[#2D2B2C]/8 dark:border-white/10 bg-[#FAF7F2] dark:bg-[#16221B] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
            <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
            <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white dark:bg-[#1C261F] px-3 py-1 text-[11px] font-mono text-[#7A736A] dark:text-[#9EB3A4] border border-[#2D2B2C]/8 dark:border-white/10 max-w-xs truncate hidden sm:flex">
            <span>https://dormitory.internal{activeTab === 0 ? "/login" : activeTab === 1 ? "/admin" : activeTab === 2 ? "/manager" : "/student"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#8C4A31] dark:text-[#E5987D] font-semibold">
            <span>{currentShot.title || currentShot.alt}</span>
          </div>
        </div>

        {/* Main Screenshot Display with Zoom Trigger */}
        <ProjectScreenshotPreview screenshot={currentShot} priority>
          <div className="group relative aspect-[16/10] w-full overflow-hidden bg-[#FAF7F2] dark:bg-[#141F18]">
            <Image
              key={currentShot.src}
              src={currentShot.src}
              alt={currentShot.alt}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1152px"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.01]"
            />
            {/* Hover Zoom Prompt Badge */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#36513B]/0 transition-all duration-300 group-hover:bg-[#36513B]/10">
              <div className="flex items-center gap-2 rounded-full bg-white/90 dark:bg-black/80 px-4 py-2 text-xs font-semibold text-[#2D2B2C] dark:text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 shadow-lg border border-[#2D2B2C]/10 dark:border-white/20">
                <ZoomIn className="size-4 text-[#36513B] dark:text-[#7CD090]" />
                <span>点击放大查看高清全景</span>
              </div>
            </div>
          </div>
        </ProjectScreenshotPreview>

        {/* Caption Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 bg-[#FAF7F2]/60 dark:bg-[#16221B]/60 border-t border-[#2D2B2C]/8 dark:border-white/10 text-xs text-[#5A5551] dark:text-[#9EB3A4]">
          <p className="font-medium text-[#2D2B2C] dark:text-[#F0F5F1]">
            💡 {currentShot.alt}
          </p>
          <span className="font-mono text-[11px] bg-white dark:bg-[#1C261F] px-2.5 py-1 rounded-md border border-[#2D2B2C]/8 dark:border-white/10 text-[#36513B] dark:text-[#7CD090] font-bold">
            视角 {activeTab + 1} / {screenshots.length}
          </span>
        </div>
      </div>

      {/* 3. Small Thumbnail Strip for Quick Jumping */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {screenshots.map((shot, idx) => {
          const isActive = activeTab === idx;
          return (
            <button
              key={shot.src}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`group relative aspect-[16/10] overflow-hidden rounded-xl border transition-all text-left cursor-pointer ${
                isActive
                  ? "border-[#36513B] dark:border-[#7CD090] ring-2 ring-[#36513B]/20 dark:ring-[#7CD090]/30 shadow-md scale-[1.01]"
                  : "border-[#2D2B2C]/10 dark:border-white/10 opacity-75 hover:opacity-100 hover:border-[#36513B]/50"
              }`}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2D2B2C]/80 via-[#2D2B2C]/40 to-transparent p-2 text-[10px] font-semibold text-white truncate">
                {shot.title || shot.alt}
              </div>
            </button>
          );
        })}
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
          className="fixed inset-0 z-50 overflow-y-auto bg-[#FAF8F4]/92 dark:bg-[#142219]/92 p-4 backdrop-blur-md sm:p-8 flex items-center justify-center"
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
