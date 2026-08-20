import "server-only";
import fs from "fs";
import path from "path";
import { GALLERY_PHOTOS, type GalleryPhoto } from "@/data/siteContent";

const galleryDir = path.join(process.cwd(), "public/gallery");

/**
 * 快速读取图片二进制头部获取准确物理尺寸
 */
function getImageDimensions(filePath: string): { width: number; height: number } {
  try {
    const buffer = fs.readFileSync(filePath);
    // PNG 格式
    if (buffer.length > 24 && buffer.toString("ascii", 1, 4) === "PNG") {
      return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
    }
    // JPEG 格式
    if (buffer.length > 10 && buffer[0] === 0xFF && buffer[1] === 0xD8) {
      let offset = 2;
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xFF) break;
        const marker = buffer[offset + 1];
        if (marker === 0xC0 || marker === 0xC2) {
          return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
        }
        const len = buffer.readUInt16BE(offset + 2);
        offset += 2 + len;
      }
    }
  } catch (err) {
    console.warn(`无法读取图片尺寸：${filePath}`, err);
  }
  return { width: 1920, height: 1080 };
}

/**
 * 格式化清理文件名生成优雅标题
 */
function formatPhotoTitle(rawFileName: string): string {
  const base = rawFileName
    .replace(/\.[^/.]+$/, "") // 去掉后缀
    .replace(/^【.*?】/, "") // 去掉【哲风壁纸】等标签
    .replace(/^搜图神器_\d+/, "视觉插画") // 清理搜图神器前缀
    .replace(/[._-]+/g, " · ")
    .trim();

  return base || "画廊精选作品";
}

/**
 * 智能推断分类
 */
function inferCategory(fileName: string): { category: "daily" | "scenery" | "collection"; categoryLabel: string } {
  const lower = fileName.toLowerCase();
  if (lower.includes("coffee") || lower.includes("latte") || lower.includes("reading") || lower.includes("日常") || lower.includes("咖啡") || lower.includes("人行道")) {
    return { category: "daily", categoryLabel: "日常光线" };
  }
  if (lower.includes("sunset") || lower.includes("nature") || lower.includes("bamboo") || lower.includes("天空") || lower.includes("夜空") || lower.includes("云层") || lower.includes("地球") || lower.includes("公路") || lower.includes("山石")) {
    return { category: "scenery", categoryLabel: "自然与空间" };
  }
  return { category: "collection", categoryLabel: "作品收藏" };
}

/**
 * 获取全量画廊照片列表（从 public/gallery 物理目录自动扫描并与预置精选合并）
 */
export function getAllGalleryPhotos(): GalleryPhoto[] {
  if (!fs.existsSync(galleryDir)) {
    return GALLERY_PHOTOS;
  }

  const existingMap = new Map<string, GalleryPhoto>();
  GALLERY_PHOTOS.forEach((photo) => {
    const key = photo.src.replace(/^\/gallery\//, "").toLowerCase();
    existingMap.set(key, photo);
  });

  const fileNames = fs.readdirSync(galleryDir);
  const resultPhotos: GalleryPhoto[] = [];

  for (const fileName of fileNames) {
    // 仅识别常见图片扩展名
    if (!/\.(jpe?g|png|webp|avif|gif)$/i.test(fileName)) {
      continue;
    }

    const key = fileName.toLowerCase();
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    const fullPath = path.join(galleryDir, fileName);
    const fileStat = fs.statSync(fullPath);
    const dateStr = fileStat.mtime.toISOString().split("T")[0];
    const { width, height } = getImageDimensions(fullPath);

    // 如果已经在预置列表里配置过详细信息，优先保留并更新真实尺寸
    if (existingMap.has(key)) {
      const p = existingMap.get(key)!;
      resultPhotos.push({
        ...p,
        width: p.width || width,
        height: p.height || height,
      });
      continue;
    }

    // 全自动根据文件名与属性生成画作信息
    const { category, categoryLabel } = inferCategory(fileName);
    const title = formatPhotoTitle(fileName);

    resultPhotos.push({
      id: `photo-${encodeURIComponent(baseName)}`,
      title,
      category,
      categoryLabel,
      src: `/gallery/${fileName}`,
      width,
      height,
      source: "画廊收藏",
      date: dateStr,
      story: `${title}。静止的光影与色彩定格在这一瞬间。`,
    });
  }

  // 按日期降序排列
  return resultPhotos.sort((a, b) => (a.date < b.date ? 1 : -1));
}
