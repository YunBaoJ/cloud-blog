"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Coins,
  Gamepad2,
  HelpCircle,
  Play,
  Sparkles,
  Trophy,
  Wifi,
} from "lucide-react";

export default function PlaygroundTeaser() {
  const [currentTime, setCurrentTime] = useState("23:59");
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // 实时时钟
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(`${h}:${m}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="playground"
      data-home-scroll-section
      className="relative min-h-[100dvh] w-full overflow-hidden bg-transparent px-4 py-20 sm:px-6 md:py-28 lg:px-8"
    >
      <div
        data-home-scroll-divider
        className="absolute inset-x-0 top-0 h-px origin-left bg-[#36513B]/16 dark:bg-white/16"
        aria-hidden="true"
      />
      {/* Background Ambient Pine Glow */}
      <div
        data-home-scroll-ambient
        className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#36513B]/6 dark:bg-[#7CD090]/4 blur-3xl rounded-full pointer-events-none"
      />

      <div
        data-home-scroll-content
        className="relative z-10 max-w-6xl mx-auto space-y-8 sm:space-y-10"
      >
        {/* Section Header */}
        <div
          data-home-scroll-heading
          className="playground-console-anim flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div className="space-y-3">
            <h2 className="font-[family-name:var(--section-heading-font)] text-5xl font-semibold leading-[0.9] tracking-[-0.1em] text-[#26352A] dark:text-[#F0F5F1] sm:text-6xl">
              灵感<em className="ml-1 font-[family-name:var(--section-heading-font)] not-italic font-medium">掌机</em>
            </h2>
            <p className="text-sm sm:text-base text-[#5A5551] dark:text-[#9EB3A4] max-w-lg font-normal">
              复古街机投币待机与掌机卡带载入，在沉思与编码之余唤醒纯粹的投币心流。
            </p>
          </div>

          <Link
            href="/playground"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#36513B] dark:text-[#7CD090] hover:text-[#283E2C] dark:hover:text-white transition-colors group self-start sm:self-end"
          >
            <span>进入游乐场</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* ================================================================= */}
        {/* 🎮 真实街机/掌机硬件机身 (Arcade Console Hardware Frame) */}
        {/* ================================================================= */}
        <div
          data-home-scroll-rail
          className="playground-console-anim relative mx-auto w-full max-w-6xl pt-7 sm:pt-8"
        >
          {/* 顶部 L1 / R1 实体肩键 */}
          <div className="absolute top-0 inset-x-12 sm:inset-x-24 flex justify-between z-0 pointer-events-auto select-none">
            <Link
              href="/playground?start=true"
              className="h-8 sm:h-9 px-6 sm:px-8 rounded-t-2xl sm:rounded-t-3xl bg-[#26352A] dark:bg-[#152319] text-white/95 text-xs font-mono font-bold tracking-wider hover:bg-[#36513B] active:translate-y-1 transition-all shadow-[0_-4px_12px_rgba(0,0,0,0.15)] border-t-2 border-x-2 border-white/25 flex items-center gap-2 cursor-pointer group"
              title="进入游乐场 [ L1 ]"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform text-[#7CD090]">
                ◀
              </span>
              <span>[ L1 ]</span>
              <span className="hidden sm:inline text-[10px] text-white/60">
                PLAY
              </span>
            </Link>
            <Link
              href="/playground?start=true"
              className="h-8 sm:h-9 px-6 sm:px-8 rounded-t-2xl sm:rounded-t-3xl bg-[#26352A] dark:bg-[#152319] text-white/95 text-xs font-mono font-bold tracking-wider hover:bg-[#36513B] active:translate-y-1 transition-all shadow-[0_-4px_12px_rgba(0,0,0,0.15)] border-t-2 border-x-2 border-white/25 flex items-center gap-2 cursor-pointer group"
              title="进入游乐场 [ R1 ]"
            >
              <span className="hidden sm:inline text-[10px] text-white/60">
                PLAY
              </span>
              <span>[ R1 ]</span>
              <span className="group-hover:translate-x-0.5 transition-transform text-[#7CD090]">
                ▶
              </span>
            </Link>
          </div>

          {/* 掌机双握把机身外壳 */}
          <div className="relative z-10 rounded-[2.8rem] sm:rounded-[3.8rem] bg-[#EAE6DC] dark:bg-[#16231A] p-3 sm:p-5 sm:px-7 border-4 border-[#26352A]/20 dark:border-white/18 shadow-[0_24px_70px_rgba(38,53,42,0.2)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-4 sm:gap-6 justify-between">
            
            {/* ============================================================= */}
            {/* 左侧握把区：极简模拟摇杆 + 呼吸灯 (Left Grip) */}
            {/* ============================================================= */}
            <div className="hidden md:flex flex-col items-center justify-between h-[340px] w-20 shrink-0 py-3 select-none">
              {/* Power LED */}
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#7CD090] animate-pulse shadow-[0_0_8px_#7CD090]" />
                <span className="font-mono text-[9px] font-bold text-[#6F7E70] tracking-widest uppercase">
                  ONLINE
                </span>
              </div>

              {/* 实体掌机模拟摇杆 */}
              <div className="flex flex-col items-center gap-2">
                <Link
                  href="/playground?start=true"
                  className="group relative size-16 rounded-full bg-[#26352A] dark:bg-[#0D150F] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_6px_14px_rgba(0,0,0,0.3)] flex items-center justify-center p-1.5 active:scale-95 transition-all cursor-pointer"
                  title="点击进入游乐场"
                >
                  <div className="size-full rounded-full bg-gradient-to-br from-[#36513B] to-[#1E2E23] border border-white/15 shadow-inner flex items-center justify-center group-hover:scale-105 transition-transform">
                    <div className="size-6 rounded-full border border-white/20 bg-black/20" />
                  </div>
                </Link>
                <span className="font-mono text-[9px] text-[#7A736A] dark:text-[#9EB3A4]">
                  STICK
                </span>
              </div>

              {/* 左扬声器微孔 */}
              <div className="grid grid-cols-3 gap-1 opacity-35">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="size-1 rounded-full bg-[#26352A] dark:bg-white"
                  />
                ))}
              </div>
            </div>

            {/* ============================================================= */}
            {/* 中央屏幕：游戏进入与标题画面 (Game Title & Boot Screen) */}
            {/* ============================================================= */}
            <div className="relative flex-1 w-full min-h-[360px] sm:min-h-[400px] rounded-[1.8rem] sm:rounded-[2.4rem] bg-[#0A0D0B] p-4 sm:p-6 shadow-[inset_0_4px_32px_rgba(0,0,0,0.98)] border border-white/10 overflow-hidden flex flex-col justify-between select-none">
              
              <div className="relative z-10 flex-1 flex flex-col justify-between py-2 text-center animate-in fade-in duration-300">
                {/* Arcade Top Score Bar */}
                <div className="flex items-center justify-between text-[10px] font-mono text-white/50 border-b border-white/10 pb-2 px-1">
                  <span className="text-[#7CD090] font-bold flex items-center gap-1">
                    <Gamepad2 className="size-3 text-[#7CD090]" />
                    <span>1P: 002480</span>
                  </span>
                  <span className="text-amber-400 font-bold tracking-wider">
                    HIGH SCORE: 999990
                  </span>
                  <span className="text-white/70">{currentTime}</span>
                </div>

                {/* 🎮 游戏进入核心视觉与标题 (Title Stage) */}
                <div className="space-y-4 py-5">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-mono tracking-[0.3em] text-[#7CD090] uppercase font-bold">
                      ★ KASUMI RETRO SYSTEM · 1998 ★
                    </p>
                    <h3 className="text-3xl sm:text-5xl font-black text-white tracking-wider font-mono drop-shadow-[0_0_24px_rgba(124,208,144,0.45)]">
                      KASUMI PLAYGROUND
                    </h3>
                    <p className="text-xs font-mono text-[#7CD090]/80 pt-1 flex items-center justify-center gap-2">
                      <Sparkles className="size-3 text-[#7CD090]" />
                      <span>中国象棋 AI · 五子棋 · 草墨贪吃蛇 · 2048 · 数字华容道</span>
                    </p>
                  </div>

                  {/* 🌟 核心 START 启动跳转按钮 (点击跳转到 /playground?start=true) */}
                  <div className="pt-2">
                    <Link
                      href="/playground?start=true"
                      className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-[#121413] text-xs sm:text-sm font-black tracking-widest uppercase transition-all shadow-[0_0_26px_rgba(251,191,36,0.6)] animate-pulse hover:scale-105 active:scale-95 cursor-pointer group"
                    >
                      <Play className="size-4 fill-current transition-transform group-hover:translate-x-0.5" />
                      <span>▶ PUSH [START] TO PLAY</span>
                    </Link>
                    <p className="mt-2 text-[10px] font-mono text-white/40">
                      点击 START 立即进入掌机游戏选择界面
                    </p>
                  </div>
                </div>

                {/* Arcade Bottom Copyright & Tips */}
                <div className="text-[10px] font-mono text-white/40 border-t border-white/10 pt-2 flex items-center justify-between px-1">
                  <span>© 2026 KASUMI STUDIO</span>
                  <span>按右侧 [START] 或点击中间按钮开机</span>
                </div>
              </div>

              {/* 帮助抽屉面板 */}
              {isHelpOpen && (
                <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md p-6 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between border-b border-white/15 pb-3">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="size-4 text-[#7CD090]" />
                      <span className="font-bold text-white text-sm">游乐场快捷指南</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsHelpOpen(false)}
                      className="text-[10px] font-mono text-white/50 hover:text-white cursor-pointer"
                    >
                      按右侧 [ ? ] 键关闭
                    </button>
                  </div>

                  <div className="space-y-2.5 max-w-md mx-auto w-full py-2">
                    <div className="p-3 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between text-xs text-white">
                      <span className="flex items-center gap-2">
                        <Play className="size-3.5 text-[#7CD090] fill-current" />
                        <strong>进入游乐场</strong>
                      </span>
                      <span className="text-[10px] text-[#7CD090] font-mono">点击 PUSH START 按钮</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-white/80">
                      <span className="flex items-center gap-2">
                        <Trophy className="size-3.5 text-amber-400" />
                        <span>收录经典小游戏</span>
                      </span>
                      <span className="text-[10px] text-white/50 font-mono">象棋 / 五子棋 / 贪吃蛇 / 2048 / 华容道</span>
                    </div>
                  </div>

                  <div className="border-t border-white/15 pt-2 flex items-center justify-between text-[10px] font-mono text-white/40">
                    <Link
                      href="/playground?start=true"
                      className="text-[#7CD090] hover:underline flex items-center gap-1"
                    >
                      <span>前往完整游乐场页面 ▶</span>
                    </Link>
                    <span>KASUMI CONSOLE OS · 2026</span>
                  </div>
                </div>
              )}

            </div>

            {/* ============================================================= */}
            {/* 右侧握把区：实体 HELP 帮助键 + START 确认键 (Right Grip Buttons) */}
            {/* ============================================================= */}
            <div className="hidden md:flex flex-col items-center justify-between h-[340px] w-20 shrink-0 py-3 select-none">
              {/* Online Badge */}
              <div className="flex items-center gap-1 text-[#6F7E70]">
                <Wifi className="size-3.5" />
                <span className="font-mono text-[9px] font-bold">ONLINE</span>
              </div>

              {/* 实体双按键：HELP 帮助按键 + PLAY 确认开玩按键 */}
              <div className="flex flex-col items-center gap-5">
                {/* 1. 实体 HELP 帮助按键 (?) */}
                <button
                  type="button"
                  onClick={() => setIsHelpOpen((prev) => !prev)}
                  className={`size-12 rounded-2xl transition-all flex flex-col items-center justify-center gap-0.5 border cursor-pointer active:scale-90 ${
                    isHelpOpen
                      ? "bg-[#36513B] text-white border-[#7CD090] shadow-[0_0_14px_rgba(124,208,144,0.4)] ring-2 ring-[#7CD090]/40"
                      : "bg-[#26352A] dark:bg-[#0D150F] text-[#7CD090] border-white/15 hover:bg-[#36513B] shadow-md hover:border-[#7CD090]/50"
                  }`}
                  title="呼出/收起帮助指南 (?)"
                  aria-label="呼出帮助指南"
                >
                  <span className="font-bold text-base leading-none">?</span>
                  <span className="font-mono text-[8px] font-bold tracking-tighter">
                    HELP
                  </span>
                </button>

                {/* 2. 实体 START 确认开玩按键 (A) -> 直达 /playground?start=true */}
                <Link
                  href="/playground?start=true"
                  className="size-12 rounded-full bg-amber-500 hover:bg-amber-400 text-[#121413] transition-all flex flex-col items-center justify-center gap-0.5 border border-white/20 shadow-[0_0_16px_rgba(245,158,11,0.5)] active:scale-90 cursor-pointer group animate-pulse"
                  title="点击启动游戏并进入游乐场 (A / START)"
                  aria-label="启动游戏并进入游乐场"
                >
                  <span className="font-black text-sm text-[#121413] leading-none group-hover:scale-110 transition-transform">
                    A
                  </span>
                  <span className="font-mono text-[8px] font-black tracking-tighter text-[#121413]">
                    START
                  </span>
                </Link>
              </div>

              {/* 右扬声器微孔 */}
              <div className="grid grid-cols-3 gap-1 opacity-35">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="size-1 rounded-full bg-[#26352A] dark:bg-white"
                  />
                ))}
              </div>
            </div>

          </div>

          {/* 掌机底部 SELECT / START 实体胶囊按键 */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 pt-4 select-none">
            <button
              type="button"
              onClick={() => setIsHelpOpen((prev) => !prev)}
              className="px-3.5 py-1 rounded-full bg-[#26352A]/15 dark:bg-white/10 hover:bg-[#36513B] hover:text-white transition-all text-[10px] font-mono font-bold text-[#6F7E70] flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="size-3" />
              <span>帮助指南</span>
            </button>
            <Link
              href="/playground?start=true"
              className="px-5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-[#121413] transition-all text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-md cursor-pointer animate-pulse hover:scale-105 active:scale-95"
            >
              <Coins className="size-3.5" />
              <span>▶ PUSH [START] 进入游乐场</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
