"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import type { GalleryPhoto } from "@/data/siteContent";
import { clampPan, clampZoom, getSwipeDirection, type Point } from "@/lib/galleryInteraction.mts";

interface GalleryArtworkViewerProps {
  photos: GalleryPhoto[];
  currentIndex: number;
  failedImageIds: Set<string>;
  onImageError: (id: string) => void;
  onSelect: (photo: GalleryPhoto) => void;
}

interface PointerSession {
  pointerId: number;
  startX: number;
  startY: number;
  panX: number;
  panY: number;
}

export default function GalleryArtworkViewer({
  photos,
  currentIndex,
  failedImageIds,
  onImageError,
  onSelect,
}: GalleryArtworkViewerProps) {
  const photo = photos[currentIndex];
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointerSessionRef = useRef<PointerSession | null>(null);
  const activeThumbnailRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    for (const candidate of [photos[currentIndex - 1], photos[currentIndex + 1]]) {
      if (!candidate) continue;
      const image = new Image();
      image.src = candidate.src;
    }
  }, [currentIndex, photos]);

  useEffect(() => {
    activeThumbnailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [currentIndex]);

  const updateScale = (nextValue: number) => {
    const nextScale = clampZoom(nextValue);
    setScale(nextScale);
    if (nextScale === 1) setPan({ x: 0, y: 0 });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerSessionRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const session = pointerSessionRef.current;
    if (!session || session.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - session.startX;
    const deltaY = event.clientY - session.startY;

    if (scale === 1) {
      setSwipeOffset(deltaX);
      return;
    }

    const bounds = viewportRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setPan(clampPan(
      { x: session.panX + deltaX, y: session.panY + deltaY },
      scale,
      bounds.width,
      bounds.height,
    ));
  };

  const finishPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const session = pointerSessionRef.current;
    if (!session || session.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - session.startX;
    const deltaY = event.clientY - session.startY;
    pointerSessionRef.current = null;
    setIsDragging(false);
    setSwipeOffset(0);

    if (scale !== 1) return;
    const direction = getSwipeDirection(deltaX, deltaY);
    const nextIndex = currentIndex + direction;
    if (direction !== 0 && photos[nextIndex]) onSelect(photos[nextIndex]);
  };

  const hasFailed = failedImageIds.has(photo.id);
  const transformX = pan.x + (scale === 1 ? swipeOffset * 0.18 : 0);

  return (
    <div className="flex min-h-[44dvh] min-w-0 flex-col bg-[var(--surface-2)] p-3 sm:p-6 lg:min-h-0">
      <div className="mb-3 flex items-center justify-between gap-3 text-[11px] text-[var(--muted)]">
        <span aria-live="polite">{String(currentIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
        <div className="flex items-center gap-1 rounded-full bg-[var(--surface)]/90 p-1 ring-1 ring-[var(--border-line-color)]">
          <button
            type="button"
            onClick={() => updateScale(scale - 0.5)}
            disabled={scale <= 1}
            aria-label="缩小图片"
            className="rounded-full p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] disabled:opacity-35"
          >
            <ZoomOut className="size-4" aria-hidden="true" />
          </button>
          <span className="min-w-10 text-center font-mono">{Math.round(scale * 100)}%</span>
          <button
            type="button"
            onClick={() => updateScale(scale + 0.5)}
            disabled={scale >= 3}
            aria-label="放大图片"
            className="rounded-full p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] disabled:opacity-35"
          >
            <ZoomIn className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => updateScale(1)}
            disabled={scale === 1 && pan.x === 0 && pan.y === 0}
            aria-label="恢复图片大小"
            className="rounded-full p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] disabled:opacity-35"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        onDoubleClick={() => updateScale(scale === 1 ? 2 : 1)}
        className={`relative flex min-h-[34dvh] flex-1 items-center justify-center overflow-hidden rounded-lg ${scale > 1 ? "cursor-grab touch-none active:cursor-grabbing" : "cursor-zoom-in touch-pan-y"}`}
        aria-label="作品大图。左右滑动切换，双击缩放"
      >
        {hasFailed ? (
          <p className="text-sm text-[var(--muted)]">图片暂时无法载入，请检查文件路径。</p>
        ) : (
          <>
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--muted)]" role="status">
                图片载入中
              </div>
            )}
            <div className="flex max-h-[58dvh] max-w-full items-center justify-center bg-[#FFFFFF] p-3 shadow-[0_12px_30px_rgba(45,43,44,0.1)] ring-1 ring-[var(--border-line-color)] sm:p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.title}
                draggable={false}
                onLoad={() => setIsLoaded(true)}
                onError={() => onImageError(photo.id)}
                className={`max-h-[48dvh] max-w-full select-none object-contain ${isDragging ? "transition-none" : "transition-transform duration-200 motion-reduce:transition-none"}`}
                style={{ transform: `translate3d(${transformX}px, ${pan.y}px, 0) scale(${scale})` }}
              />
            </div>
          </>
        )}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto px-0.5 pb-1 [scrollbar-width:thin]" aria-label="作品缩略图导航">
        {photos.map((thumbnail, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={thumbnail.id}
              ref={isActive ? activeThumbnailRef : undefined}
              type="button"
              onClick={() => onSelect(thumbnail)}
              aria-label={`查看第 ${index + 1} 幅：${thumbnail.title}`}
              aria-current={isActive ? "true" : undefined}
              className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-[var(--surface)] ring-2 ring-offset-2 ring-offset-[var(--surface-2)] transition-opacity ${isActive ? "ring-[var(--accent-green)]" : "ring-transparent opacity-55 hover:opacity-100"}`}
            >
              <NextImage
                src={thumbnail.src}
                alt=""
                width={thumbnail.width}
                height={thumbnail.height}
                sizes="64px"
                loading="lazy"
                onError={() => onImageError(thumbnail.id)}
                className="h-full w-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
