import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateReadingProgress,
  calculateResumePosition,
  clampReadingProgress,
} from "./readingProgress.mts";

test("阅读进度始终限制在 0 到 100", () => {
  assert.equal(clampReadingProgress(-10), 0);
  assert.equal(clampReadingProgress(42.4), 42);
  assert.equal(clampReadingProgress(130), 100);
  assert.equal(clampReadingProgress(Number.NaN), 0);
});

test("阅读百分比与恢复位置使用同一可滚动高度", () => {
  assert.equal(calculateReadingProgress(600, 2000, 800), 50);
  assert.equal(calculateResumePosition(50, 2000, 800), 600);
  assert.equal(calculateReadingProgress(0, 800, 800), 100);
});
