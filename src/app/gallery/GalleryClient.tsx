"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ImageIcon, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Footer from "@/components/Footer";
import { GALLERY_PHOTOS, type GalleryPhoto } from "@/data/siteContent";
import { useMounted } from "@/lib/useMounted";
import { GALLERY_WORK_PARAM, getGalleryWorkHref } from "@/lib/galleryUrl.mts";
import GalleryArtworkViewer from "./GalleryArtworkViewer";

gsap.registerPlugin(useGSAP);

const PAGE_SIZE = 60;

export default function GalleryClient({ initialPhotos = GALLERY_PHOTOS }: { initialPhotos?: GalleryPhoto[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(() => new Set());
  const mounted = useMounted();
  const modalContentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const openedFromGalleryRef = useRef(false);
  const previousPhotoIdRef = useRef<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filteredPhotos = initialPhotos;
  const selectedPhotoId = searchParams.get(GALLERY_WORK_PARAM);
  const selectedPhoto = selectedPhotoId
    ? filteredPhotos.find((photo) => photo.id === selectedPhotoId) ?? null
    : null;
  const visiblePhotos = filteredPhotos.slice(0, visibleCount);
  const galleryColumns: Array<Array<{ photo: GalleryPhoto; index: number }>> = [[], [], []];
  visiblePhotos.forEach((photo, index) => {
    galleryColumns[index % galleryColumns.length].push({ photo, index });
  });
  const currentIndex = selectedPhoto
    ? filteredPhotos.findIndex((photo) => photo.id === selectedPhoto.id)
    : -1;

  useGSAP(
    () => {
      if (!selectedPhoto || !modalContentRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        modalContentRef.current,
        { opacity: 0, scale: 0.97, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.26, ease: "power2.out" },
      );
    },
    { dependencies: [selectedPhoto], revertOnUpdate: true },
  );

  const openPhoto = (photo: GalleryPhoto) => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    openedFromGalleryRef.current = true;
    router.push(getGalleryWorkHref(photo.id), { scroll: false });
  };

  const replacePhoto = useCallback((photo: GalleryPhoto) => {
    router.replace(getGalleryWorkHref(photo.id), { scroll: false });
  }, [router]);

  const closePhoto = useCallback(() => {
    if (openedFromGalleryRef.current) {
      openedFromGalleryRef.current = false;
      router.back();
      return;
    }
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  useEffect(() => {
    if (selectedPhoto && !previousPhotoIdRef.current) {
      window.requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });
    } else if (!selectedPhoto && previousPhotoIdRef.current) {
      triggerRef.current?.focus();
    }
    previousPhotoIdRef.current = selectedPhoto?.id ?? null;
  }, [selectedPhoto]);

  useEffect(() => {
    if (!selectedPhoto) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedPhoto]);

  useEffect(() => {
    if (!selectedPhoto) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePhoto();
        return;
      }
      if (event.key === "ArrowLeft" && currentIndex > 0) {
        event.preventDefault();
        replacePhoto(filteredPhotos[currentIndex - 1]);
        return;
      }
      if (event.key === "ArrowRight" && currentIndex < filteredPhotos.length - 1) {
        event.preventDefault();
        replacePhoto(filteredPhotos[currentIndex + 1]);
        return;
      }
      if (event.key !== "Tab" || !modalContentRef.current) return;

      const focusable = modalContentRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;

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

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closePhoto, currentIndex, filteredPhotos, replacePhoto, selectedPhoto]);

  const markImageFailed = (id: string) => {
    setFailedImageIds((current) => new Set(current).add(id));
  };

  return (
    <>
      <main className="min-h-[100dvh] bg-transparent text-[var(--foreground)]">
        <section className="px-5 pb-9 pt-28 sm:px-8 lg:px-12 lg:pt-32">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[var(--accent-green)]">
                <ImageIcon className="size-4" strokeWidth={1.8} />
                <span>作品画廊</span>
              </div>
              <h1 className="text-4xl font-light tracking-[-0.05em] sm:text-5xl">
                作品画廊
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                收录自己的插画、动漫作品与日常灵感，点开作品即可查看大图。
              </p>
            </div>

            <div className="mt-12 border-t border-[var(--border-line-color)] pt-4">
              <p className="text-xs text-[var(--muted)]">共 {filteredPhotos.length} 幅作品</p>
            </div>
          </div>
        </section>

        <section className="px-5 pb-24 pt-6 sm:px-8 lg:px-12 lg:pb-32 lg:pt-8">
          <div className="mx-auto max-w-6xl">
            {visiblePhotos.length > 0 ? (
              <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:items-start md:gap-x-12">
                {galleryColumns.map((column, columnIndex) => (
                  <div
                    key={columnIndex}
                    className={`space-y-10 ${columnIndex === 1 ? "md:pt-20" : columnIndex === 2 ? "md:pt-10" : ""}`}
                  >
                    {column.map(({ photo, index }) => {
                      return (
                        <article
                          key={photo.id}
                          className="gallery-artwork rounded-2xl bg-[var(--surface)]/85 p-2.5 shadow-[0_12px_30px_rgba(51,72,58,0.10)] ring-1 ring-white/70 backdrop-blur-[6px] sm:p-3 dark:ring-[var(--border-line-color)]"
                        >
                          <button
                            type="button"
                            onClick={() => openPhoto(photo)}
                            className="group block w-full text-left outline-none cursor-pointer"
                            aria-label={`查看作品：${photo.title}`}
                          >
                            <div className="relative overflow-hidden rounded-xl bg-[var(--surface-2)] shadow-[0_4px_18px_rgba(51,72,58,0.08)] dark:shadow-none">
                              <Image
                                src={photo.src}
                                alt={photo.title}
                                width={photo.width}
                                height={photo.height}
                                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                                loading={index < 6 ? "eager" : "lazy"}
                                className="h-auto w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.025] group-focus-visible:scale-[1.025]"
                              />
                            </div>
                            <div className="px-1 pb-1 pt-4">
                              <div className="relative h-px bg-[var(--border-line-color)]">
                                <div className="absolute inset-y-0 left-0 w-0 bg-[var(--accent-green)] transition-[width] duration-500 group-hover:w-full group-focus-visible:w-full" />
                              </div>
                              <p className="pt-3 text-base font-medium tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--accent-green)] group-focus-visible:text-[var(--accent-green)]">
                                {photo.title}
                              </p>
                              <div className="mt-1.5 flex items-center justify-between gap-3 text-[11px] tracking-wide text-[var(--muted)]">
                                <span className="truncate">{photo.source}</span>
                                <span className="shrink-0">{photo.date}</span>
                              </div>
                            </div>
                          </button>
                        </article>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-[var(--surface)] px-6 py-20 text-center ring-1 ring-[var(--border-line-color)]">
                <ImageIcon className="mx-auto size-8 text-[var(--accent-green)]" strokeWidth={1.6} />
                <h2 className="mt-4 text-lg font-bold">这个分类还没有作品</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">添加新图片后，它会自动出现在这里。</p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>

      {mounted && selectedPhoto && createPortal(
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--background)]/90 p-4 backdrop-blur-md sm:p-6 lg:p-10"
          onClick={(event) => {
            if (event.target === event.currentTarget) closePhoto();
          }}
        >
          <div
            ref={modalContentRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-dialog-title"
            className="grid max-h-[90dvh] w-full max-w-6xl overflow-hidden rounded-2xl bg-[var(--surface)] text-[var(--foreground)] shadow-[0_24px_70px_rgba(14,24,18,0.18)] lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.65fr)]"
          >
            <GalleryArtworkViewer
              key={selectedPhoto.id}
              photos={filteredPhotos}
              currentIndex={currentIndex}
              failedImageIds={failedImageIds}
              onImageError={markImageFailed}
              onSelect={replacePhoto}
            />

            <div className="flex max-h-[46dvh] flex-col overflow-y-auto p-6 sm:p-8 lg:max-h-[90dvh]">
              <div className="flex items-center justify-between gap-4 border-b border-[var(--border-line-color)] pb-4 text-[10px] font-mono tracking-[0.14em] text-[var(--muted)]">
                <span>作品档案</span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closePhoto}
                  className="rounded-full p-2 text-[var(--muted)] ring-1 ring-[var(--border-line-color)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] active:scale-[0.98]"
                  aria-label="关闭作品预览"
                >
                  <X className="size-4" strokeWidth={1.8} />
                </button>
              </div>

              <div className="mt-7">
                <h2 id="gallery-dialog-title" className="text-2xl font-light tracking-tight sm:text-3xl">
                  {selectedPhoto.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{selectedPhoto.story}</p>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <p className="text-[10px] font-mono font-semibold tracking-[0.16em] text-[var(--accent-green)]">[01] 作品信息</p>
                  <div className="mt-3 space-y-3 rounded-lg border border-[var(--border-line-color)] p-4 text-xs text-[var(--muted)]">
                    <div className="flex justify-between gap-4"><span>类型</span><span>{selectedPhoto.categoryLabel}</span></div>
                    <div className="flex justify-between gap-4"><span>来源</span><span>{selectedPhoto.source}</span></div>
                    {selectedPhoto.sourceUrl ? (
                      <div className="flex justify-between gap-4"><span>原址</span><a href={selectedPhoto.sourceUrl} target="_blank" rel="noreferrer" className="text-[var(--accent-green)] underline underline-offset-2">查看原址</a></div>
                    ) : (
                      <p className="border-t border-[var(--border-line-color)] pt-3 leading-5">
                        {selectedPhoto.attributionNote ?? "收藏作品仅作个人展示，原作者与原始链接待补。"}
                      </p>
                    )}
                    <div className="flex justify-between gap-4"><span>收录</span><span>{selectedPhoto.date}</span></div>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-mono font-semibold tracking-[0.16em] text-[var(--accent-green)]">[02] 浏览说明</p>
                  <div className="mt-3 rounded-lg border border-[var(--border-line-color)] p-4 text-xs leading-6 text-[var(--muted)]">
                    使用左右按钮、键盘方向键或横向滑动浏览；双击图片可快速缩放。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
