import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { GALLERY_PHOTOS } from "@/data/siteContent";

const notesDirectory = path.join(process.cwd(), "content/notes");

export interface NoteItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  readTime?: string;
  iconName: string;
  coverImage?: string;
  coverAlt?: string;
  tags: string[];
  content: string;
  views?: number;
  likes?: number;
  featured?: boolean;
}

/**
 * 文件夹名称至标准分类名称的智能映射字典（支持中英文与常见别名）
 */
const FOLDER_CATEGORY_MAP: Record<string, string> = {
  // 英文/缩写目录映射
  engineering: "工程实战",
  projects: "工程实战",
  project: "工程实战",
  practice: "工程实战",
  code: "代码与思考",
  tech: "代码与思考",
  coding: "代码与思考",
  dev: "代码与思考",
  life: "生活与摄影",
  photography: "生活与摄影",
  photo: "生活与摄影",
  daily: "生活与摄影",
  design: "前端与设计",
  frontend: "前端与设计",
  ui: "前端与设计",
  ux: "前端与设计",

  // 中文目录直接映射
  实战: "工程实战",
  工程: "工程实战",
  工程实战: "工程实战",
  代码: "代码与思考",
  技术: "代码与思考",
  代码与思考: "代码与思考",
  生活: "生活与摄影",
  摄影: "生活与摄影",
  生活与摄影: "生活与摄影",
  设计: "前端与设计",
  前端: "前端与设计",
  前端与设计: "前端与设计",
};

/**
 * 根据文件夹名智能解析分类
 */
function resolveCategoryFromFolder(dirName: string): string {
  if (!dirName) return "随笔";
  const normalized = dirName.toLowerCase().trim();
  return FOLDER_CATEGORY_MAP[normalized] || dirName;
}

interface DiscoveredFile {
  fullPath: string;
  relativePath: string;
  dirName: string;
  fileName: string;
}

/**
 * 递归扫描 content/notes 目录及所有子分类目录中的 Markdown 文件
 */
function scanMarkdownFilesRecursively(dir: string, baseDir: string = dir): DiscoveredFile[] {
  let results: DiscoveredFile[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // 忽略隐藏目录与特殊前缀目录
      if (!entry.name.startsWith(".") && !entry.name.startsWith("_") && entry.name !== "node_modules") {
        results = results.concat(scanMarkdownFilesRecursively(fullPath, baseDir));
      }
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      // 过滤临时文件与隐藏文件
      if (!entry.name.startsWith(".") && !entry.name.startsWith("~") && !entry.name.endsWith(".tmp")) {
        const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
        const dirName = path.dirname(relativePath) === "." ? "" : path.basename(path.dirname(relativePath));
        results.push({
          fullPath,
          relativePath,
          dirName,
          fileName: entry.name,
        });
      }
    }
  }
  return results;
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

