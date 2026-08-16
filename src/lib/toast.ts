export type ToastTone = "success" | "info" | "error";

export interface ToastDetail {
  id: string;
  message: string;
  tone: ToastTone;
}

export const TOAST_EVENT = "cloud-toast";

export function notify(message: string, tone: ToastTone = "info") {
  if (typeof window === "undefined") return;
  const detail: ToastDetail = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    message,
    tone,
  };
  window.dispatchEvent(new CustomEvent<ToastDetail>(TOAST_EVENT, { detail }));
}
