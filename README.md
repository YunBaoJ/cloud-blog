# Cloud 的数字小屋

一个使用 Next.js 16 App Router 构建的个人博客，内容涵盖前端工程、摄影与日常记录。

## 功能

- Markdown 随笔、文章归档与站内搜索
- 胶片画廊与照片详情
- 贪吃蛇、2048、华容道、五子棋和中国象棋
- 深色模式、阅读进度与减少动态效果支持
- 本机留言板和环境音播放器
- Sitemap、Robots 与文章静态生成

## 本地运行

```bash
npm install
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)。

生产部署前配置站点域名：

```env
NEXT_PUBLIC_SITE_URL=https://example.com
```

未配置时元数据地址回退为 `http://localhost:3000`。

## 常用命令

```bash
npm run dev      # 开发服务器
npm run lint     # ESLint 检查
npm run build    # 生产构建与类型检查
npm run start    # 启动生产服务器
```

## 项目结构

```text
content/
└── notes/                 # Markdown 文章，文章内容的唯一来源
public/
├── gallery/               # 画廊原图
├── sounds/                # 游戏音效
└── *.jpg                  # 页面封面、头像与游戏封面
src/
├── app/                   # 路由、页面元数据和路由专属客户端组件
│   ├── notes/[id]/        # 文章详情与 Markdown 渲染
│   └── playground/        # 游戏入口与弹窗调度
├── components/            # 被多个页面复用的界面组件
│   └── games/             # 独立游戏实现
├── data/siteContent.ts    # 图库、首页卡片等非文章静态内容
└── lib/                   # 内容读取、站点配置与通用 Hooks
```

## 维护约定

1. 文章只写入 `content/notes`，不要在组件中复制文章正文。
2. 路由专属组件放在对应 `src/app/<route>` 下；只有跨页面复用的组件才进入 `src/components`。
3. 非文章静态数据集中放在 `src/data/siteContent.ts`，避免散落在 JSX 中。
4. `public` 只保留当前代码引用的生产资源。迭代版本交给 Git，不使用 `-v2`、`-final` 等副本长期留存。
5. 新增依赖前确认原生 API 或现有依赖无法完成需求；移除功能时同步清理依赖和资源。
6. 合并前必须执行 `npm run lint` 与 `npm run build`。

## 技术栈

- Next.js 16 / React 19
- TypeScript
- Tailwind CSS 4
- GSAP
- Lucide React
- Gray Matter
