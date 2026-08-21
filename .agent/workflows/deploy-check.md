---
description: 生产环境部署前 Pre-flight 检查清单与流程
---

# 生产环境部署前 Pre-flight 检查工作流

在将代码合并或推送至生产环境（GitHub Pages / Vercel / 云服务器）前必须执行的检查。

## 步骤清单

1. 检查代码树是否干净无临时废弃文件：
// turbo
```bash
git status
```
2. 运行全量静态打包验证：
// turbo
```bash
npm run build
```
3. 检查敏感信息保护：
   - 确认 `.env` 或任何私钥未被提交到 Git 仓库；
4. 提交并推送到远端仓库：
```bash
git add .
git commit -m "chore: release pre-flight verification passed"
git push origin main
```
