"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn, ZoomOut, RotateCcw, Shield, UserCheck, GraduationCap, KeyRound, CheckCircle2, Layers, ShieldCheck, ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { DORMITORY_CATEGORIES } from "@/data/projects";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  login: KeyRound,
  student: GraduationCap,
  manager: UserCheck,
  admin: Shield,
};

const THUMBNAIL_PAGE_SIZE = 3;

export default function ProjectScreenshotGallery() {
  const [selectedCatIndex, setSelectedCatIndex] = useState(1); // 默认高亮学生服务台
  const [selectedShotIndex, setSelectedShotIndex] = useState(0); // 当前分类下的第几张
  const [thumbPage, setThumbPage] = useState(0); // 缩略图页码 (每页 3 张)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 弹窗大图缩放与平移状态
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, panX: 0, panY: 0 });

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const currentCategory = DORMITORY_CATEGORIES[selectedCatIndex] || DORMITORY_CATEGORIES[0];
  const currentScreenshots = currentCategory.screenshots;
  const currentShot = currentScreenshots[selectedShotIndex] || currentScreenshots[0];
  const CategoryIcon = CATEGORY_ICONS[currentCategory.id] || Shield;

  const totalPages = Math.max(1, Math.ceil(currentScreenshots.length / THUMBNAIL_PAGE_SIZE));
  const visibleThumbnails = currentScreenshots.slice(
    thumbPage * THUMBNAIL_PAGE_SIZE,
    (thumbPage + 1) * THUMBNAIL_PAGE_SIZE,
  );

  // 重置缩放和平移
  const resetZoom = useCallback(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // 切换大分类时重置子页面索引与缩略图页码
  const handleCategoryChange = useCallback((idx: number) => {
    setSelectedCatIndex(idx);
    setSelectedShotIndex(0);
    setThumbPage(0);
    resetZoom();
  }, [resetZoom]);

  // 选择具体截图时，自动同步所在缩略图页码并重置缩放
  const handleSelectShot = useCallback((globalIdx: number) => {
    setSelectedShotIndex(globalIdx);
    setThumbPage(Math.floor(globalIdx / THUMBNAIL_PAGE_SIZE));
    resetZoom();
  }, [resetZoom]);

  // 滚轮缩放事件监听
  const handleWheelZoom = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setScale((prev) => {
      const next = Math.min(3.5, Math.max(1, +(prev + delta).toFixed(2)));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  // 拖拽平移事件
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1 || e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 键盘快捷操作：数字 1-4 切换大分类，Esc 退出放大，左右箭头切图
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === "Escape" && isLightboxOpen) {
        setIsLightboxOpen(false);
        resetZoom();
        return;
      }

      if (isLightboxOpen) {
        if (e.key === "ArrowLeft") {
          const nextIdx = selectedShotIndex > 0 ? selectedShotIndex - 1 : currentScreenshots.length - 1;
          handleSelectShot(nextIdx);
        } else if (e.key === "ArrowRight") {
          const nextIdx = selectedShotIndex < currentScreenshots.length - 1 ? selectedShotIndex + 1 : 0;
          handleSelectShot(nextIdx);
        }
      }

      if (!isLightboxOpen && ["1", "2", "3", "4"].includes(e.key)) {
        const index = parseInt(e.key, 10) - 1;
        if (index >= 0 && index < DORMITORY_CATEGORIES.length) {
          handleCategoryChange(index);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, selectedShotIndex, currentScreenshots.length, handleSelectShot, handleCategoryChange, resetZoom]);

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
        
        {/* ===================== 左侧：macOS 拟真主视区 + 统一固定 3 槽位缩略图轨道 ===================== */}
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
                <span>dormitory-system{currentCategory.path}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#36513B] dark:text-[#7CD090]">
                <span>{currentShot.title}</span>
                <span className="text-[10px] text-[#7A736A]">({selectedShotIndex + 1}/{currentScreenshots.length})</span>
              </div>
            </div>

            {/* Main Interactive Screen with Click-to-Zoom */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="group relative block aspect-[16/10] w-full overflow-hidden bg-[#FAF7F2] dark:bg-[#141F18] cursor-zoom-in outline-none text-left"
              aria-label={`放大查看：${currentShot.title}`}
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
                  <span>点击放大 (支持滚轮无级缩放)</span>
                </div>
              </div>
            </button>

            {/* Bottom Screen Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#FAF7F2]/60 dark:bg-[#16221B]/60 border-t border-[#2D2B2C]/8 dark:border-white/10 text-xs text-[#5A5551] dark:text-[#9EB3A4]">
              <span className="font-medium text-[#2D2B2C] dark:text-[#F0F5F1] truncate max-w-sm">
                {currentShot.alt}
              </span>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="text-[11px] font-semibold text-[#36513B] dark:text-[#7CD090] hover:underline flex items-center gap-1 cursor-pointer shrink-0 ml-2"
              >
                <ZoomIn className="size-3.5" />
                <span>全屏放大</span>
              </button>
            </div>
          </div>

          {/* 下方小截图：版式完全统一定型 (固定左右翻页按钮槽位，固定 3 列卡片宽度) */}
          <div key={currentCategory.id} className="animate-in fade-in duration-200 space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-[#2D2B2C] dark:text-[#F0F5F1] flex items-center gap-1.5">
                <CategoryIcon className="size-3.5 text-[#36513B] dark:text-[#7CD090]" />
                <span>{currentCategory.name} · 功能子页面 ({currentScreenshots.length} 张)</span>
              </span>
              
              <span className="text-[11px] font-mono text-[#7A736A] dark:text-[#9EB3A4]">
                页码 {thumbPage + 1} / {totalPages}
              </span>
            </div>

            {/* 3-Thumbnail Track with Perfectly Aligned Fixed Prev/Next Controls */}
            <div className="flex items-center gap-2">
              
              {/* Prev Page Button (固定占位，保持所有角色版式 100% 一致) */}
              <button
                type="button"
                onClick={() => setThumbPage((p) => Math.max(0, p - 1))}
                disabled={thumbPage === 0 || totalPages <= 1}
                className="inline-flex size-9 items-center justify-center rounded-full bg-white dark:bg-[#1C261F] text-[#2D2B2C] dark:text-white shadow-md hover:scale-105 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100 border border-[#2D2B2C]/10 dark:border-white/15 transition-all shrink-0 cursor-pointer"
                title="上一页 (<)"
                aria-label="上一页"
              >
                <ChevronLeft className="size-4.5" />
              </button>

              {/* Exact 3 Thumbnails Container (所有角色统一固定 3 槽位) */}
              <div className="grid grid-cols-3 gap-2.5 flex-1">
                {visibleThumbnails.map((shot, localIdx) => {
                  const globalIdx = thumbPage * THUMBNAIL_PAGE_SIZE + localIdx;
                  const isActive = selectedShotIndex === globalIdx;

                  return (
                    <button
                      key={shot.src}
                      type="button"
                      onClick={() => handleSelectShot(globalIdx)}
                      onMouseEnter={() => handleSelectShot(globalIdx)} // 悬停即切，体验流畅
                      className={`group relative flex flex-col items-center gap-1.5 p-1.5 rounded-2xl border transition-all text-center cursor-pointer bg-white/90 dark:bg-[#1C261F]/90 backdrop-blur-md ${
                        isActive
                          ? "border-[#36513B] dark:border-[#7CD090] ring-2 ring-[#36513B]/20 dark:ring-[#7CD090]/30 shadow-md scale-[1.02]"
                          : "border-[#2D2B2C]/8 dark:border-white/10 opacity-75 hover:opacity-100 hover:border-[#36513B]/40"
                      }`}
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#FAF7F2] dark:bg-[#141F18]">
                        <Image
                          src={shot.src}
                          alt={shot.alt}
                          fill
                          sizes="(max-width: 640px) 33vw, 20vw"
                          className="object-cover object-top"
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-[#2D2B2C] dark:text-[#F0F5F1] truncate px-1 w-full">
                        {shot.subTitle || shot.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Next Page Button (固定占位，保持所有角色版式 100% 一致) */}
              <button
                type="button"
                onClick={() => setThumbPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={thumbPage >= totalPages - 1 || totalPages <= 1}
                className="inline-flex size-9 items-center justify-center rounded-full bg-white dark:bg-[#1C261F] text-[#2D2B2C] dark:text-white shadow-md hover:scale-105 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100 border border-[#2D2B2C]/10 dark:border-white/15 transition-all shrink-0 cursor-pointer"
                title="下一页 (>)"
                aria-label="下一页"
              >
                <ChevronRight className="size-4.5" />
              </button>

            </div>
          </div>

        </div>

        {/* ===================== 右侧：角色大类视角选择与业务深度详情 ===================== */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Detail Card (淘宝商品属性面板风格) */}
          <div className="rounded-3xl border border-[#2D2B2C]/10 dark:border-white/12 bg-white/90 dark:bg-[#1C261F]/90 p-6 sm:p-8 shadow-[0_16px_48px_rgba(45,43,44,0.06)] backdrop-blur-xl space-y-6">
            
            {/* Title & Tag */}
            <div className="space-y-2 border-b border-[#2D2B2C]/8 dark:border-white/10 pb-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E2EBE4] dark:bg-[#23382C] px-3 py-1 text-xs font-semibold text-[#36513B] dark:text-[#7CD090]">
                  <CategoryIcon className="size-3.5" />
                  <span>{currentCategory.tag}</span>
                </span>
                <span className="font-mono text-xs font-semibold text-[#8C4A31] dark:text-[#E5987D]">
                  {currentCategory.path}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#2D2B2C] dark:text-[#F0F5F1] tracking-tight">
                {currentCategory.name}
              </h3>
              <p className="text-xs text-[#5A5551] dark:text-[#9EB3A4] leading-relaxed">
                {currentShot.alt}
              </p>
            </div>

            {/* Spec Selector (4 大核心角色规格切换：点击切换对应视角) */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#2D2B2C] dark:text-[#F0F5F1] flex items-center gap-1.5">
                <Layers className="size-3.5 text-[#36513B] dark:text-[#7CD090]" />
                <span>选择系统角色视角 (Role View)：</span>
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                {DORMITORY_CATEGORIES.map((cat, idx) => {
                  const Icon = CATEGORY_ICONS[cat.id] || Shield;
                  const isActive = selectedCatIndex === idx;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryChange(idx)}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                        isActive
                          ? "border-[#36513B] dark:border-[#7CD090] bg-[#FAF7F2] dark:bg-[#23382C] text-[#36513B] dark:text-[#7CD090] font-bold shadow-xs scale-[1.02] ring-1 ring-[#36513B]/20"
                          : "border-[#2D2B2C]/8 dark:border-white/8 bg-white/50 dark:bg-white/5 text-[#5A5551] dark:text-[#9EB3A4] hover:bg-white hover:border-[#36513B]/30"
                      }`}
                    >
                      <Icon className={`size-4 shrink-0 ${isActive ? "text-[#36513B] dark:text-[#7CD090]" : "text-[#7A736A]"}`} />
                      <div className="truncate">
                        <div className="truncate">{cat.name}</div>
                        <div className="text-[10px] font-normal text-[#7A736A]">{cat.screenshots.length} 张详细截图</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Business Highlights List */}
            <div className="space-y-3 pt-1">
              <span className="text-xs font-bold text-[#2D2B2C] dark:text-[#F0F5F1] flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-[#36513B] dark:text-[#7CD090]" />
                <span>{currentCategory.name} · 业务特性：</span>
              </span>

              <ul className="space-y-2">
                {currentCategory.highlights.map((highlight, index) => (
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
                技术架构实现 (Architecture)
              </span>
              <span className="block text-xs font-semibold text-[#2D2B2C] dark:text-[#F0F5F1]">
                {currentCategory.techStack}
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* ===================== 全屏灯箱模态弹窗 (支持滚轮缩放 + 拖拽平移) ===================== */}
      {mounted && isLightboxOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="截图高清全景查看"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--background)]/90 p-4 backdrop-blur-md sm:p-6 lg:p-8 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsLightboxOpen(false);
              resetZoom();
            }
          }}
        >
          {/* 中间主题卡片容器 */}
          <div className="relative max-w-5xl w-full rounded-3xl bg-[var(--surface)] border border-[var(--border-line-color)] p-4 sm:p-6 shadow-[0_24px_70px_rgba(14,24,18,0.18)] flex flex-col items-center gap-3 text-[var(--foreground)]">
            
            {/* Topbar: 视角信息 + 缩放状态栏 + 关闭按钮 */}
            <div className="w-full flex items-center justify-between px-1 pb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--foreground)] tracking-tight">
                  {currentCategory.name} · {currentShot.title}
                </span>
                <span className="text-xs text-[var(--muted)] font-mono">
                  ({selectedShotIndex + 1}/{currentScreenshots.length})
                </span>
              </div>

              {/* 缩放快捷控制与退出 */}
              <div className="flex items-center gap-2">
                {/* 缩放控制器胶囊 */}
                <div className="flex items-center gap-1 rounded-full bg-[var(--surface)]/90 px-2 py-1 ring-1 ring-[var(--border-line-color)] text-[11px] text-[var(--muted)]">
                  <button
                    type="button"
                    onClick={() => setScale((s) => Math.max(1, +(s - 0.25).toFixed(2)))}
                    disabled={scale <= 1}
                    className="p-1 hover:text-[var(--foreground)] disabled:opacity-30 transition-colors cursor-pointer"
                    title="缩小"
                  >
                    <ZoomOut className="size-3.5" />
                  </button>
                  <span className="font-mono min-w-10 text-center font-bold text-[var(--foreground)]">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setScale((s) => Math.min(3.5, +(s + 0.25).toFixed(2)))}
                    disabled={scale >= 3.5}
                    className="p-1 hover:text-[var(--foreground)] disabled:opacity-30 transition-colors cursor-pointer"
                    title="放大"
                  >
                    <ZoomIn className="size-3.5" />
                  </button>
                  {scale > 1 && (
                    <button
                      type="button"
                      onClick={resetZoom}
                      className="p-1 hover:text-[var(--foreground)] transition-colors border-l border-[var(--border-line-color)] pl-1.5 ml-0.5 cursor-pointer"
                      title="重置缩放 (100%)"
                    >
                      <RotateCcw className="size-3.5" />
                    </button>
                  )}
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsLightboxOpen(false);
                    resetZoom();
                  }}
                  className="rounded-full p-2 text-[var(--muted)] ring-1 ring-[var(--border-line-color)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] active:scale-[0.98] cursor-pointer"
                  aria-label="关闭预览"
                  title="关闭 (Esc)"
                >
                  <X className="size-4" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* 核心大图展示槽 (支持滚轮上下缩放 + 按住鼠标拖拽平移 + 双击快速缩放) */}
            <div
              onWheel={handleWheelZoom}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onDoubleClick={() => {
                if (scale === 1) {
                  setScale(1.8);
                } else {
                  resetZoom();
                }
              }}
              className={`relative w-full flex items-center justify-center overflow-hidden rounded-2xl bg-[var(--surface-2)] border border-[var(--border-line-color)] p-3 sm:p-5 shadow-inner min-h-[52vh] ${
                scale > 1
                  ? isDragging
                    ? "cursor-grabbing"
                    : "cursor-grab"
                  : "cursor-zoom-in"
              }`}
              title="鼠标滚轮上下滚动可无级缩放，按住可拖拽平移，双击快速缩放"
            >
              {/* Prev Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const nextIdx = selectedShotIndex > 0 ? selectedShotIndex - 1 : currentScreenshots.length - 1;
                  handleSelectShot(nextIdx);
                }}
                className="absolute left-4 z-20 inline-flex size-10 items-center justify-center rounded-full bg-[var(--surface)]/90 text-[var(--foreground)] shadow-md hover:scale-105 active:scale-95 transition-all ring-1 ring-[var(--border-line-color)] cursor-pointer"
                title="上一张 (←)"
                aria-label="上一张"
              >
                <ChevronLeft className="size-5" />
              </button>

              {/* Screenshot Image with Smooth Transform */}
              <div
                className="transition-transform duration-100 ease-out select-none flex items-center justify-center"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                }}
              >
                <Image
                  src={currentShot.src}
                  alt={currentShot.alt}
                  width={currentShot.width || 1440}
                  height={currentShot.height || 900}
                  priority
                  draggable={false}
                  className="max-h-[70vh] w-auto h-auto object-contain mx-auto rounded-lg select-none shadow-[0_8px_24px_rgba(0,0,0,0.08)] pointer-events-none"
                />
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const nextIdx = selectedShotIndex < currentScreenshots.length - 1 ? selectedShotIndex + 1 : 0;
                  handleSelectShot(nextIdx);
                }}
                className="absolute right-4 z-20 inline-flex size-10 items-center justify-center rounded-full bg-[var(--surface)]/90 text-[var(--foreground)] shadow-md hover:scale-105 active:scale-95 transition-all ring-1 ring-[var(--border-line-color)] cursor-pointer"
                title="下一张 (→)"
                aria-label="下一张"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            {/* 底部缩略圆点指示器 + 滚轮提示 */}
            <div className="w-full flex items-center justify-between px-1 text-[11px] text-[var(--muted)]">
              <span className="hidden sm:inline">
                鼠标滚轮上下滚动缩放 · 双击快速切换 1.8x · 放大后按住可拖拽
              </span>
              <div className="flex items-center gap-2 mx-auto sm:mx-0 py-1">
                {currentScreenshots.map((s, idx) => (
                  <button
                    key={s.src}
                    type="button"
                    onClick={() => handleSelectShot(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      selectedShotIndex === idx ? "w-6 bg-[var(--accent-green)]" : "w-2 bg-[var(--border-line-color)] hover:bg-[var(--muted)]"
                    }`}
                    title={`切换到：${s.title}`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
