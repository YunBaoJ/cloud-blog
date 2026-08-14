import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import test from "node:test";
import matter from "gray-matter";

const repositoryRoot = process.cwd();
const notesDirectory = join(repositoryRoot, "content", "notes");

test("所有随笔都有完整且可用的 Frontmatter", () => {
  const files = readdirSync(notesDirectory).filter((file) => file.endsWith(".md"));
  assert.ok(files.length > 0, "至少需要一篇随笔");

  const ids = new Set();
  for (const file of files) {
    const { data, content } = matter(readFileSync(join(notesDirectory, file), "utf8"));
    const expectedId = basename(file, ".md");

    assert.equal(data.id, expectedId, `${file}: id 必须与文件名一致`);
    assert.equal(typeof data.title, "string", `${file}: 缺少 title`);
    assert.ok(data.title.trim(), `${file}: title 不能为空`);
    assert.equal(typeof data.summary, "string", `${file}: 缺少 summary`);
    assert.match(String(data.date), /^\d{4}-\d{2}-\d{2}$/, `${file}: date 必须为 YYYY-MM-DD`);
    assert.equal(typeof data.category, "string", `${file}: 缺少 category`);
    assert.ok(Array.isArray(data.tags), `${file}: tags 必须为数组`);
    assert.ok(content.trim(), `${file}: 正文不能为空`);
    assert.ok(!ids.has(data.id), `${file}: id 重复`);
    ids.add(data.id);

    if (data.coverImage) {
      const coverPath = join(repositoryRoot, "public", String(data.coverImage).replace(/^[/\\]+/, ""));
      assert.ok(existsSync(coverPath), `${file}: 封面不存在 ${data.coverImage}`);
      assert.ok(String(data.coverAlt || "").trim(), `${file}: 有封面时必须填写 coverAlt`);
    }
  }
});
