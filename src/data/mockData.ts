export interface StatusItem {
  id: string;
  icon: string;
  text: string;
  bgClass: string;
  textClass: string;
  dotColor: string;
  iconColor: string;
}

export interface NoteItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  readTime: string;
  iconName: string;
  tags: string[];
  content: string;
  views: number;
  likes: number;
}

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
  description: string;
  category: "all" | "film" | "nature" | "city" | "coffee";
  categoryLabel: string;
  src: string;
  aspectRatio: string;
  location: string;
  date: string;
  exif: {
    camera: string;
    lens: string;
    focalLength: string;
    aperture: string;
    shutterSpeed: string;
    iso: string;
  };
  story: string;
}

export const STATUS_PILLS: StatusItem[] = [
  {
    id: "latte",
    icon: "Coffee",
    text: "正在喝燕麦拿铁",
    bgClass: "bg-[#E2EBE4]",
    textClass: "text-[#36513B]",
    dotColor: "bg-[#4E7A56]",
    iconColor: "text-[#36513B]",
  },
  {
    id: "reading",
    icon: "BookOpen",
    text: "正在读《日日是好日》",
    bgClass: "bg-[#FDEEE9]",
    textClass: "text-[#8C4A31]",
    dotColor: "bg-[#C46A4A]",
    iconColor: "text-[#2B4C6F]",
  },
  {
    id: "coding",
    icon: "Feather",
    text: "正在雕琢数字小屋",
    bgClass: "bg-[#F4F1EA]",
    textClass: "text-[#544F49]",
    dotColor: "bg-[#7A736A]",
    iconColor: "text-[#8C4A31]",
  },
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "photo-1",
    title: "竹林幽径与破晓微光",
    description: "晨雾未散的植物园竹林，第一缕太阳斜照在湿润的苔藓上。",
    category: "nature",
    categoryLabel: "自然与植物",
    src: "/gallery/bamboo.jpg",
    aspectRatio: "aspect-4/3",
    location: "杭州 · 植物园竹林区",
    date: "2026-07-28",
    exif: {
      camera: "Sony Alpha 7 IV",
      lens: "FE 35mm F1.4 GM",
      focalLength: "35mm",
      aperture: "f/1.4",
      shutterSpeed: "1/500s",
      iso: "100",
    },
    story: "早晨7点拍摄于杭州植物园。刚下过小雨，竹叶上挂着密密麻麻的水珠，空气里全清香的泥土与竹叶气息。",
  },
  {
    id: "photo-2",
    title: "手冲咖啡的闷蒸时刻",
    description: "水流触及咖啡粉饼的瞬间，微小气泡膨胀排气，散发出浓郁榛果香。",
    category: "coffee",
    categoryLabel: "咖啡与日常",
    src: "/gallery/coffee.jpg",
    aspectRatio: "aspect-square",
    location: "数字小屋 · 咖啡角",
    date: "2026-07-25",
    exif: {
      camera: "Fujifilm X100V",
      lens: "Fujinon 23mm F2.0",
      focalLength: "23mm (等效35mm)",
      aperture: "f/2.0",
      shutterSpeed: "1/250s",
      iso: "200",
    },
    story: "使用浅烘焙埃塞俄比亚耶加雪菲，30秒闷蒸过程记录。胶片模拟 Classic Chrome 调色。",
  },
  {
    id: "photo-3",
    title: "午后静谧的燕麦拿铁",
    description: "阳光穿过木质百叶窗，在陶瓷杯边沿洒下金黄的光斑。",
    category: "coffee",
    categoryLabel: "咖啡与日常",
    src: "/gallery/latte.jpg",
    aspectRatio: "aspect-4/3",
    location: "静谧咖啡馆",
    date: "2026-07-20",
    exif: {
      camera: "Leica M10-P",
      lens: "Summilux-M 50mm f/1.4 ASPH",
      focalLength: "50mm",
      aperture: "f/1.4",
      shutterSpeed: "1/1000s",
      iso: "160",
    },
    story: "周末午后的轻盈时光，伴随着店内爵士乐流淌，静静记录下的咖啡奶泡拉花与木桌纹理。",
  },
  {
    id: "photo-4",
    title: "夏日林间的光影交织",
    description: "树冠间隙投下的斑驳光影，在平缓草坪上升腾着温暖气息。",
    category: "nature",
    categoryLabel: "自然与植物",
    src: "/gallery/nature.jpg",
    aspectRatio: "aspect-16/9",
    location: "西湖区 · 绿道林荫",
    date: "2026-07-15",
    exif: {
      camera: "Sony Alpha 7 IV",
      lens: "FE 85mm F1.4 GM",
      focalLength: "85mm",
      aperture: "f/1.8",
      shutterSpeed: "1/800s",
      iso: "100",
    },
    story: "使用中长焦大光圈虚化背景，把远处的树影与落日余晖糅合成圆润浪漫的光斑。",
  },
  {
    id: "photo-5",
    title: "《日日是好日》与书香",
    description: "一本抚平焦虑的书，一杯热气腾腾的茶，漫漫长夏里的治愈寄托。",
    category: "film",
    categoryLabel: "胶片随笔",
    src: "/gallery/reading.jpg",
    aspectRatio: "aspect-4/3",
    location: "小屋书房",
    date: "2026-07-10",
    exif: {
      camera: "Olympus OM-1",
      lens: "F.Zuiko 50mm f/1.8",
      focalLength: "50mm",
      aperture: "f/2.0",
      shutterSpeed: "1/125s",
      iso: "400 (Kodak Portra 400)",
    },
    story: "Portra 400 胶片独特的暖调人像与室内光表现，沉淀出平实温润的书卷质感。",
  },
  {
    id: "photo-6",
    title: "暮色沉山与晚霞落日",
    description: "天边由绯红渐变为深青紫，远山如黛，华灯初上。",
    category: "city",
    categoryLabel: "城市与建筑",
    src: "/gallery/sunset.jpg",
    aspectRatio: "aspect-16/9",
    location: "宝石山顶 · 眺望西湖",
    date: "2026-07-05",
    exif: {
      camera: "Sony Alpha 7 IV",
      lens: "FE 24-70mm F2.8 GM II",
      focalLength: "70mm",
      aperture: "f/5.6",
      shutterSpeed: "1/60s",
      iso: "100",
    },
    story: "日落后 20 分钟的蓝调时刻 (Blue Hour)，城市灯火与天空冷暖对比交相辉映。",
  },
  {
    id: "photo-7",
    title: "日式町屋下的光影重叠",
    description: "障子纸窗前，古老木纹与透射光影诉说着岁月静好。",
    category: "film",
    categoryLabel: "胶片随笔",
    src: "/hero-ai-bg-user.jpg",
    aspectRatio: "aspect-16/9",
    location: "京都 · 古民家",
    date: "2026-06-28",
    exif: {
      camera: "Fujifilm X100V",
      lens: "Fujinon 23mm F2.0",
      focalLength: "23mm",
      aperture: "f/2.8",
      shutterSpeed: "1/160s",
      iso: "160",
    },
    story: "手冲壶、玻璃下滴的咖啡与障子窗外透进来的漫射光，营造出和质静谧氛围。",
  },
];

