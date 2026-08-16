import assert from "node:assert/strict";
import test from "node:test";
import { clampPan, clampZoom, getSwipeDirection } from "./galleryInteraction.mts";

test("画廊缩放限制为 100% 到 300% 且按半级递增", () => {
  assert.equal(clampZoom(0.5), 1);
  assert.equal(clampZoom(1.26), 1.5);
  assert.equal(clampZoom(4), 3);
});

test("拖动范围随缩放比例限制并在原始比例归零", () => {
  assert.deepEqual(clampPan({ x: 80, y: -70 }, 1, 100, 100), { x: 0, y: 0 });
  assert.deepEqual(clampPan({ x: 180, y: -140 }, 2, 200, 120), { x: 100, y: -60 });
});

test("只有明确的水平手势才切换作品", () => {
  assert.equal(getSwipeDirection(-90, 12), 1);
  assert.equal(getSwipeDirection(90, 12), -1);
  assert.equal(getSwipeDirection(40, 2), 0);
  assert.equal(getSwipeDirection(90, 120), 0);
});
