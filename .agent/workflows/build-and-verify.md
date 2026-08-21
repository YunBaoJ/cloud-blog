---
description: 执行全量 TypeScript 类型检查、Next.js 生产编译与路由预检工作流
---

# 构建与自动化质量预检工作流 (Build & Verification Workflow)

本工作流用于在每次功能变更、UI 调整或发布合并前，对整个博客项目进行全量无死角的编译、类型与静态路由质量检查。

## 步骤清单

1. 检查当前本地工作区状态
// turbo
2. 运行 Next.js 生产编译与 TypeScript 类型检查：
```bash
npm run build
```
3. 验证编译输出结果：
   - 确认退出码为 `0`；
   - 确认全部 21+ 个静态页面（包含 SSG 动态手记页面、Feed、Sitemap）正常生成；
4. 启动本地开发服务以供预览体验：
```bash
npm run dev
```
