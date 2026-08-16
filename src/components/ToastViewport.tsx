"use client";

import { useEffect, useState } from "react";
import { Check, CircleAlert, Info, X } from "lucide-react";
import { TOAST_EVENT, type ToastDetail } from "@/lib/toast";

const ICONS = {
  success: Check,
  info: Info,
  error: CircleAlert,
};

export default function ToastViewport() {
  const [items, setItems] = useState<ToastDetail[]>([]);

  useEffect(() => {
    const timeoutIds = new Set<number>();
    const handleToast = (event: Event) => {
      const toast = (event as CustomEvent<ToastDetail>).detail;
      setItems((current) => [...current.slice(-2), toast]);
      const timeoutId = window.setTimeout(() => {
        setItems((current) => current.filter((item) => item.id !== toast.id));
        timeoutIds.delete(timeoutId);
      }, 2600);
      timeoutIds.add(timeoutId);
    };

    window.addEventListener(TOAST_EVENT, handleToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast);
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-4 top-20 z-[120] flex flex-col items-center gap-2 sm:left-auto sm:right-5 sm:items-end"
      aria-live="polite"
      aria-label="操作提示"
    >
      {items.map((item) => {
        const Icon = ICONS[item.tone];
        return (
          <div
            key={item.id}
            role={item.tone === "error" ? "alert" : "status"}
            className="pointer-events-auto flex min-w-0 max-w-sm items-center gap-2.5 rounded-full border border-[var(--border-line-color)] bg-[var(--surface)]/95 px-3.5 py-2.5 text-sm text-[var(--foreground)] shadow-[0_12px_32px_rgba(38,53,42,0.13)] backdrop-blur-xl motion-safe:animate-[toast-in_180ms_ease-out]"
          >
            <Icon
              className={`size-4 shrink-0 ${item.tone === "error" ? "text-[var(--accent-clay)]" : "text-[var(--accent-green)]"}`}
              aria-hidden="true"
            />
            <span className="truncate">{item.message}</span>
            <button
              type="button"
              onClick={() => setItems((current) => current.filter((toast) => toast.id !== item.id))}
              aria-label="关闭提示"
              className="rounded-full p-0.5 text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        );
      })}
      <style>{`@keyframes toast-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
