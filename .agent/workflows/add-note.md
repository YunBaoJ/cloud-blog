---
description: 标准化手记文章创建与元数据注册工作流
---

# 添加随笔手记工作流 (Add Note Workflow)

用于在博客中创建一篇新的高质量手记或技术随笔。

## 步骤清单

1. 确认文章主题与唯一 Slug 标识（如 `nextjs-best-practices`）；
2. 在 `src/data/notes.ts` 中注册文章数据项：
   - 字段包括：`id`, `title`, `summary`, `date`, `category`, `tags`, `icon`, `readingTime`, `views`, `likes`, `pinned`, `coverImage`, `content`；
3. 遵循博客设计规范：
   - 文章正文采用 Markdown 格式；
   - 严禁在标题与正文中使用 Emoji，使用语义化的图标与排版；
   - 确保 `coverImage` 存在于 `public/` 目录下；
4. 运行全量构建校验：
// turbo
```bash
npm run build
```
