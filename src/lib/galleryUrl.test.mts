import assert from "node:assert/strict";
import test from "node:test";
import { getGalleryWorkHref } from "./galleryUrl.mts";

test("生成可分享且经过编码的画廊作品地址", () => {
  assert.equal(getGalleryWorkHref("photo-1"), "/gallery?work=photo-1");
  assert.equal(getGalleryWorkHref("插画 01"), "/gallery?work=%E6%8F%92%E7%94%BB%2001");
});