export const FEATURED_NOTES: NoteItem[] = [
  {
    id: "note-6",
    title: "极简 Web 工程与数字宁静的艺术",
    summary: "在通知噪音不断的时代，探讨如何利用现代 Web 标准、服务端组件与响应式排版，打造一个让人沉静的数字庇护所。",
    category: "代码与思考",
    date: "2026-08-02",
    readTime: "5 分钟",
    iconName: "Code2",
    tags: ["#Web工程", "#排版美学", "#Nextjs", "#设计系统"],
    views: 1580,
    likes: 142,
    content: `
## 引言：构建数字庇护所

在一个充斥着过度刺激交互、侵入性弹窗和无休止算法推荐的时代，Web 界面似乎渐渐失去了最初的那份宁静与纯粹。

作为软件工程师与设计师，我们承担着一项独特的责任：构建能够**尊重人类注意力**并提供数字宁静感的空间。

---

## 1. 系统设计中的克制之力

极简主义绝非简单的堆砌空白，而是对专注与品质的用心呈现。

* **服务端优先渲染**：通过充分利用 React Server Components，我们避免向客户端浏览器发送任何不必要的 JavaScript。
* **精准校准的排版**：将具有独特视觉性格的标题字体与清晰利落的正文字体结合，建立起层级分明的视觉秩序。
* **触感物理学**：为按钮的悬浮与点击状态注入微小的弹簧物理过渡效果（150ms ~ 250ms）。

\`\`\`typescript
// 清晰、声明式的代码带来宁静舒展的用户界面
interface DigitalSanctuaryProps {
  readingMode: boolean;
  ambientAudio: "rain" | "forest" | "none";
}

export function Sanctuary({ readingMode }: DigitalSanctuaryProps) {
  return (
    <main className="font-sans antialiased text-[#2D2B2C] bg-[#FAF7F2]">
      <article className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight">
          现代软件开发中的宁静美学
        </h1>
      </article>
    </main>
  );
}
\`\`\`

---

## 2. 作为核心体验的文字排版

> "好的设计是尽可能少的设计。少即是多——因为它聚焦于事物最本质的核心。" – 迪特·拉姆斯 (Dieter Rams)

当文字以舒适的行高（1.6 ~ 1.8）、宽敞的呼吸空间以及齐平等高数字呈现时，在屏幕上的阅读体验便从一项任务升华为一种治愈的仪式。
    `,
  },
  {
    id: "note-7",
    title: "静寂美学：代码、咖啡与胶片摄影的日常",
    summary: "雨后清晨，伴着手冲咖啡的香气度过静谧时光。聊聊 Web 设计里的减法美学，以及潜藏在日常生活中的微小感动。",
    category: "生活与摄影",
    date: "2026-08-01",
    readTime: "6 分钟",
    iconName: "Camera",
    tags: ["#生活美学", "#手冲咖啡", "#胶片摄影", "#宁静"],
    views: 1320,
    likes: 168,
    content: `
## 序文：静寂之中蕴藏的价值

在数字生活飞速旋转的当下，我们内心真正渴求的，是一块能够让心灵平复下来的“余白”空间。

清晨阳光下冲煮的一杯手冲咖啡、雨后竹林里按下的胶片快门，以及精心构筑的优雅代码——这些事物在本质上都由**时间的美学**交织连接。

---

## 1. 手冲咖啡与异步处理的共鸣

在将热水注入咖啡粉时，存在一个极其关键的步骤——30 秒的“闷蒸（Bloom）”。这是咖啡粉释放二氧化碳、唤醒潜在风味因子的静谧等待。

* **闷蒸的留白**：若是急于大量注水，水流会沿着缝隙通道快速溜走，导致萃取不足、风味平淡。
* **代码的异步**：这与在 Promise 或 Async/Await 中静心等待异步数据加载完成的原理如出一辙。

> "创造真正美好事物的秘诀，在于不畏惧时间，并全身心地享受过程本身。"

---

## 2. 胶片摄影教会我的“一期一会”

在使用 35mm 胶片相机创作时，我们无法像数码相机那样实时在屏幕上回放照片。

正因如此，每一次按压快门前都需要更加专注地观察光影、考究构图。当冲洗出来的照片拿在手中时，那一刻的空气、温度与情绪，都作为**银盐颗粒**被永久定格。

在 Web 界面设计中，我们也秉持着这种“一期一会”的敬畏之心，用心雕琢每一个像素，尊重用户的每一分阅读时光。
    `,
  },
  {
    id: "note-1",
    title: "在代码里探索并发模型与手冲咖啡的共鸣",
    summary: "探讨异步编程里的等待艺术，就像等待手冲咖啡第二次注水时静谧膨胀的咖啡粉粉饼。代码与咖啡，都是关于时间的淬炼。",
    category: "代码与思考",
    date: "2026-07-28",
    readTime: "6 分钟",
    iconName: "Code2",
    tags: ["#并发模型", "#Async", "#手冲咖啡", "#思考"],
    views: 1420,
    likes: 98,
    content: `
### 引言：在等待中寻找秩序

软件工程里的并发模型（Concurrency）与清晨的一杯手冲咖啡，表面上看似风马牛不相及，但在本质上，它们都是关于**“时间分配”与“状态调度”**的艺术。

写代码时，我们用 Promises、Async/Await 或 Channel 协调异步任务，避免线程阻塞；而在冲煮咖啡时，我们精确计算闷蒸的 30 秒与第二次注水时粉饼的排气膨胀，等待风味彻底绽放。

---

### 1. 闷蒸（Bloom）与异步初始化

手冲的第一步是注入 40g 92℃ 的热水，让刚磨好的咖啡粉在 30 秒内吐出二氧化碳。这恰如系统启动时的组件异步挂载：

\`\`\`typescript
// 类似于咖啡闷蒸：非阻塞初始化
async function initializeCoffeeBloom(coffeeBeans: Bean): Promise<Status> {
  const bloomed = await startBlooming(coffeeBeans, { durationMs: 30000 });
  console.log("粉饼闷蒸完成，风味因子准备就绪...");
  return bloomed.status;
}
\`\`\`

如果我们急于在闷蒸未完成时大量注水，水流会沿着缝隙快速通道流走，萃取不足；同样，如果在异步数据未 Promise.all 解析完成前强行渲染 UI，页面就会出现严重的布局抖动与白屏。

---

### 2. 管道流（Pipelines）与风味萃取

在现代前端架构中，数据的流转类似于咖啡液滴落入玻璃壶的过程：

> "代码不是越复杂越好，好的架构就像清澈的咖啡液，入口顺滑，回甘悠长。"

当我们把复杂的异步回调解耦为响应式流（RxJS / Streams）时，数据的传递变得可预测、可追踪。正如掌控手冲的水流速度（mL/s），稳定的流速决定了最终杯中的酸甜平衡。

---

### 结语

无论是敲击键盘上的每一个字符，还是静静观察一滴咖啡落入壶底，专注与敬畏都是最珍贵的品质。愿你在代码与生活中，都能找到属于自己的节奏。
    `,
  },
  {
    id: "note-2",
    title: "雨后清晨在植物园捕捉到的自然光影",
    summary: "带上一台老胶片相机，记录下早晨 7 点挂在幼苗叶片上的水珠与柔柔的光线。胶片独特的颗粒感，让人学会放慢脚步。",
    category: "生活与摄影",
    date: "2026-07-20",
    readTime: "4 分钟",
    iconName: "Camera",
    tags: ["#胶片摄影", "#35mm", "#植物园", "#生活拾遗"],
    views: 980,
    likes: 126,
    content: `
### 7:00 AM 森林雨后的晨光

清晨六点半，城市还在半梦半醒之间。刚下过一场小雨，空气里弥漫着湿润的泥土香气与草木清香。

我带上了索尼 A7M4 与一颗 35mm f/1.4 镜头，漫步在杭州植物园的竹林深处。

---

### 胶片感色彩的魅力

数码时代的摄影往往追求极端的清晰度与高动态范围，但在胶片的世界里，那种自然的温润色调与微妙的银盐颗粒感，却让人倍感亲切。

* **焦段选择**：35mm 人文焦段，恰好捕捉人眼自然的视野范围。
* **光圈控制**：保持在 f/2.0 ~ f/2.8，让背景呈现出如梦似幻的圆形光斑。
* **光影抓拍**：当第一缕阳光穿透松针洒在幼苗叶片的水珠上时，时间仿佛在此刻停滞。

> "摄影不是记录你看到了什么，而是记录你当时感受到了什么。"

放下快门焦虑，用心观察一朵花的盛开、一片叶子的落去。在快节奏的数字生活中，摄影是最好的止疼药。
    `,
  },
  {
    id: "note-3",
    title: "构建治愈系 Web UI：触感动画与暖磨砂玻璃材质",
    summary: "拒绝冰冰的科技感，如何用 CSS 与微动效打造一个让人安心沉浸的数字客房？从色彩搭配到微动效物理学全解析。",
    category: "前端与设计",
    date: "2026-07-12",
    readTime: "8 分钟",
    iconName: "Sparkles",
    tags: ["#CSS", "#DesignSystem", "#WebUI", "#微动效"],
    views: 2150,
    likes: 240,
    content: `
### 为什么我们的界面需要“温度”？

在过去十年的 Web 设计演进中，极简主义（Minimalism）常常被误解为“冷冰冰的白墙与无处不在的深色模式”。

然而真正的**治愈系 UI（Organic Healing UI）**，应当吸收自然界的材质与光影：米白的纸质底色（#FAF7F2）、温润的松绿（#36513B）、以及带有折射效果的液态毛玻璃。

---

### 1. 暖磨砂玻璃（Warm Glassmorphism）

与普通的白灰透明度不同，暖磨砂玻璃使用了较高的饱和度与双层柔光阴影：

\`\`\`css
.warm-glass {
  background: rgba(250, 247, 242, 0.82);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.75);
  box-shadow: 
    0 12px 36px -6px rgba(61, 59, 60, 0.07), 
    0 4px 12px -2px rgba(61, 59, 60, 0.04);
}
\`\`\`

---

### 2. 触感动效（Tactile Micro-interactions）

按压按钮时的反馈不应是机械的突变，而应遵循弹簧物理学（Spring Physics）：

* **Hover 移入**：向上悬浮 2px~4px，阴影范围扩大并变软。
* **Active 点击**：微缩放至 0.98，模拟真实物理按键的压感。
* **Timing**：150ms ~ 250ms 的缓动曲线，让交互流畅如丝。

设计的最高境界，是让用户在不知不觉中感到舒适与安心。
    `,
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
    id: "game2048",
    title: "2048 益智数字",
    description: "经典 4x4 数字方块合成，体验动脑与消除的乐趣。",
    tag: "脑力益智",
    icon: "Grid",
  },
  {
    id: "slide",
    title: "数字华容道拼图",
    description: "4x4 数字圆角滑动拼图，在丝滑位移中挑战用时与步数。",
    tag: "逻辑挑战",
    icon: "Gamepad",
  },
  {
    id: "gomoku",
    title: "五子棋竞技场",
    description: "支持单人 AI 对弈与双人同台切磋，体验瞬间绝杀的博弈魅力。",
    tag: "人机博弈",
    icon: "Bot",
  },
];
