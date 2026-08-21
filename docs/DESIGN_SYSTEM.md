# Cloud's Digital Cottage · Design System & Rich Aesthetics Guidelines

> 提炼自 Antigravity 前端美学与设计工程规范。本规范是博客界面设计、组件开发与视觉迭代的唯一执行标准。

---

## 1. 核心设计哲学 (Core Philosophy)

* **Wabi-Sabi 与现代极简融合**：沉静、温润、秩序、克制。
* **拒绝模板感与廉价感**：杜绝通用的蓝白灰 AI 模板风格，每一个组件都具备明确的质感（纸质、和纸胶带、微立体按键、复古五金质感）。
* **严谨使用 Emoji**：博客 UI、文章排版、系统状态中严禁使用花哨的 Emoji 表情，统一使用精细线条的 Lucide 图标。

---

## 2. 色彩系统 (Color Palette)

严禁使用原生未经校准的纯红、纯绿、纯蓝，统一使用基于 HSL 精调的自然矿物色系：

| 角色 | 浅色模式 (Light) | 深色模式 (Dark) | 用途 |
| :--- | :--- | :--- | :--- |
| **画布底色 (Canvas)** | `#FAF7F2` (米白/和纸色) | `#121814` (暗夜黛绿) | 全局背景 |
| **卡片表面 (Surface)** | `#FFFFFF` / `rgba(255,255,255,0.85)` | `#1B251E` / `rgba(27,37,30,0.85)` | 容器与卡片 |
| **松针主色 (Primary Pine)** | `#36513B` | `#7CD090` | 核心文字、重点按钮、激活状态 |
| **赤陶强调色 (Terracotta Accent)** | `#8C4A31` | `#E5987D` | 便签标签、高亮微标、徽章 |
| **正文文字 (Text Main)** | `#2D2B2C` (深炭黑) | `#F0F5F1` (浅云灰) | 标题与重点段落 |
| **次级文字 (Text Muted)** | `#6F7E70` / `#7A736A` | `#9EB3A4` / `#8A9E90` | 辅助说明、等宽编号、日期 |
| **微光与分割线 (Borders & Dividers)** | `rgba(54, 81, 59, 0.12)` | `rgba(255, 255, 255, 0.12)` | 卡片轮廓、微投影 |

---

## 3. 排版体系 (Typography)

* **分栏大标题 (Section Headings)**：
  - 规范：`font-[family-name:var(--section-heading-font)] text-5xl sm:text-6xl font-semibold leading-[0.9] tracking-[-0.1em]`
  - 核心词强调：使用 `<em className="ml-1 not-italic font-medium">主词</em>`
* **分栏序号 (Mono Index Tag)**：
  - 规范：`font-mono text-[10px] font-bold tracking-[0.12em] text-[#6F7E70] uppercase`
  - 格式：`01 / FEATURED ESSAYS`
* **正文与描述 (Body Prose)**：
  - 规范：`text-sm sm:text-base text-[#5A5551] dark:text-[#9EB3A4] font-normal leading-relaxed`

---

## 4. 黄金三段式全屏分栏架构 (3-Tier Slide Architecture)

在主页与核心路由中，每个独立分屏统一遵循严格的三段式视口居中模型：

```text
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ 【Top Header Bar】                                                          │
  │   0X / SECTION NAME                                                         │
  │   主标题关键词                                      进入对应页面 (共 N 个) →  │
  │   描述文案单行或两行展开，左对齐与标题连贯。                                │
  │                                                                             │
  │ 【Center Stage (屏幕黄金正中心，严禁 overflow-hidden 硬切)】                │
  │   ┌─────────────────────────────────────────────────────────────────────┐   │
  │   │                     【 核心交互卡片 / 硬件机身 】                    │   │
  │   └─────────────────────────────────────────────────────────────────────┘   │
  │                                                                             │
  │ 【Bottom Meta Index】(可选)                                                 │
  │   01 / ITEM A        02 / ITEM B        03 / ITEM C        04 / ITEM D      │
  └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. 微动效与交互准则 (Micro-Animations & Interaction)

1. **防抖命中层 (Hitbox Isolation)**：
   - 具有悬停位移或 3D 翻转的卡片，外层必须包裹不可见的 `-inset-4 pointer-events-auto` 扩展命中层，彻底消除光标处于卡片边缘时的像素级高频抖动。
2. **平滑缓动函数 (Smooth Curves)**：
   - 动画统一采用高阶缓动：`cubic-bezier(0.22, 1, 0.36, 1)` 或 GSAP `power2.out`。
3. **触觉与声效反馈 (Tactile & Audio)**：
   - 游戏与互动按键优先调用 Web Audio API 合成轻量声效，并触发移动端微振动 `navigator.vibrate(12)`。
