import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const notesDirectory = path.join(process.cwd(), "content/notes");

export interface NoteItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  readTime: string;
  wordCount?: number;
  iconName: string;
  coverImage?: string;
  coverAlt?: string;
  tags: string[];
  content: string;
  views: number;
  likes: number;
  featured?: boolean;
}

/**
 * 确定性哈希，生成稳定自然且不跳变的阅读量和点赞数
 */
function deterministicMetric(id: string, minimum: number, range: number): number {
  const seed = [...id].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return minimum + (seed % range);
}

/**
 * 智能计算中文字数、英文单词数与预估阅读时长
 */
function calculateReadingStats(rawContent: string): { readTime: string; wordCount: number } {
  if (!rawContent || !rawContent.trim()) {
    return { readTime: "1 min read", wordCount: 0 };
  }

  // 1. 去除代码块和图片标记，统计正文纯文本字数
  const textWithoutCode = rawContent
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/<.*?>/g, "");

  // 中文字符数
  const chineseMatch = textWithoutCode.match(/[\u4e00-\u9fa5]/g);
  const chineseChars = chineseMatch ? chineseMatch.length : 0;

  // 英文及数字词数
  const englishMatch = textWithoutCode.match(/\b[a-zA-Z0-9_-]+\b/g);
  const englishWords = englishMatch ? englishMatch.length : 0;

  // 代码块行数（阅读代码通常比普通文本稍慢）
  const codeBlocks = rawContent.match(/```[\s\S]*?```/g) || [];
  const codeLines = codeBlocks.reduce((acc, block) => acc + block.split("\n").length, 0);

  const totalWords = chineseChars + englishWords;

  // 中文约 320字/分钟，英文约 180词/分钟，代码约 20行/分钟
  const readingMinutes = Math.max(
    1,
    Math.ceil(chineseChars / 320 + englishWords / 180 + codeLines / 25)
  );

  return {
    readTime: `${readingMinutes} min read`,
    wordCount: totalWords,
  };
}

/**
 * 智能提取正文第一段作为摘要（自动清除 Markdown 语法标记）
 */
function extractSmartSummary(rawContent: string, fallbackTitle: string): string {
  if (!rawContent) return fallbackTitle;

  const lines = rawContent.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    // 跳过空行、大标题、分割线、代码块开头、图片
    if (
      !trimmed ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("---") ||
      trimmed.startsWith("```") ||
      trimmed.startsWith("![") ||
      trimmed.startsWith(">")
    ) {
      continue;
    }

    // 清除行内 Markdown 语法（加粗、链接、行内代码）
    const cleanText = trimmed
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/[*_`~]/g, "")
      .trim();

    if (cleanText.length >= 10) {
      return cleanText.length > 130 ? `${cleanText.slice(0, 130)}...` : cleanText;
    }
  }

  return fallbackTitle;
}

/**
 * 智能扫描提取正文中出现的第一张图片作为封面
 */
function extractFirstImage(rawContent: string): { src: string; alt: string } | null {
  if (!rawContent) return null;

  // 匹配 ![alt](url)
  const mdImgMatch = rawContent.match(/!\[(.*?)\]\((.*?)\)/);
  if (mdImgMatch && mdImgMatch[2]) {
    return {
      alt: mdImgMatch[1] || "文章配图",
      src: mdImgMatch[2],
    };
  }

  // 匹配 <img src="url" alt="..." />
  const htmlImgMatch = rawContent.match(/<img[^>]+src=["'](.*?)["'][^>]*alt=["'](.*?)["']/i);
  if (htmlImgMatch && htmlImgMatch[1]) {
    return {
      src: htmlImgMatch[1],
      alt: htmlImgMatch[2] || "文章配图",
    };
  }

  return null;
}

/**
 * 从正文中提取首个 H1 标题
 */
function extractH1Title(rawContent: string): string | null {
  const match = rawContent.match(/^#\s+(.+)$/m);
  return match && match[1] ? match[1].trim() : null;
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
function formatValidDate(dateInput: unknown, fallbackMtime: Date): string {
  if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
    return dateInput.toISOString().split("T")[0];
  }
  if (typeof dateInput === "string" && dateInput.trim()) {
    const trimmed = dateInput.trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      return trimmed.slice(0, 10);
    }
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split("T")[0];
    }
  }
  return fallbackMtime.toISOString().split("T")[0];
}

/**
 * 获取全部文章列表（自动按发布时间降序）
 * 包含极其严谨的零配置智能容错与自动化元数据补全
 */
export function getAllNotes(): NoteItem[] {
  if (!fs.existsSync(notesDirectory)) {
    throw new Error(`文章目录不存在：${notesDirectory}`);
  }

  const fileNames = fs.readdirSync(notesDirectory);
  const allNotesData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const fileBaseName = fileName.replace(/\.md$/, "");
      const fullPath = path.join(notesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const fileStat = fs.statSync(fullPath);

      const { data, content } = matter(fileContents);

      // 1. id 智能兜底：优先 frontmatter.id，若未填写则使用文件名
      const id = data.id ? String(data.id).trim() : fileBaseName;

      // 2. title 智能兜底：优先 frontmatter.title，次选正文首个 # 标题，若仍无则格式化文件名
      const autoH1 = extractH1Title(content);
      const title = data.title
        ? String(data.title).trim()
        : autoH1 || fileBaseName.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

      // 3. summary 智能提取：若未提供则从正文第一段智能提炼
      const summary = data.summary
        ? String(data.summary).trim()
        : extractSmartSummary(content, title);

      // 4. 字数与阅读时长智能精确计算
      const { readTime: autoReadTime, wordCount } = calculateReadingStats(content);
      const readTime = data.readTime ? String(data.readTime).trim() : autoReadTime;

      // 5. 封面图智能提取：若未提供则自动抓取正文第一张插图
      const firstImg = extractFirstImage(content);
      const coverImage = data.coverImage
        ? String(data.coverImage).trim()
        : firstImg?.src || "/og-cover.jpg";
      const coverAlt = data.coverAlt
        ? String(data.coverAlt).trim()
        : firstImg?.alt || title;

      // 6. 分类与标签智能兜底
      const category = data.category ? String(data.category).trim() : "随笔";
      let tags: string[] = [];
      if (Array.isArray(data.tags)) {
        tags = data.tags.map(String);
      } else if (typeof data.tags === "string") {
        tags = data.tags.split(/[,，\s]+/).filter(Boolean);
      }
      if (tags.length === 0) {
        tags = [category];
      }

      // 7. 日期智能兜底：未填则取文件的系统修改时间
      const date = formatValidDate(data.date, fileStat.mtime);

      return {
        id,
        title,
        summary,
        category,
        date,
        readTime,
        wordCount,
        iconName: data.iconName || "Code2",
        coverImage,
        coverAlt,
        tags,
        content: content || "",
        views: data.views ?? deterministicMetric(id, 200, 800),
        likes: data.likes ?? deterministicMetric(id, 10, 80),
        featured: Boolean(data.featured),
      } satisfies NoteItem;
    });

  // 按日期从新到旧严格排序
  return allNotesData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getNoteById(id: string): NoteItem | undefined {
  const notes = getAllNotes();
  return notes.find((note) => note.id === id);
}

export function getFeaturedNotes(): NoteItem[] {
  const notes = getAllNotes();
  const featured = notes.filter((n) => n.featured);
  return featured.length > 0 ? featured : notes.slice(0, 3);
}
