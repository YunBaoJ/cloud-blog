import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import test from "node:test";
import matter from "gray-matter";

const repositoryRoot = process.cwd();
const notesDirectory = join(repositoryRoot, "content", "notes");

function findMarkdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) return findMarkdownFiles(entryPath);
    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : [];
  });
}

function resolvePublicCoverPath(coverImage) {
  const publicPath = String(coverImage)
    .trim()
    .replace(/^(\.\.\/)+public\//, "/")
    .replace(/^(\.\/)+public\//, "/")
    .replace(/^public\//, "/")
    .replace(/^[/\\]+/, "");
  return join(repositoryRoot, "public", publicPath);
}

test("所有随笔都有完整且可用的 Frontmatter", () => {
  const files = findMarkdownFiles(notesDirectory);
  assert.ok(files.length > 0, "至少需要一篇随笔");

  const ids = new Set();
  for (const filePath of files) {
    const { data, content } = matter(readFileSync(filePath, "utf8"));
    const expectedId = basename(filePath, ".md");

    assert.equal(data.id, expectedId, `${filePath}: id 必须与文件名一致`);
    assert.equal(typeof data.title, "string", `${filePath}: 缺少 title`);
    assert.ok(data.title.trim(), `${filePath}: title 不能为空`);
    assert.equal(typeof data.summary, "string", `${filePath}: 缺少 summary`);
    assert.match(String(data.date), /^\d{4}-\d{2}-\d{2}$/, `${filePath}: date 必须为 YYYY-MM-DD`);
    assert.equal(typeof data.category, "string", `${filePath}: 缺少 category`);
    assert.ok(Array.isArray(data.tags), `${filePath}: tags 必须为数组`);
    assert.ok(content.trim(), `${filePath}: 正文不能为空`);
    assert.ok(!ids.has(data.id), `${filePath}: id 重复`);
    ids.add(data.id);

    if (data.coverImage) {
      const coverPath = resolvePublicCoverPath(data.coverImage);
      assert.ok(existsSync(coverPath), `${filePath}: 封面不存在 ${data.coverImage}`);
      assert.ok(String(data.coverAlt || "").trim(), `${filePath}: 有封面时必须填写 coverAlt`);
    }
  }
});
