import assert from "node:assert/strict";
import test from "node:test";
import { buildActivityItems } from "./activity.mts";

test("按日期倒序合并笔记与图集，并生成正确目标", () => {
  const activities = buildActivityItems(
    [
      { id: "note-old", title: "旧笔记", summary: "较早的记录", date: "2026-08-01" },
      { id: "note-new", title: "新笔记", summary: "最新的记录", date: "2026-08-13" },
    ],
    [
      {
        id: "photo-mid",
        title: "一幅作品",
        story: "图集说明",
        date: "2026-08-08",
        src: "/gallery/photo.jpg",
        width: 1200,
        height: 800,
      },
    ],
  );

  assert.deepEqual(
    activities.map(({ id, kind, href }) => ({ id, kind, href })),
    [
      { id: "note-note-new", kind: "note", href: "/notes/note-new" },
      { id: "gallery-photo-mid", kind: "gallery", href: "/gallery" },
      { id: "note-note-old", kind: "note", href: "/notes/note-old" },
    ],
  );
  assert.equal(activities[1].image?.src, "/gallery/photo.jpg");
  assert.equal(activities[1].image?.width, 1200);
  assert.equal(activities[1].image?.height, 800);
});

test("遵守条数限制并保持同日期输出稳定", () => {
  const activities = buildActivityItems(
    [
      { id: "b", title: "乙", summary: "", date: "2026-08-13" },
      { id: "a", title: "甲", summary: "", date: "2026-08-13" },
      { id: "older", title: "旧", summary: "", date: "2026-08-01" },
    ],
    [],
    2,
  );

  assert.deepEqual(activities.map((item) => item.id), ["note-a", "note-b"]);
});
