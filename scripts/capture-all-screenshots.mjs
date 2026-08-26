import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const OUTPUT_DIR = path.resolve("public/docs/screenshots");
const ARTIFACT_DIR = "C:/Users/Administrator/.gemini/antigravity/brain/4a29254a-a039-4381-a599-41998fe75056";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 确保本地 Next.js 服务运行
async function checkServerRunning(url = "http://localhost:3000") {
  try {
    const res = await fetch(url);
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log("🔍 Checking local server status...");
  let serverProcess = null;
  const isRunning = await checkServerRunning();

  if (!isRunning) {
    console.log("🚀 Starting Next.js production server on port 3000...");
    serverProcess = spawn("npx", ["next", "start", "-p", "3000"], {
      shell: true,
      stdio: "pipe",
    });
    
    // 等待服务启动
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      if (await checkServerRunning()) {
        console.log("✅ Next.js server started!");
        break;
      }
    }
  } else {
    console.log("✅ Local server is already running on http://localhost:3000");
  }

  console.log("🌐 Launching Chromium/Edge browser...");
  const browser = await chromium.launch({
    headless: true,
    channel: "msedge",
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // 2x Retina 清晰度
  });
  const page = await context.newPage();

  const takeScreenshot = async (name, fullPage = false) => {
    const outPath = path.join(OUTPUT_DIR, name);
    await page.screenshot({ path: outPath, fullPage });
    console.log(`📸 Saved: ${name}`);

    // 同时复制到 artifact 目录
    try {
      const artPath = path.join(ARTIFACT_DIR, name);
      fs.copyFileSync(outPath, artPath);
    } catch {}
  };

  try {
    // 1. 首页 Hero
    console.log("Capturing 01-home-hero...");
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    await takeScreenshot("01-home-hero.png");

    // 2. 首页精选随笔
    console.log("Capturing 02-home-notes...");
    await page.evaluate(() => {
      const el = document.getElementById("notes");
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(600);
    await takeScreenshot("02-home-notes.png");

    // 3. 首页画廊板块
    console.log("Capturing 03-home-gallery...");
    await page.evaluate(() => {
      const el = document.getElementById("gallery");
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(600);
    await takeScreenshot("03-home-gallery.png");

    // 4. 首页工程项目板块
    console.log("Capturing 04-home-projects...");
    await page.evaluate(() => {
      const el = document.getElementById("projects");
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(600);
    await takeScreenshot("04-home-projects.png");

    // 5. 首页掌机开机待机舞台
    console.log("Capturing 05-home-playground-teaser...");
    await page.evaluate(() => {
      const el = document.getElementById("playground");
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(800);
    await takeScreenshot("05-home-playground-teaser.png");

    // 6. 随笔笔记列表页
    console.log("Capturing 06-notes-list...");
    await page.goto("http://localhost:3000/notes", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await takeScreenshot("06-notes-list.png");

    // 7. 随笔笔记长文详情页
    console.log("Capturing 07-notes-detail...");
    await page.goto("http://localhost:3000/notes/heritage-digitalization-interactive-system", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await takeScreenshot("07-notes-detail.png");

    // 8. 作品画廊列表页
    console.log("Capturing 08-gallery-masonry...");
    await page.goto("http://localhost:3000/gallery", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    await takeScreenshot("08-gallery-masonry.png");

    // 9. 作品画廊交互缩放大图弹窗
    console.log("Capturing 09-gallery-lightbox...");
    await page.goto("http://localhost:3000/gallery?work=h1", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    await takeScreenshot("09-gallery-lightbox.png");

    // 10. 灵感掌机 - 待机锁屏模式
    console.log("Capturing 10-playground-attract...");
    await page.goto("http://localhost:3000/playground", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await takeScreenshot("10-playground-attract.png");

    // 11. 灵感掌机 - 游戏选择与十字键模式
    console.log("Capturing 11-playground-console-selection...");
    await page.goto("http://localhost:3000/playground?start=true", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    await takeScreenshot("11-playground-console-selection.png");

    // 12. 中国象棋 AI 对弈弹窗
    console.log("Capturing 12-game-modal-xiangqi...");
    await page.goto("http://localhost:3000/playground#xiangqi", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    await takeScreenshot("12-game-modal-xiangqi.png");

    // 13. 五子棋对弈弹窗
    console.log("Capturing 13-game-modal-gomoku...");
    await page.goto("http://localhost:3000/playground#gomoku", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    await takeScreenshot("13-game-modal-gomoku.png");

    // 14. 草墨贪吃蛇弹窗
    console.log("Capturing 14-game-modal-snake...");
    await page.goto("http://localhost:3000/playground#snake", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    await takeScreenshot("14-game-modal-snake.png");

    // 15. 2048 弹窗
    console.log("Capturing 15-game-modal-2048...");
    await page.goto("http://localhost:3000/playground#2048", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    await takeScreenshot("15-game-modal-2048.png");

    // 16. 数字华容道弹窗
    console.log("Capturing 16-game-modal-puzzle...");
    await page.goto("http://localhost:3000/playground#puzzle", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    await takeScreenshot("16-game-modal-puzzle.png");

    // 17. 项目工程列表
    console.log("Capturing 17-projects-list...");
    await page.goto("http://localhost:3000/projects", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await takeScreenshot("17-projects-list.png");

    // 18. 高校宿舍管理系统实战复盘详情
    console.log("Capturing 18-project-dormitory-detail...");
    await page.goto("http://localhost:3000/projects/dormitory-system", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await takeScreenshot("18-project-dormitory-detail.png");

    // 19. 文章归档时间轴
    console.log("Capturing 19-archive-timeline...");
    await page.goto("http://localhost:3000/archive", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await takeScreenshot("19-archive-timeline.png");

    // 20. 关于小屋与工作台清单
    console.log("Capturing 20-about-cottage...");
    await page.goto("http://localhost:3000/about", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await takeScreenshot("20-about-cottage.png");

    // 21. 此刻动态
    console.log("Capturing 21-now-page...");
    await page.goto("http://localhost:3000/now", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await takeScreenshot("21-now-page.png");

    // 22. 全局 Command Menu 快捷控制台
    console.log("Capturing 22-command-menu...");
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.keyboard.press("Control+k");
    await page.waitForTimeout(800);
    await takeScreenshot("22-command-menu.png");

    console.log("🎉 All 22 screenshots captured successfully!");
  } catch (err) {
    console.error("❌ Screenshot capture error:", err);
  } finally {
    await browser.close();
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

main();
