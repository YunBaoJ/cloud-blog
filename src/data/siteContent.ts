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
  source: string;
  date: string;
  story: string;
}

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "photo-1",
    title: "深夜霓虹下的人行道",
    category: "scenery",
    categoryLabel: "自然与植物",
    src: "/gallery/【哲风壁纸】人行道-城市-夜晚.png",
    source: "个人收藏",
    date: "2026-07-28",
    story: "雨后竹叶挂着细小水珠，晨雾和苔藓把画面留在很安静的绿色里。",
  },
  {
    id: "photo-2",
    title: "卡通少女的午后遐思",
    category: "daily",
    categoryLabel: "日常灵感",
    src: "/gallery/【哲风壁纸】二次元-卡通.png",
    source: "个人收藏",
    date: "2026-07-25",
    story: "晨间书桌、笔记本和一杯咖啡，是开始创作前最熟悉的画面。",
  },
  {
    id: "photo-3",
    title: "仰望平流层：地球边缘",
    category: "daily",
    categoryLabel: "日常灵感",
    src: "/gallery/【哲风壁纸】云层-地球-大气层.png",
    source: "个人收藏",
    date: "2026-07-20",
    story: "周末午后留给阅读和发呆，书页与木桌的纹理让时间慢下来。",
  },
  {
    id: "photo-4",
    title: "孤山亭子与励志格言",
    category: "scenery",
    categoryLabel: "自然与植物",
    src: "/gallery/【哲风壁纸】亭子-励志文案-山石.png",
    source: "个人收藏",
    date: "2026-07-15",
    story: "树冠漏下的光在草地上慢慢移动，像一段不急着结束的夏日片段。",
  },
  {
    id: "photo-5",
    title: "公路旁日落时分的小兔",
    category: "collection",
    categoryLabel: "作品收藏",
    src: "/gallery/【哲风壁纸】兔子-公路-日落.png",
    source: "个人收藏",
    date: "2026-07-10",
    story: "一本书、一杯热茶和傍晚的光线，组成了想反复回看的日常。",
  },
  {
    id: "photo-6",
    title: "侧影：风中伫立的少年",
    category: "scenery",
    categoryLabel: "城市与建筑",
    src: "/gallery/【哲风壁纸】二次元-少年-帅.png",
    source: "个人收藏",
    date: "2026-07-05",
    story: "晚霞从绯红过渡到青紫，远山和城市灯火在同一刻安静下来。",
  },
  {
    id: "photo-7",
    title: "日暮天际线与孤独剪影",
    category: "collection",
    categoryLabel: "作品收藏",
    src: "/gallery/【哲风壁纸】剪影-壁纸-天空.png",
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
