export interface PlaygroundItem {
  id: string;
  title: string;
  description: string;
  tag: string;
  icon: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: "collection" | "daily" | "scenery";
  categoryLabel: string;
  src: string;
  width: number;
  height: number;
  source: string;
  sourceUrl?: string;
  attributionNote?: string;
  date: string;
  story: string;
}

export interface NowUpdate {
  date: string;
  title: string;
  summary: string;
}

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "photo-1",
    title: "蓝发少女 · 静谧片刻",
    category: "collection",
    categoryLabel: "动漫作品",
    src: "/gallery/【用户壁纸】蓝发-少女特写.jpg",
    width: 2880,
    height: 1800,
    source: "个人收藏",
    date: "2026-08-12",
    story: "深蓝发梢与清冷眼神，留在微阴天幕下最安静的旋律瞬间。",
  },
  {
    id: "photo-2",
    title: "持剑少女 · 暗色剪影",
    category: "collection",
    categoryLabel: "动漫收藏",
    src: "/gallery/【用户壁纸】持剑-黑发少女.jpg",
    width: 2320,
    height: 1732,
    source: "个人收藏",
    date: "2026-08-10",
    story: "深色衣摆和微光构成安静的轮廓，让画面停在夜色刚刚落下的时刻。",
  },
  {
    id: "photo-3",
    title: "四格卡通 · 轻快灵感",
    category: "collection",
    categoryLabel: "作品收藏",
    src: "/gallery/【搜图壁纸】四格-卡通.png",
    width: 3304,
    height: 1790,
    source: "个人收藏",
    date: "2026-08-05",
    story: "拼贴式的小画面把不同情绪并置在一起，保留轻松明亮的视觉节奏。",
  },
  {
    id: "photo-4",
    title: "二次元卡通 · 梦幻纪元",
    category: "collection",
    categoryLabel: "作品收藏",
    src: "/gallery/【哲风壁纸】二次元-卡通.png",
    width: 6000,
    height: 3375,
    source: "个人收藏",
    date: "2026-07-28",
    story: "细腻的手绘线条与柔和色调，构成沉浸感十足的幻想世界。",
  },
  {
    id: "photo-5",
    title: "红衣少女 · 夜色花影",
    category: "collection",
    categoryLabel: "动漫收藏",
    src: "/gallery/【用户壁纸】白发-红衣少女.jpg",
    width: 4568,
    height: 2855,
    source: "个人收藏",
    date: "2026-07-20",
    story: "红色花影与浅色发丝并置，像夜晚里被短暂照亮的一页插画。",
  },
  {
    id: "photo-6",
    title: "海边少女 · 晴日光线",
    category: "collection",
    categoryLabel: "动漫收藏",
    src: "/gallery/【搜图壁纸】海边-白发少女.jpg",
    width: 3840,
    height: 2160,
    source: "个人收藏",
    date: "2026-07-15",
    story: "明亮的海天色调与发梢的轻微摆动，留下夏日午后的松弛感。",
  },
  {
    id: "photo-7",
    title: "日暮天际线与孤独剪影",
    category: "collection",
    categoryLabel: "作品收藏",
    src: "/gallery/【哲风壁纸】剪影-壁纸-天空.png",
    width: 2732,
    height: 1534,
    source: "个人收藏",
    date: "2026-06-28",
    story: "木质书桌、翻开的书页与障子窗外透进来的漫射光，营造出和质静谧氛围。",
  },
  {
    id: "photo-8",
    title: "发丝飞扬的手绘微风",
    category: "collection",
    categoryLabel: "作品收藏",
    src: "/gallery/【哲风壁纸】发丝-手绘少女.png",
    width: 3840,
    height: 2160,
    source: "Spring Blogs 图库",
    date: "2025-11-08",
    story: "细腻的线条描绘出风吹过发丝的瞬间，画面保留了轻柔安静的留白。",
  },
  {
    id: "photo-9",
    title: "围墙白花与夜空晨曦",
    category: "scenery",
    categoryLabel: "自然与空间",
    src: "/gallery/【哲风壁纸】围墙白花-夜空-晨曦.png",
    width: 4200,
    height: 2800,
    source: "Spring Blogs 图库",
    date: "2025-10-14",
    story: "深蓝天幕前的白花在晨曦里静静展开，冷暖之间留住短暂的交界。",
  },
  {
    id: "photo-10",
    title: "幽静蓝色森林之夜",
    category: "scenery",
    categoryLabel: "自然与空间",
    src: "/gallery/【哲风壁纸】图片-夜晚-好看.png",
    width: 2732,
    height: 1534,
    source: "Spring Blogs 图库",
    date: "2025-09-02",
    story: "繁星与薄雾覆盖林地，深蓝色调让画面像一段安静的夜间散步。",
  },
];

// Edit this list when there is a short personal update that does not belong to a note or gallery entry.
export const NOW_UPDATES: NowUpdate[] = [
  {
    date: "2026-08-16",
    title: "整理数字小屋",
    summary: "收束首页内容，继续整理画廊与笔记的展示体验。",
  },
];

export const PLAYGROUND_ITEMS: PlaygroundItem[] = [
  {
    id: "snake",
    title: "贪吃蛇大冒险",
    description: "经典 8-bit 像素复古画风，考验敏捷反应与走位灵敏度。",
    tag: "经典像素",
    icon: "Snake",
  },
  {
    id: "2048",
    title: "2048 益智数字",
    description: "经典 4x4 数字方块合成，体验动脑与消除的乐趣。",
    tag: "脑力益智",
    icon: "Grid",
  },
  {
    id: "puzzle",
    title: "数字华容道拼图",
    description: "4x4 数字圆角滑动拼图，在丝滑位移中挑战用时与步数。",
    tag: "逻辑挑战",
    icon: "Gamepad",
  },
  {
    id: "gomoku",
    title: "五子棋竞技场",
    description: "支持单人 Minimax AI 对弈与双人切磋，体验瞬间绝杀的博弈魅力。",
    tag: "五子棋AI",
    icon: "Bot",
  },
  {
    id: "xiangqi",
    title: "中国象棋 AI",
    description: "楚河汉界，运筹帷幄。内置 Minimax 剪枝 AI 与 AI 军师步进模式。",
    tag: "象棋博弈",
    icon: "Award",
  },
];