export function cleanImagePath(rawPath?: string | null): string {
  if (!rawPath || typeof rawPath !== "string" || !rawPath.trim()) {
    return "/og-cover.jpg";
  }
  let cleaned = rawPath.trim();
  // 移除可能存在的多层相对路径或 public 前缀
  cleaned = cleaned
    .replace(/^(\.\.\/)+public\//, "/")
    .replace(/^(\.\/)+public\//, "/")
    .replace(/^public\//, "/");

  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
    return cleaned;
  }
  if (!cleaned.startsWith("/")) {
    cleaned = `/${cleaned}`;
  }
  return cleaned;
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
      src: cleanImagePath(mdImgMatch[2]),
    };
  }

  // 匹配 <img src="url" alt="..." />
  const htmlImgMatch = rawContent.match(/<img[^>]+src=["'](.*?)["'][^>]*alt=["'](.*?)["']/i);
  if (htmlImgMatch && htmlImgMatch[1]) {
    return {
      src: cleanImagePath(htmlImgMatch[1]),
      alt: htmlImgMatch[2] || "文章配图",
    };
  }

  return null;
}

/**
 * 根据文章 ID 确定性挑选画廊中的精选照片作为默认封面
 */
function pickGalleryCover(id: string): { src: string; alt: string } {
  if (!GALLERY_PHOTOS || GALLERY_PHOTOS.length === 0) {
    return { src: "/og-cover.jpg", alt: "文章精选封面" };
  }
  const seed = [...id].reduce((sum, c) => sum + c.charCodeAt(0), 0);
  const photo = GALLERY_PHOTOS[seed % GALLERY_PHOTOS.length];
  return {
    src: photo.src,
    alt: photo.title || "画廊精选封面",
  };
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
 * 包含极其严谨的零配置智能容错、多级子目录分类支持与自动化元数据补全
 */
export function getAllNotes(): NoteItem[] {
  if (!fs.existsSync(notesDirectory)) {
    throw new Error(`文章目录不存在：${notesDirectory}`);
  }

  const discoveredFiles = scanMarkdownFilesRecursively(notesDirectory);
  const allNotesData: NoteItem[] = [];
  const usedCoverSet = new Set<string>();

  // 可用于去重兜底的全部画廊照片列表
  const fallbackPhotoPool = GALLERY_PHOTOS && GALLERY_PHOTOS.length > 0 
    ? GALLERY_PHOTOS.map((p) => p.src)
    : ["/gallery/【哲风壁纸】二次元-卡通.png", "/gallery/【搜图壁纸】四格-卡通.png", "/gallery/【哲风壁纸】剪影-壁纸-天空.png", "/gallery/【哲风壁纸】围墙白花-夜空-晨曦.png", "/gallery/【哲风壁纸】图片-夜晚-好看.png", "/gallery/【用户壁纸】蓝发-少女特写.jpg", "/gallery/【用户壁纸】持剑-黑发少女.jpg"];

  for (let i = 0; i < discoveredFiles.length; i++) {
    const fileInfo = discoveredFiles[i];
    try {
      const fileBaseName = fileInfo.fileName.replace(/\.md$/, "");
      const fileContents = fs.readFileSync(fileInfo.fullPath, "utf8");
      const fileStat = fs.statSync(fileInfo.fullPath);

      const { data, content } = matter(fileContents);

      // 1. id 智能兜底：优先 frontmatter.id，若未填写则使用文件名（去除.md）
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

      // 4. 封面图智能提取与严格防重复保障 (Zero-Duplicate Policy)
      const firstImg = extractFirstImage(content);
      let selectedCover = "";

      if (data.coverImage) {
        selectedCover = cleanImagePath(String(data.coverImage).trim());
      } else if (firstImg?.src) {
        selectedCover = cleanImagePath(firstImg.src);
      }

      // 如果未指定或者当前封面已与其他文章重复，从候选池挑选第一张未被占用的画廊封面
      if (!selectedCover || usedCoverSet.has(selectedCover)) {
        const unused = fallbackPhotoPool.find((img) => !usedCoverSet.has(img));
        if (unused) {
          selectedCover = unused;
        } else {
          // 如果池子全部耗尽，使用按索引安全偏移的封面
          selectedCover = fallbackPhotoPool[i % fallbackPhotoPool.length];
        }
      }

      usedCoverSet.add(selectedCover);
      const coverImage = selectedCover;

      const coverAlt = data.coverAlt
        ? String(data.coverAlt).trim()
        : firstImg?.alt || (data.coverImage ? title : "精选手记封面");

      // 5. 分类与标签智能识别：
      //    优先级：Frontmatter.category > 所在子目录名称 > 默认"随笔"
      let category = data.category ? String(data.category).trim() : "";
      if (!category) {
        category = resolveCategoryFromFolder(fileInfo.dirName);
      }

      let tags: string[] = [];
      if (Array.isArray(data.tags)) {
        tags = data.tags.map(String);
      } else if (typeof data.tags === "string") {
        tags = data.tags.split(/[,，\s]+/).filter(Boolean);
      }
      if (tags.length === 0) {
        tags = [category];
      }

      // 6. 日期智能兜底：未填则取文件的系统修改时间
      const date = formatValidDate(data.date, fileStat.mtime);

      allNotesData.push({
        id,
        title,
        summary,
        category,
        date,
        iconName: data.iconName || "Code2",
        coverImage,
        coverAlt,
        tags,
        content: content || "",
        featured: Boolean(data.featured),
      });
    } catch (err) {
      console.warn(`[Notes Loader] 暂无法读取文件 ${fileInfo.fileName}，已安全跳过:`, err);
    }
  }

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
