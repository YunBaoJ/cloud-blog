export interface Point {
  x: number;
  y: number;
}

export function clampZoom(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(3, Math.max(1, Math.round(value * 2) / 2));
}

export function clampPan(point: Point, scale: number, width: number, height: number): Point {
  if (scale <= 1) return { x: 0, y: 0 };
  const maxX = Math.max(0, width * (scale - 1) / 2);
  const maxY = Math.max(0, height * (scale - 1) / 2);
  return {
    x: Math.min(maxX, Math.max(-maxX, point.x)),
    y: Math.min(maxY, Math.max(-maxY, point.y)),
  };
}

export function getSwipeDirection(deltaX: number, deltaY: number, threshold = 64) {
  if (Math.abs(deltaX) < threshold || Math.abs(deltaX) <= Math.abs(deltaY)) return 0;
  return deltaX < 0 ? 1 : -1;
}
