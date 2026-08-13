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
  date: string;
  story: string;
}

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "photo-1",
    title: "孤独摇滚 · 蓝色短发遐思",
    category: "collection",
    categoryLabel: "动漫作品",
    src: "/gallery/user-wallpaper-2.jpg",
    width: 2880,
    height: 1800,
    source: "用户壁纸精选",
    date: "2026-08-12",
    story: "深蓝发梢与清冷眼神，留在微阴天幕下最安静的旋律瞬间。",
  },
  {
    id: "photo-2",
    title: "黑夜天际线 · 凌晨未眠",
    category: "scenery",
    categoryLabel: "黑夜与氛围",
    src: "/gallery/user-wallpaper-1.jpg",
    width: 2320,
    height: 1732,
    source: "用户壁纸精选",
    date: "2026-08-10",
    story: "雨后城市的静谧暗影，在远方的天际线里留下一缕漫射的光。",
  },
  {
    id: "photo-3",
    title: "漫步光影 · 日常灵感",
    category: "daily",
    categoryLabel: "日常光线",
    src: "/gallery/user-wallpaper-3.jpg",
    width: 1280,
    height: 800,
    source: "用户壁纸精选",
    date: "2026-08-05",
    story: "从晨曦到暮色，镜头记录下那些普通但值得长久回味的日常。",
  },
  {
    id: "photo-4",
    title: "二次元视觉 · 梦幻纪元",
    category: "collection",
    categoryLabel: "作品收藏",
    src: "/gallery/user-wallpaper-4.png",
    width: 5120,
    height: 2880,
    source: "用户壁纸精选",
    date: "2026-07-28",
    story: "细腻的手绘线条与柔和色调，构成沉浸感十足的幻想世界。",
  },
  {
    id: "photo-5",
    title: "暮光纪事 · 远方地平线",
    category: "scenery",
    categoryLabel: "自然与天空",
    src: "/gallery/user-wallpaper-5.jpg",
    width: 4568,
    height: 2855,
    source: "用户壁纸精选",
    date: "2026-07-20",
    story: "地平线尽头的霞光收拢，将大地与风带入宁静的夜曲。",
  },
  {
    id: "photo-6",
    title: "极简意境 · 独行角落",
    category: "daily",
    categoryLabel: "思考角落",
    src: "/gallery/user-wallpaper-6.jpg",
    width: 2729,
    height: 1536,
    source: "用户壁纸精选",
    date: "2026-07-15",
    story: "在喧嚣城市中留出一角安安静静的空间，属于思考与发呆。",
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
