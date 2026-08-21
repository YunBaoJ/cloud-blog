"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Play,
  Sparkles,
  Volume2,
  Battery,
  Wifi,
  Menu,
  Gamepad2,
  X,
  Settings,
  HelpCircle,
  Trophy,
  Power,
  RotateCcw,
  Coins,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type GameId = "xiangqi" | "gomoku" | "snake" | "2048" | "puzzle";

interface GameData {
  id: GameId;
  index: string;
  name: string;
  nameEn: string;
  cover: string;
  genre: string;
  publisher: string;
  version: string;
  players: string;
  tip: string;
}

const PLAYGROUND_GAMES: GameData[] = [
  {
    id: "xiangqi",
    index: "01",
    name: "中国象棋 AI",
    nameEn: "Xiangqi Master",
    cover: "/playground/game-xiangqi.jpg",
    genre: "策略博弈 · 楚河汉界",
    publisher: "Kasumi Studio",
    version: "v2.4.0",
    players: "1 - 2 玩家 (含 AI 军师)",
    tip: "方向键 / 鼠标点选",
  },
  {
    id: "gomoku",
    index: "02",
    name: "五子棋",
    nameEn: "Gomoku Zen",
    cover: "/playground/game-gomoku.jpg",
    genre: "经典连珠 · 15×15",
    publisher: "Kasumi Studio",
    version: "v1.8.2",
    players: "1 - 2 玩家 (含启发式 AI)",
    tip: "方向键 / 鼠标点选",
  },
  {
    id: "snake",
    index: "03",
    name: "草墨贪吃蛇",
    nameEn: "Cyber Snake",
    cover: "/playground/game-snake.jpg",
    genre: "复古街机 · 敏捷走位",
    publisher: "Retro Pixel",
    version: "v1.2.0",
    players: "1 玩家",
    tip: "WASD / 方向键 · 触屏滑动",
  },
  {
    id: "2048",
    index: "04",
    name: "2048",
    nameEn: "Merge 2048",
    cover: "/playground/game-2048.jpg",
    genre: "脑力益智 · 指数合成",
    publisher: "Puzzle Lab",
    version: "v1.0.5",
    players: "1 玩家",
    tip: "WASD / 方向键 · 触屏滑动",
  },
  {
    id: "puzzle",
    index: "05",
    name: "数字华容道",
    nameEn: "Slide 15",
    cover: "/playground/game-puzzle.jpg",
    genre: "机械解谜 · 几何复位",
    publisher: "Logic Works",
    version: "v1.1.0",
    players: "1 玩家",
    tip: "点击相邻方块滑动",
  },
];

