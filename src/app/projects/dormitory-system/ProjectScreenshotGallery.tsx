"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import type { ProjectCaseStudy } from "@/data/projects";

type Screenshot = ProjectCaseStudy["screenshots"][number];

export default function ProjectScreenshotGallery({
  screenshots,
  featured = true,
}: {
  screenshots: ProjectCaseStudy["screenshots"];
  featured?: boolean;
}) {
  const visibleScreenshots = featured ? screenshots : screenshots.slice(1);
  const [login, ...workbenches] = visibleScreenshots;
  const gridScreenshots = featured ? workbenches : visibleScreenshots;

  return (
    <>
      {featured && login ? (
        <figure className="overflow-hidden rounded-[1.5rem] bg-[var(--surface)] ring-1 ring-[var(--border-line-color)] shadow-[0_18px_50px_rgba(45,43,44,0.08)]">
          <ProjectScreenshotPreview screenshot={login} priority />
        </figure>
      ) : null}

      {gridScreenshots.length > 0 ? (
        <div className={`${featured ? "mt-5" : "mt-8"} grid gap-5 md:grid-cols-3`}>
          {gridScreenshots.map((screenshot) => (
            <figure
              key={screenshot.src}
              className="overflow-hidden rounded-[1.25rem] bg-[var(--surface)] ring-1 ring-[var(--border-line-color)] shadow-[0_12px_34px_rgba(45,43,44,0.07)]"
            >
              <ProjectScreenshotPreview screenshot={screenshot} />
            </figure>
          ))}
        </div>
      ) : null}
    </>
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
        className="block w-full cursor-zoom-in outline-none transition-[filter,transform] duration-200 hover:brightness-[0.97] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[var(--accent-green)] focus-visible:ring-inset motion-reduce:transition-none"
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
          className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(246,244,236,0.92)] p-4 backdrop-blur-sm sm:p-8"
          onClick={(event) => {
            if (!panelRef.current?.contains(event.target as Node)) {
              setSelectedScreenshot(null);
            }
          }}
        >
          <div className="mx-auto flex min-h-full max-w-6xl items-center">
            <div ref={panelRef} className="relative w-full overflow-hidden rounded-[1.5rem] bg-[#FFFEF9] p-2 text-[#33483A] shadow-[0_24px_80px_rgba(45,43,44,0.16)] ring-1 ring-[rgba(113,143,110,0.25)] sm:p-3">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setSelectedScreenshot(null)}
                className="absolute right-5 top-5 z-10 inline-flex size-10 items-center justify-center rounded-full bg-[#FFFEF9] text-[#33483A] shadow-[0_8px_20px_rgba(45,43,44,0.12)] outline-none transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-[var(--accent-green)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FFFEF9] motion-reduce:transition-none"
                aria-label="关闭放大预览"
              >
                <X className="size-5" strokeWidth={1.8} aria-hidden="true" />
              </button>
              <Image
                src={selectedScreenshot.src}
                alt={selectedScreenshot.alt}
                width={selectedScreenshot.width}
                height={selectedScreenshot.height}
                sizes="100vw"
                className="h-auto max-h-[calc(100dvh-4rem)] w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
