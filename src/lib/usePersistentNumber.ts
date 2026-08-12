"use client";

import { useCallback, useSyncExternalStore } from "react";

const EVENT = "cloud-storage-change";

export function usePersistentNumber(key: string) {
  const subscribe = useCallback((callback: () => void) => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key) callback();
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener(EVENT, callback);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(EVENT, callback);
    };
  }, [key]);

  const getSnapshot = useCallback(() => localStorage.getItem(key) ?? "0", [key]);
  const value = Number(useSyncExternalStore(subscribe, getSnapshot, () => "0")) || 0;

  const setValue = useCallback((next: number) => {
    localStorage.setItem(key, String(next));
    window.dispatchEvent(new Event(EVENT));
  }, [key]);

  return [value, setValue] as const;
}
