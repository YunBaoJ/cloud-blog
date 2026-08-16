export function clampReadingProgress(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function calculateReadingProgress(scrollY: number, scrollHeight: number, viewportHeight: number) {
  const scrollableHeight = Math.max(0, scrollHeight - viewportHeight);
  if (scrollableHeight === 0) return 100;
  return clampReadingProgress((scrollY / scrollableHeight) * 100);
}

export function calculateResumePosition(progress: number, scrollHeight: number, viewportHeight: number) {
  const scrollableHeight = Math.max(0, scrollHeight - viewportHeight);
  return Math.round(scrollableHeight * (clampReadingProgress(progress) / 100));
}
