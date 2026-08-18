import "server-only";
import fs from "fs";
import path from "path";
import { GALLERY_PHOTOS, type GalleryPhoto } from "@/data/siteContent";

const galleryDir = path.join(process.cwd(), "public/gallery");

const TITLE_TRANSLATION_MAP: Record<string, { title: string; story: string; category: "daily" | "scenery" | "collection"; categoryLabel: string }> = {
  "bamboo": {
    title: "竹林幽径 · 晨间漫步",
    story: "修竹摇曳与斑驳光影，晨间的微风掠过带来静心的清凉。",
    category: "scenery",
    categoryLabel: "自然与空间",
  },
  "coffee": {
    title: "手冲咖啡 · 慢萃时光",
    story: "水流注入深褐粉层泛起的金色油脂，是唤醒晨光的静默仪式。",
    category: "daily",
    categoryLabel: "日常光线",
  },
  "latte": {
    title: "拿铁拉花 · 温暖午后",
    story: "醇厚奶泡与咖啡交融的纹理，记录下一段安静温暖的午后独处。",
    category: "daily",
    categoryLabel: "日常光线",
  },
  "nature": {
    title: "森林秘境 · 绿意盎然",
    story: "林木深处的繁茂生机与穿透树冠的光束，是自然最诚挚的馈赠。",
    category: "scenery",
    categoryLabel: "自然与空间",
  },
  "reading": {
    title: "翻阅书页 · 沉浸阅读",
    story: "书桌前泛黄的书页与指尖滑过的触感，让思绪在文字间自由流淌。",
    category: "daily",
    categoryLabel: "思考角落",
  },
  "sunset": {
    title: "暮色霞光 · 归途黄昏",
    story: "地平线渐次晕开的暖橙与紫雾，为喧嚣的一天缓缓拉下温柔的序幕。",
    category: "scenery",
    categoryLabel: "自然与天空",
  },
};

/**
 * 格式化清理文件名生成优雅标题
 */
function formatPhotoTitle(rawFileName: string): string {
  const base = rawFileName
    .replace(/\.[^/.]+$/, "") // 去掉后缀
    .replace(/^【.*?】/, "") // 去掉【哲风壁纸】等标签
    .replace(/^搜图神器_\d+\.?\./, "精选作品-") // 清理搜图神器前缀
    .replace(/[._-]+/g, " ")
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
    // 归一化路径匹配
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

    // 如果已经在预置列表里配置过详细信息，优先保留
    if (existingMap.has(key)) {
      resultPhotos.push(existingMap.get(key)!);
      continue;
    }

    // 检查是否有预设精修文案映射
    const customInfo = TITLE_TRANSLATION_MAP[baseName.toLowerCase()];
    if (customInfo) {
      resultPhotos.push({
        id: `photo-${baseName}`,
        title: customInfo.title,
        category: customInfo.category,
        categoryLabel: customInfo.categoryLabel,
        src: `/gallery/${fileName}`,
        width: 2400,
        height: 1600,
        source: "相册精选",
        date: dateStr,
        story: customInfo.story,
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
      width: 2400,
      height: 1600,
      source: "画廊收藏",
      date: dateStr,
      story: `${title}。静止的光影与色彩定格在这一瞬间。`,
    });
  }

  // 按日期降序排列
  return resultPhotos.sort((a, b) => (a.date < b.date ? 1 : -1));
}
