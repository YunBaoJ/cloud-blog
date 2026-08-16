"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  calculateReadingProgress,
  calculateResumePosition,
  clampReadingProgress,
} from "./readingProgress.mts";

export type ReadingFontSize = "sm" | "base" | "lg";

const FONT_SIZE_KEY = "cloud-reading-font-size";
const FONT_SIZE_EVENT = "cloud-reading-font-size-change";

function subscribeToFontSize(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === FONT_SIZE_KEY) callback();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(FONT_SIZE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(FONT_SIZE_EVENT, callback);
  };
}

function subscribeToSavedProgress() {
  return () => undefined;
}

function progressKey(noteId: string) {
  return `cloud-reading-progress:${noteId}`;
}

function isReadingFontSize(value: string | null): value is ReadingFontSize {
  return value === "sm" || value === "base" || value === "lg";
}

export function useReadingPreferences(noteId: string) {
  const fontSize = useSyncExternalStore<ReadingFontSize>(
    subscribeToFontSize,
    () => {
      const stored = localStorage.getItem(FONT_SIZE_KEY);
      return isReadingFontSize(stored) ? stored : "base";
    },
    () => "base" as const,
  );
  const storedProgress = useSyncExternalStore(
    subscribeToSavedProgress,
    () => clampReadingProgress(Number(localStorage.getItem(progressKey(noteId)))),
    () => 0,
  );
  const [dismissedNoteId, setDismissedNoteId] = useState("");
  const savedProgress = storedProgress >= 5 && storedProgress <= 95 ? storedProgress : 0;

  useEffect(() => {
    let frameId = 0;
    const storeProgress = () => {
      frameId = 0;
      const progress = calculateReadingProgress(
        window.scrollY,
        document.documentElement.scrollHeight,
        window.innerHeight,
      );
      const key = progressKey(noteId);
      if (progress < 3 || progress > 95) localStorage.removeItem(key);
      else localStorage.setItem(key, String(progress));
    };
    const handleScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(storeProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
      storeProgress();
    };
  }, [noteId]);

  const setFontSize = useCallback((next: ReadingFontSize) => {
    localStorage.setItem(FONT_SIZE_KEY, next);
    window.dispatchEvent(new Event(FONT_SIZE_EVENT));
  }, []);

  const resumeReading = useCallback(() => {
    const top = calculateResumePosition(
      savedProgress,
      document.documentElement.scrollHeight,
      window.innerHeight,
    );
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
    setDismissedNoteId(noteId);
  }, [noteId, savedProgress]);

  return {
    fontSize,
    setFontSize,
    savedProgress: dismissedNoteId === noteId ? 0 : savedProgress,
    resumeReading,
    dismissResume: () => setDismissedNoteId(noteId),
  };
}
