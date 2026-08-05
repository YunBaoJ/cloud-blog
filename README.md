# ☁️ Cloud 的数字小屋

> 代码、摄影与手冲咖啡的私人记录空间。

一个基于 Next.js 构建的个人博客，不为发布，只为记录。

---

## ✨ 功能一览

| 功能 | 说明 |
|------|------|
| 📝 随笔笔记 | Markdown 渲染、文章详情、标签分类 |
| 📷 胶片画廊 | 瀑布流照片展示与灯箱浏览 |
| 🌙 深色模式 | 松绿深森林色调，护眼舒适 |
| ⌘K 全局搜索 | 快捷键唤出站内全局搜索面板 |
| 🎵 环境白噪音 | Web Audio API 合成雨声与咖啡馆背景音 |
| 📖 阅读进度条 | 顶部平滑进度流光 |
| 🗂️ 文章归档 | 按时间轴与标签浏览全部内容 |
| 🧪 灵感游乐场 | 番茄钟专注计时器 |

---

## 🛠️ 技术栈

- **框架**：[Next.js 16](https://nextjs.org/) (App Router + Turbopack)
- **样式**：Tailwind CSS v4
- **字体**：HarmonyOS Sans SC
- **图标**：[Lucide React](https://lucide.dev/)
- **语言**：TypeScript

---

## 🚀 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 即可查看。

---

## 📁 项目结构

```
src/
├── app/                # 页面路由
│   ├── notes/          # 随笔笔记
│   ├── gallery/        # 胶片画廊
│   ├── about/          # 关于
│   ├── archive/        # 文章归档
│   └── playground/     # 灵感游乐场
├── components/         # 公共组件
└── data/               # 本地数据
```

---

*仅供个人使用，记录生活与思考。*