export default function PlaygroundTeaser() {
  // 状态机：isPoweredOn 控制是否开机/插卡（默认初始为街机待机/投币画面）
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("23:59");
  const [credits, setCredits] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeGame = PLAYGROUND_GAMES[selectedIdx];

  // Real-time clock for console status bar
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

  const powerOn = () => {
    setIsPoweredOn(true);
  };

  const prevGame = () => {
    if (!isPoweredOn) {
      setIsPoweredOn(true);
      return;
    }
    setSelectedIdx((prev) => (prev === 0 ? PLAYGROUND_GAMES.length - 1 : prev - 1));
  };

  const nextGame = () => {
    if (!isPoweredOn) {
      setIsPoweredOn(true);
      return;
    }
    setSelectedIdx((prev) => (prev === PLAYGROUND_GAMES.length - 1 ? 0 : prev + 1));
  };

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".playground-console-anim", {
        y: 20,
        opacity: 0,
        scale: 0.98,
        duration: 0.5,
        stagger: 0.06,
        ease: "power2.out",
        clearProps: "all",
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="playground"
      className="relative min-h-[100dvh] w-full overflow-hidden border-t border-[#36513B]/16 bg-transparent px-4 py-20 select-none dark:border-white/16 sm:px-6 md:py-28 lg:px-8"
    >
      {/* Background Ambient Pine Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#36513B]/6 dark:bg-[#7CD090]/4 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="playground-console-anim flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3">
            <p className="font-mono text-[10px] font-bold tracking-[0.12em] text-[#6F7E70] uppercase">
              04 / INSPIRATION PLAYGROUND
            </p>
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
            <span>查看全部</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* ================================================================= */}
        {/* 🎮 真实街机/掌机硬件机身 (Arcade Console Hardware Frame) */}
        {/* ================================================================= */}
        <div className="playground-console-anim relative mx-auto w-full max-w-6xl pt-7 sm:pt-8">
          
          {/* 顶部 L1 / R1 实体肩键 (Elevated Shoulder Triggers) */}
          <div className="absolute top-0 inset-x-12 sm:inset-x-24 flex justify-between z-0 pointer-events-auto select-none">
            <button
              type="button"
              onClick={prevGame}
              className="h-8 sm:h-9 px-6 sm:px-8 rounded-t-2xl sm:rounded-t-3xl bg-[#26352A] dark:bg-[#152319] text-white/95 text-xs font-mono font-bold tracking-wider hover:bg-[#36513B] active:translate-y-1 transition-all shadow-[0_-4px_12px_rgba(0,0,0,0.15)] border-t-2 border-x-2 border-white/25 flex items-center gap-2 cursor-pointer group"
              title="切换到上一个游戏 [ L1 ]"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform text-[#7CD090]">◀</span>
              <span>[ L1 ]</span>
              <span className="hidden sm:inline text-[10px] text-white/60">PREV</span>
            </button>
            <button
              type="button"
              onClick={nextGame}
              className="h-8 sm:h-9 px-6 sm:px-8 rounded-t-2xl sm:rounded-t-3xl bg-[#26352A] dark:bg-[#152319] text-white/95 text-xs font-mono font-bold tracking-wider hover:bg-[#36513B] active:translate-y-1 transition-all shadow-[0_-4px_12px_rgba(0,0,0,0.15)] border-t-2 border-x-2 border-white/25 flex items-center gap-2 cursor-pointer group"
              title="切换到下一个游戏 [ R1 ]"
            >
              <span className="hidden sm:inline text-[10px] text-white/60">NEXT</span>
              <span>[ R1 ]</span>
              <span className="group-hover:translate-x-0.5 transition-transform text-[#7CD090]">▶</span>
            </button>
          </div>

          {/* 掌机双握把机身外壳 (Ergonomic Dual-Grip Chassis) */}
          <div className="relative z-10 rounded-[2.8rem] sm:rounded-[3.8rem] bg-[#EAE6DC] dark:bg-[#16231A] p-3 sm:p-5 sm:px-7 border-4 border-[#26352A]/20 dark:border-white/18 shadow-[0_24px_70px_rgba(38,53,42,0.2)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-4 sm:gap-6 justify-between">
            
            {/* ============================================================= */}
            {/* 左侧握把区：极简模拟摇杆 + 呼吸灯 (Left Grip) */}
            {/* ============================================================= */}
            <div className="hidden md:flex flex-col items-center justify-between h-[340px] w-20 shrink-0 py-3 select-none">
              {/* Power LED */}
              <div className="flex items-center gap-1.5">
                <span
                  className={`size-2 rounded-full transition-all ${
                    isPoweredOn
                      ? "bg-[#7CD090] animate-pulse shadow-[0_0_8px_#7CD090]"
                      : "bg-amber-400/80 animate-ping shadow-[0_0_8px_#FBBF24]"
                  }`}
                />
                <span className="font-mono text-[9px] font-bold text-[#6F7E70] tracking-widest uppercase">
                  {isPoweredOn ? "ONLINE" : "INSERT"}
                </span>
              </div>

              {/* 实体掌机模拟摇杆 (Analog Thumbstick) */}
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={nextGame}
                  className="group relative size-16 rounded-full bg-[#26352A] dark:bg-[#0D150F] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_6px_14px_rgba(0,0,0,0.3)] flex items-center justify-center p-1.5 active:scale-95 transition-all cursor-pointer"
                  title="点击摇杆切换游戏"
                >
                  <div className="size-full rounded-full bg-gradient-to-br from-[#36513B] to-[#1E2E23] border border-white/15 shadow-inner flex items-center justify-center group-hover:scale-105 transition-transform">
                    <div className="size-6 rounded-full border border-white/20 bg-black/20" />
                  </div>
                </button>
                <span className="font-mono text-[9px] text-[#7A736A] dark:text-[#9EB3A4]">STICK</span>
              </div>

              {/* 左扬声器微孔 */}
              <div className="grid grid-cols-3 gap-1 opacity-35">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="size-1 rounded-full bg-[#26352A] dark:bg-white" />
                ))}
              </div>
            </div>

            {/* ============================================================= */}
            {/* 中央屏幕：初始街机待机投币画面 VS 游戏机运行主界面 (Display) */}
            {/* ============================================================= */}
            <div className="relative flex-1 w-full min-h-[360px] sm:min-h-[400px] rounded-[1.8rem] sm:rounded-[2.4rem] bg-[#0A0D0B] p-4 sm:p-6 shadow-[inset_0_4px_32px_rgba(0,0,0,0.98)] border border-white/10 overflow-hidden flex flex-col justify-between select-none">
              
              {!isPoweredOn ? (
                /* ========================================================= */
                /* 🪙 状态 1：街机待机/投币演示画面 (Attract Mode / Insert Coin) */
                /* ========================================================= */
                <div className="relative z-10 flex-1 flex flex-col justify-between py-2 text-center animate-in fade-in duration-300">
                  
                  {/* Arcade Top Score Bar */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/50 border-b border-white/10 pb-2 px-1">
                    <span className="text-[#7CD090] font-bold">1P: 002480</span>
                    <span className="text-amber-400 font-bold tracking-wider">HIGH SCORE: 999990</span>
                    <span className="text-white/70">CREDIT: 0{credits}</span>
                  </div>

                  {/* Arcade Center Neon Title & Insert Coin Prompt */}
                  <div className="space-y-4 py-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono tracking-[0.3em] text-[#7CD090] uppercase font-bold">
                        ★ CLOUD ARCADE SYSTEM 1998 ★
                      </p>
                      <h3 className="text-3xl sm:text-5xl font-black text-white tracking-wider font-mono drop-shadow-[0_0_20px_rgba(124,208,144,0.4)]">
                        INSERT COIN
                      </h3>
                      <p className="text-xs font-mono text-white/60 pt-1">
                        请投币或载入下方实体卡带开机
                      </p>
                    </div>

                    {/* Blinking Push Start / Insert Coin */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={powerOn}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-[#121413] text-xs font-black tracking-widest uppercase transition-all shadow-[0_0_24px_rgba(251,191,36,0.5)] animate-pulse hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <Coins className="size-4" />
                        <span>▶ PUSH [START] TO PLAY</span>
                      </button>
                    </div>
                  </div>

                  {/* Arcade Bottom Copyright & Tips */}
                  <div className="text-[10px] font-mono text-white/40 border-t border-white/10 pt-2 flex items-center justify-between px-1">
                    <span>© 2026 KASUMI STUDIO</span>
                    <span>按右侧 [COIN] 或下方 [START] 键开机</span>
                  </div>

                </div>
              ) : (
                /* ========================================================= */
                /* 🕹️ 状态 2：游戏机正式运行与卡带轮播界面 (Console Running OS) */
                /* ========================================================= */
                <div className="relative z-10 flex-1 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
                  
                  {/* 1. 真实主机顶部状态栏 */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/70 border-b border-white/10 pb-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded-full bg-[#36513B] text-[#7CD090] flex items-center justify-center font-bold text-[10px] border border-[#7CD090]/40">
                        K
                      </div>
                      <span className="font-bold text-white text-[11px]">Cloud OS</span>
                      <span className="size-1.5 rounded-full bg-[#7CD090]" />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold tracking-wider text-white text-xs">{currentTime}</span>
                      <Wifi className="size-3.5 text-[#7CD090]" />
                      <div className="flex items-center gap-1 text-[#7CD090]">
                        <Battery className="size-4" />
                        <span className="text-[10px] font-bold">100%</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. 真实主机游戏卡带封面轮播舞台 */}
                  <div className="py-3 sm:py-5 flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center gap-3 sm:gap-4.5 w-full overflow-x-hidden px-2">
                      {PLAYGROUND_GAMES.map((game, idx) => {
                        const isSelected = selectedIdx === idx;
                        return (
                          <div
                            key={game.id}
                            onClick={() => setSelectedIdx(idx)}
                            className={`relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer shrink-0 ${
                              isSelected
                                ? "size-28 sm:size-36 ring-4 ring-white shadow-[0_0_30px_rgba(255,255,255,0.4)] -translate-y-2 z-20 scale-105"
                                : "size-20 sm:size-24 opacity-40 hover:opacity-75 z-10 border border-white/20"
                            }`}
                          >
                            <Image
                              src={game.cover}
                              alt={game.name}
                              fill
                              sizes="150px"
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            
                            {isSelected && (
                              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-mono text-[#7CD090] font-bold">
                                0{idx + 1}
                              </div>
                            )}
                            <span className="absolute bottom-1.5 left-2 right-2 text-[10px] sm:text-xs font-bold text-white truncate">
                              {game.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* 选中游戏的元信息 */}
                    <div className="pt-4 text-center space-y-1">
                      <div className="flex items-center justify-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                          {activeGame.name}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                          {activeGame.version}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-[#7CD090]">
                        {activeGame.publisher} · {activeGame.genre} · {activeGame.players}
                      </p>
                    </div>
                  </div>

                  {/* 3. 底部按键指南栏 */}
                  <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 px-2 text-[11px] font-mono text-white/70">
                    <div className="flex items-center gap-2 text-white/50 text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">[ L / R ]</span>
                      <span>选择游戏</span>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] sm:text-[11px]">
                      <div className="flex items-center gap-1.5 text-white/90 font-semibold">
                        <span className="size-4 rounded-full bg-[#36513B] text-[#7CD090] border border-[#7CD090] flex items-center justify-center font-bold text-[10px]">
                          ?
                        </span>
                        <span>HELP 帮助</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[#7CD090] font-bold">
                        <span className="size-4 rounded-full bg-[#7CD090] text-[#121413] flex items-center justify-center font-black text-[9px] shadow-[0_0_8px_#7CD090]">
                          A
                        </span>
                        <span>START 启动</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* 4. 帮助抽屉面板 */}
              {isOptionsOpen && isPoweredOn && (
                <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md p-6 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between border-b border-white/15 pb-3">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="size-4 text-[#7CD090]" />
                      <span className="font-bold text-white text-sm">帮助指南 · {activeGame.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/50">按右侧 [ ? ] 键关闭</span>
                  </div>

                  <div className="space-y-2.5 max-w-md mx-auto w-full py-2">
                    <div className="p-3 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between text-xs text-white">
                      <span className="flex items-center gap-2">
                        <Play className="size-3.5 text-[#7CD090] fill-current" />
                        <strong>启动软件</strong>
                      </span>
                      <span className="text-[10px] text-[#7CD090] font-mono">按 PLAY / A 键</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-white/80">
                      <span className="flex items-center gap-2">
                        <HelpCircle className="size-3.5 text-white/60" />
                        <span>操作方式</span>
                      </span>
                      <span className="text-[10px] text-white/50 font-mono">{activeGame.tip}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-white/80">
                      <span className="flex items-center gap-2">
                        <Trophy className="size-3.5 text-amber-400" />
                        <span>游戏类型与版本</span>
                      </span>
                      <span className="text-[10px] text-white/50 font-mono">{activeGame.genre} · {activeGame.version}</span>
                    </div>
                  </div>

                  <div className="border-t border-white/15 pt-2 flex items-center justify-between text-[10px] font-mono text-white/40">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOptionsOpen(false);
                        setIsPoweredOn(false);
                      }}
                      className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="size-3" />
                      <span>关机并返回待机画面</span>
                    </button>
                    <span>KASUMI CONSOLE OS · 2026</span>
                  </div>
                </div>
              )}

            </div>

            {/* ============================================================= */}
            {/* 右侧握把区：实体 HELP 帮助键 + PLAY 确认键 (Right Grip Buttons) */}
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
                  onClick={() => {
                    if (!isPoweredOn) {
                      setIsPoweredOn(true);
                    } else {
                      setIsOptionsOpen((prev) => !prev);
                    }
                  }}
                  className={`size-12 rounded-2xl transition-all flex flex-col items-center justify-center gap-0.5 border cursor-pointer active:scale-90 ${
                    isOptionsOpen
                      ? "bg-[#36513B] text-white border-[#7CD090] shadow-[0_0_14px_rgba(124,208,144,0.4)] ring-2 ring-[#7CD090]/40"
                      : "bg-[#26352A] dark:bg-[#0D150F] text-[#7CD090] border-white/15 hover:bg-[#36513B] shadow-md hover:border-[#7CD090]/50"
                  }`}
                  title="呼出/收起帮助指南 (?)"
                  aria-label="呼出帮助指南"
                >
                  <span className="font-bold text-base leading-none">?</span>
                  <span className="font-mono text-[8px] font-bold tracking-tighter">HELP</span>
                </button>

                {/* 2. 实体 PLAY 确认开玩按键 (A) */}
                {isPoweredOn ? (
                  <Link
                    href={`/playground#${activeGame.id}`}
                    className="size-12 rounded-full bg-[#26352A] dark:bg-[#0D150F] hover:bg-[#36513B] text-white transition-all flex flex-col items-center justify-center gap-0.5 border border-white/15 shadow-md active:scale-90 cursor-pointer group hover:border-[#7CD090]/50"
                    title="启动游戏 (A)"
                    aria-label="启动游戏"
                  >
                    <span className="font-black text-sm text-[#7CD090] leading-none group-hover:scale-110 transition-transform">A</span>
                    <span className="font-mono text-[8px] font-bold tracking-tighter text-white/80">START</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={powerOn}
                    className="size-12 rounded-full bg-amber-500 hover:bg-amber-400 text-[#121413] transition-all flex flex-col items-center justify-center gap-0.5 border border-white/20 shadow-[0_0_15px_rgba(245,158,11,0.4)] active:scale-90 cursor-pointer group animate-pulse"
                    title="投币开机"
                  >
                    <Coins className="size-4" />
                    <span className="font-mono text-[8px] font-bold tracking-tighter">COIN</span>
                  </button>
                )}
              </div>

              {/* 右扬声器微孔 */}
              <div className="grid grid-cols-3 gap-1 opacity-35">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="size-1 rounded-full bg-[#26352A] dark:bg-white" />
                ))}
              </div>
            </div>

          </div>

          {/* 掌机底部 SELECT / START 实体胶囊按键 */}
          <div className="flex items-center justify-center gap-6 pt-3 select-none">
            {isPoweredOn ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsOptionsOpen((prev) => !prev)}
                  className="px-3.5 py-1 rounded-full bg-[#26352A]/15 dark:bg-white/10 hover:bg-[#36513B] hover:text-white transition-all text-[10px] font-mono font-bold text-[#6F7E70] flex items-center gap-1 cursor-pointer"
                >
                  <span>? 帮助指南</span>
                </button>
                <Link
                  href={`/playground#${activeGame.id}`}
                  className="px-4 py-1 rounded-full bg-[#36513B] text-white hover:bg-[#46654C] transition-all text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <span>(A) 启动游戏 ▶</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsPoweredOn(false)}
                  className="px-3 py-1 rounded-full bg-black/10 dark:bg-white/5 hover:text-red-400 transition-all text-[9px] font-mono text-[#7A736A] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="size-2.5" />
                  <span>重置待机</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={powerOn}
                className="px-5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-[#121413] transition-all text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-md cursor-pointer animate-pulse"
              >
                <Coins className="size-3.5" />
                <span>投币开机 (INSERT COIN)</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
