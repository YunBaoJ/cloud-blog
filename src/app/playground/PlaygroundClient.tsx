"use client";

import { useEffect, useCallback, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Footer from "@/components/Footer";
import SnakeGame from "@/components/games/SnakeGame";
import Game2048 from "@/components/games/Game2048";
import SlidePuzzle from "@/components/games/SlidePuzzle";
import Gomoku from "@/components/games/Gomoku";
import Xiangqi from "@/components/games/Xiangqi";
import {
  X,
  Play,
  Sparkles,
  Volume2,
  Battery,
  Wifi,
  Menu,
  Gamepad2,
  Settings,
  HelpCircle,
  Trophy,
  RotateCcw,
  Coins,
  Maximize2,
  Minimize2,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useMounted } from "@/lib/useMounted";
import GameModalControls from "@/components/games/GameModalControls";
import { GameActivityProvider } from "@/components/games/GameActivityContext";
import { playGameSound, triggerGameHaptic } from "@/lib/gameSounds";

gsap.registerPlugin(useGSAP);

export type GameId = "xiangqi" | "gomoku" | "snake" | "2048" | "puzzle";

export const GAMES = [
  {
    id: "xiangqi" as const,
    index: "01",
    code: "NUS-XQ-CHN",
    name: "中国象棋 AI",
    nameEn: "Xiangqi Master",
    kanji: "楚河漢界",
    cover: "/playground/game-xiangqi.jpg",
    shellColor: "from-[#8B261D] via-[#5C1610] to-[#2E0B08]",
    accentColor: "#D97706",
    borderColor: "border-[#C97A5E]/40",
    genre: "策略博弈 · 楚河汉界",
    publisher: "Kasumi Studio",
    version: "v2.4.0",
    players: "1 - 2 玩家 (含 AI 军师)",
    tip: "方向键 / 鼠标点选",
    capacity: "64 MEGABIT",
  },
  {
    id: "gomoku" as const,
    index: "02",
    code: "NUS-GMK-JPN",
    name: "五子棋",
    nameEn: "Gomoku Zen",
    kanji: "黑白連珠",
    cover: "/playground/game-gomoku.jpg",
    shellColor: "from-[#1C442D] via-[#122E1E] to-[#0A1A11]",
    accentColor: "#7CD090",
    borderColor: "border-[#5E9E75]/40",
    genre: "经典连珠 · 15×15",
    publisher: "Kasumi Studio",
    version: "v1.8.2",
    players: "1 - 2 玩家 (含启发式 AI)",
    tip: "方向键 / 鼠标点选",
    capacity: "32 MEGABIT",
  },
  {
    id: "snake" as const,
    index: "03",
    code: "NUS-SNK-RET",
    name: "草墨贪吃蛇",
    nameEn: "Cyber Snake",
    kanji: "靈蛇游境",
    cover: "/playground/game-snake.jpg",
    shellColor: "from-[#2A4B3A] via-[#1B3226] to-[#0E1B14]",
    accentColor: "#10B981",
    borderColor: "border-[#67B888]/40",
    genre: "复古街机 · 敏捷走位",
    publisher: "Retro Pixel",
    version: "v1.2.0",
    players: "1 玩家",
    tip: "WASD / 方向键 · 触屏滑动",
    capacity: "16 MEGABIT",
  },
  {
    id: "2048" as const,
    index: "04",
    code: "NUS-2048-LAB",
    name: "2048",
    nameEn: "Merge 2048",
    kanji: "合璧至尊",
    cover: "/playground/game-2048.jpg",
    shellColor: "from-[#B46D28] via-[#7B4614] to-[#422408]",
    accentColor: "#F59E0B",
    borderColor: "border-[#E5A866]/40",
    genre: "脑力益智 · 指数合成",
    publisher: "Puzzle Lab",
    version: "v1.0.5",
    players: "1 玩家",
    tip: "WASD / 方向键 · 触屏滑动",
    capacity: "32 MEGABIT",
  },
  {
    id: "puzzle" as const,
    index: "05",
    code: "NUS-SLD-LOG",
    name: "数字华容道",
    nameEn: "Slide 15",
    kanji: "乾坤推移",
    cover: "/playground/game-puzzle.jpg",
    shellColor: "from-[#4B5563] via-[#333C48] to-[#1A1F26]",
    accentColor: "#93C5FD",
    borderColor: "border-[#9CA3AF]/40",
    genre: "机械解谜 · 几何复位",
    publisher: "Logic Works",
    version: "v1.1.0",
    players: "1 玩家",
    tip: "点击相邻方块滑动",
    capacity: "16 MEGABIT",
  },
];

function subscribeToHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
}

function getGameFromHash(): GameId | null {
  const id = window.location.hash.slice(1);
  return GAMES.some((game) => game.id === id) ? (id as GameId) : null;
}

// ── Game Modal — rendered via portal to document.body ──────────────
function GameModal({
  activeGame,
  activeInfo,
  isOpen,
  close,
}: {
  activeGame: GameId;
  activeInfo: (typeof GAMES)[number] | undefined;
  isOpen: boolean;
  close: () => void;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isOpen) setIsFullscreen(false);
  }, [isOpen]);

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-md transition-all duration-200 ${
        isFullscreen ? "p-0" : "p-2.5 sm:p-6"
      }`}
      style={{ display: isOpen ? "flex" : "none" }}
      aria-hidden={!isOpen}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className={`relative flex flex-col overflow-hidden bg-[#FAF7F2] dark:bg-[#18261D] border border-[var(--border-line-color)] shadow-[0_24px_80px_rgba(0,0,0,0.3)] transition-all duration-200 ${
          isFullscreen
            ? "w-full h-full rounded-none"
            : "w-full max-w-3xl max-h-[94dvh] sm:max-h-[90dvh] rounded-3xl animate-modal-in"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[var(--border-line-color)] bg-[var(--surface)]/80 dark:bg-[#1B2D22]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-base font-bold text-[var(--foreground)]">
              {activeInfo?.name}
            </span>
            <span className="text-xs font-mono text-[var(--muted)]">
              {activeInfo?.nameEn}
            </span>
            {activeInfo?.genre && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--accent-green)]/10 text-[var(--accent-green)] font-medium">
                {activeInfo.genre}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <GameModalControls />
            <button
              onClick={() => setIsFullscreen((prev) => !prev)}
              className="p-1.5 sm:p-2 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/8 transition-colors cursor-pointer"
              title={isFullscreen ? "退出全屏" : "全屏沉浸"}
              aria-label={isFullscreen ? "退出全屏" : "全屏沉浸"}
            >
              {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
            </button>
            <button
              onClick={close}
              className="p-1.5 sm:p-2 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/8 transition-colors cursor-pointer"
              aria-label="关闭"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Game content */}
        <GameActivityProvider active={isOpen}>
          <div className="min-w-0 overflow-y-auto overscroll-contain p-2.5 sm:p-5 flex-1" key={activeGame}>
            {activeGame === "snake" && <SnakeGame />}
            {activeGame === "2048" && <Game2048 />}
            {activeGame === "puzzle" && <SlidePuzzle />}
            {activeGame === "gomoku" && <Gomoku />}
            {activeGame === "xiangqi" && <Xiangqi />}
          </div>
        </GameActivityProvider>
      </div>

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.96) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in {
          animation: modal-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>,
    document.body
  );
}

// ──────────────────────────────────────────────────────────────────
// 🕹️ 主页面组件：【复古实体掌机游戏工作站】(Handheld Console Station)
// ──────────────────────────────────────────────────────────────────
export default function PlaygroundClient() {
  const isMounted = useMounted();
  const rawHashGame = useSyncExternalStore(subscribeToHash, getGameFromHash, () => null);

  const [activeModalGame, setActiveModalGame] = useState<GameId | null>(null);
  const [insertedCartridge, setInsertedCartridge] = useState<GameId | null>("xiangqi");
  const [isBooting, setIsBooting] = useState(false);
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("12:00");
  const [credits, setCredits] = useState(2);
  const [isDragOverBay, setIsDragOverBay] = useState(false);
  const [isDraggingId, setIsDraggingId] = useState<GameId | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const activeGameIdx = insertedCartridge
    ? Math.max(0, GAMES.findIndex((g) => g.id === insertedCartridge))
    : 0;
  const activeGameInfo = GAMES[activeGameIdx];

  // Insert a cartridge with sound, haptics, and auto-power boot
  const insertCartridge = useCallback((gameId: GameId) => {
    playGameSound("2048-merge");
    triggerGameHaptic("heavy");
    setInsertedCartridge(gameId);
    setIsOptionsOpen(false);
    setIsPoweredOn(true);
    setIsBooting(true);
    setTimeout(() => {
      setIsBooting(false);
    }, 600);
  }, []);

  // Eject current cartridge
  const ejectCartridge = useCallback(() => {
    playGameSound("2048-over");
    triggerGameHaptic("medium");
    setInsertedCartridge(null);
    setIsOptionsOpen(false);
  }, []);

  // Hash change auto-triggers game
  useEffect(() => {
    if (rawHashGame) {
      setActiveModalGame(rawHashGame);
      setInsertedCartridge(rawHashGame);
      setIsPoweredOn(true);
    }
  }, [rawHashGame]);

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

  const openGame = useCallback((gameId: GameId) => {
    playGameSound("puzzle-move");
    triggerGameHaptic("medium");
    setActiveModalGame(gameId);
    window.location.hash = gameId;
  }, []);

  const closeGame = useCallback(() => {
    setActiveModalGame(null);
    if (window.location.hash) {
      window.history.pushState(null, "", window.location.pathname);
    }
  }, []);

  const powerOn = useCallback(() => {
    playGameSound("2048-win");
    triggerGameHaptic("victory");
    setIsPoweredOn(true);
  }, []);

  const prevGame = useCallback(() => {
    if (!insertedCartridge) {
      insertCartridge(GAMES[0].id);
      return;
    }
    const currentIdx = GAMES.findIndex((g) => g.id === insertedCartridge);
    const nextIdx = currentIdx === 0 ? GAMES.length - 1 : currentIdx - 1;
    insertCartridge(GAMES[nextIdx].id);
  }, [insertedCartridge, insertCartridge]);

  const nextGame = useCallback(() => {
    if (!insertedCartridge) {
      insertCartridge(GAMES[0].id);
      return;
    }
    const currentIdx = GAMES.findIndex((g) => g.id === insertedCartridge);
    const nextIdx = currentIdx === GAMES.length - 1 ? 0 : currentIdx + 1;
    insertCartridge(GAMES[nextIdx].id);
  }, [insertedCartridge, insertCartridge]);

  // Global Keyboard Gamepad Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalGame || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        prevGame();
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        nextGame();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!isPoweredOn) {
          powerOn();
        } else if (insertedCartridge) {
          openGame(insertedCartridge);
        } else {
          insertCartridge(GAMES[0].id);
        }
      } else if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        playGameSound("2048-merge");
        triggerGameHaptic("medium");
        setCredits((c) => Math.min(99, c + 1));
        if (!isPoweredOn) setIsPoweredOn(true);
      } else if (e.key === "e" || e.key === "E") {
        e.preventDefault();
        if (insertedCartridge) ejectCartridge();
      } else if (e.key === "h" || e.key === "H" || e.key === "?") {
        e.preventDefault();
        if (isPoweredOn && insertedCartridge) {
          playGameSound("puzzle-move");
          triggerGameHaptic("soft");
          setIsOptionsOpen((prev) => !prev);
        }
      } else if (e.key === "Escape") {
        if (isOptionsOpen) {
          setIsOptionsOpen(false);
        } else if (isPoweredOn) {
          setIsPoweredOn(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModalGame, isPoweredOn, isOptionsOpen, insertedCartridge, prevGame, nextGame, openGame, powerOn, insertCartridge, ejectCartridge]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".playground-page-anim", {
        y: 28,
        opacity: 0,
        scale: 0.98,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
      });
    },
    { scope: pageRef }
  );

  return (
    <div ref={pageRef} className="min-h-screen flex flex-col justify-between select-none">
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20 space-y-12">
        
        {/* Page Header */}
        <div className="playground-page-anim space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#7CD090] tracking-widest uppercase">
              // RETRO HANDHELD ARCADE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#36513B]/10 dark:bg-white/10 text-[#36513B] dark:text-[#7CD090] font-mono">
              POCKET CONSOLE · 1998
            </span>
          </div>
          <h1 className="font-[family-name:var(--section-heading-font)] text-5xl sm:text-6xl font-extrabold text-[#26352A] dark:text-[#F0F5F1] tracking-tight">
            掌机<em className="ml-1 font-[family-name:var(--section-heading-font)] not-italic font-medium">游乐场</em>
          </h1>
          <p className="text-sm sm:text-base text-[#5A5551] dark:text-[#9EB3A4] max-w-2xl leading-relaxed">
            独立复古掌机与东方博弈实验工坊。支持将下方实体卡片<strong>直接拖拽或点击</strong>载入右侧卡槽，插卡即玩、投币开机。
          </p>
        </div>

        {/* ================================================================= */}
        {/* 🎮 独立路由页面专属实体掌机 (Standalone Dedicated Handheld Console) */}
        {/* ================================================================= */}
        <div className="playground-page-anim relative mx-auto w-full max-w-6xl pt-7 sm:pt-8">
          
          {/* 顶部 L1 / R1 实体肩键 (Top Shoulder Triggers) */}
          <div className="absolute top-0 inset-x-8 sm:inset-x-20 flex items-end justify-between z-0 pointer-events-auto select-none">
            {/* L1 Trigger */}
            <button
              type="button"
              onClick={prevGame}
              className="h-8 sm:h-9 px-6 sm:px-8 rounded-t-2xl sm:rounded-t-3xl bg-[#26352A] dark:bg-[#152319] text-white/95 text-xs font-mono font-bold tracking-wider hover:bg-[#36513B] active:translate-y-1 transition-all shadow-[0_-4px_12px_rgba(0,0,0,0.15)] border-t-2 border-x-2 border-white/25 flex items-center gap-2 cursor-pointer group"
              title="切换上一个卡带 [ L1 ]"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform text-[#7CD090]">◀</span>
              <span>[ L1 ]</span>
              <span className="hidden sm:inline text-[10px] text-white/60">PREV</span>
            </button>

            {/* R1 Trigger */}
            <button
              type="button"
              onClick={nextGame}
              className="h-8 sm:h-9 px-6 sm:px-8 rounded-t-2xl sm:rounded-t-3xl bg-[#26352A] dark:bg-[#152319] text-white/95 text-xs font-mono font-bold tracking-wider hover:bg-[#36513B] active:translate-y-1 transition-all shadow-[0_-4px_12px_rgba(0,0,0,0.15)] border-t-2 border-x-2 border-white/25 flex items-center gap-2 cursor-pointer group"
              title="切换下一个卡带 [ R1 ]"
            >
              <span className="hidden sm:inline text-[10px] text-white/60">NEXT</span>
              <span>[ R1 ]</span>
              <span className="group-hover:translate-x-0.5 transition-transform text-[#7CD090]">▶</span>
            </button>
          </div>

          {/* 掌机机身外壳 (Ergonomic Console Chassis with Right Cartridge Bay) */}
          <div className="relative z-10 rounded-[2.8rem] sm:rounded-[3.8rem] bg-[#EAE6DC] dark:bg-[#16231A] p-3 sm:p-5 sm:px-6 border-4 border-[#26352A]/20 dark:border-white/18 shadow-[0_24px_70px_rgba(38,53,42,0.2)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row items-center gap-4 sm:gap-5 justify-between">
            
            {/* ============================================================= */}
            {/* 1. 左侧握把区：极简模拟摇杆 + 呼吸灯 (Left Grip) */}
            {/* ============================================================= */}
            <div className="hidden lg:flex flex-col items-center justify-between h-[360px] w-16 shrink-0 py-3 select-none">
              {/* Power LED */}
              <div className="flex items-center gap-1.5">
                <span
                  className={`size-2 rounded-full transition-all ${
                    isPoweredOn && insertedCartridge
                      ? "bg-[#7CD090] animate-pulse shadow-[0_0_8px_#7CD090]"
                      : "bg-amber-400/80 animate-ping shadow-[0_0_8px_#FBBF24]"
                  }`}
                />
                <span className="font-mono text-[9px] font-bold text-[#6F7E70] tracking-widest uppercase">
                  {isPoweredOn && insertedCartridge ? "ONLINE" : "STANDBY"}
                </span>
              </div>

              {/* 实体掌机模拟摇杆 (Analog Thumbstick) */}
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={nextGame}
                  className="group relative size-15 rounded-full bg-[#26352A] dark:bg-[#0D150F] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_6px_14px_rgba(0,0,0,0.3)] flex items-center justify-center p-1.5 active:scale-95 transition-all cursor-pointer"
                  title="点击摇杆向右切盘"
                >
                  <div className="size-full rounded-full bg-gradient-to-br from-[#36513B] to-[#1E2E23] border border-white/15 shadow-inner flex items-center justify-center group-hover:scale-105 transition-transform">
                    <div className="size-5 rounded-full border border-white/20 bg-black/20" />
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
            {/* 2. 中央屏幕：街机待机投币 VS 游戏机运行主界面 (Display) */}
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
                        ★ KASUMI ARCADE SYSTEM 1998 ★
                      </p>
                      <h3 className="text-3xl sm:text-5xl font-black text-white tracking-wider font-mono drop-shadow-[0_0_20px_rgba(124,208,144,0.4)]">
                        INSERT COIN
                      </h3>
                      <p className="text-xs font-mono text-white/60 pt-1">
                        请投币或拖入右侧实体卡槽开机
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
                    <span>拖拽卡片至右侧或按 START 键载入</span>
                  </div>

                </div>
              ) : !insertedCartridge ? (
                /* ========================================================= */
                /* 📭 状态 2：已通电但空卡槽画面 (No Cartridge Inserted BIOS) */
                /* ========================================================= */
                <div className="relative z-10 flex-1 flex flex-col justify-between py-6 text-center animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/50 border-b border-white/10 pb-2.5 px-2">
                    <span className="font-bold text-amber-400">KASUMI BIOS v1.99</span>
                    <span className="text-white/60">{currentTime}</span>
                  </div>

                  <div className="space-y-4 py-8 max-w-sm mx-auto">
                    <div className="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-amber-400 shadow-inner animate-pulse">
                      <Gamepad2 className="size-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-mono font-bold text-white tracking-wide">
                        NO CARTRIDGE INSERTED
                      </h4>
                      <p className="text-xs font-mono text-[#7A736A] dark:text-[#9EB3A4]">
                        右侧卡槽为空 · 请从下方卡架将卡片拖入右侧卡槽，或直接点击卡片
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => insertCartridge(GAMES[0].id)}
                      className="px-5 py-2 rounded-full bg-[#36513B] text-[#7CD090] hover:bg-[#46654C] hover:text-white transition-all text-xs font-mono font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span>快速装载首发卡带 ➔</span>
                    </button>
                  </div>

                  <div className="text-[10px] font-mono text-white/30 border-t border-white/10 pt-2">
                    SYSTEM READY · SIDE-LOADING 64-BIT DUAL CHANNEL
                  </div>
                </div>
              ) : isBooting ? (
                /* ========================================================= */
                /* ⚡ 状态 3：卡带自检载入微动效 (ROM Booting Splash) */
                /* ========================================================= */
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-6 text-center animate-in fade-in duration-150">
                  <div className="space-y-3 font-mono text-left max-w-xs w-full p-4 rounded-xl bg-black/60 border border-white/15">
                    <p className="text-xs font-bold text-[#7CD090] animate-pulse">
                      [ LOADING ROM: {activeGameInfo.code} ]
                    </p>
                    <div className="text-[10px] text-white/70 space-y-0.5">
                      <p>&gt; SIDE BAY DETECTED: OK</p>
                      <p>&gt; BANK 0-64M: OK</p>
                      <p>&gt; CHECKSUM: PASS</p>
                      <p className="text-amber-300 font-bold">&gt; BOOTING ENGINE...</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* ========================================================= */
                /* 🕹️ 状态 4：卡带已装载，游戏机正式运行 (Console Running OS) */
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
                      {GAMES.map((game) => {
                        const isSelected = insertedCartridge === game.id;
                        return (
                          <div
                            key={game.id}
                            onClick={() => insertCartridge(game.id)}
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
                                {game.index}
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
                          {activeGameInfo.name}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                          {activeGameInfo.version}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-[#7CD090]">
                        {activeGameInfo.publisher} · {activeGameInfo.genre} · {activeGameInfo.players}
                      </p>
                    </div>
                  </div>

                  {/* 3. 底部按键指南栏 */}
                  <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 px-2 text-[11px] font-mono text-white/70">
                    <div className="flex items-center gap-2 text-white/50 text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">[ L / R ]</span>
                      <span>切卡</span>
                      <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold ml-1">[ E ]</span>
                      <span>弹卡</span>
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

              {/* 4. 帮助指南抽屉面板 */}
              {isOptionsOpen && isPoweredOn && insertedCartridge && (
                <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md p-6 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between border-b border-white/15 pb-3">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="size-4 text-[#7CD090]" />
                      <span className="font-bold text-white text-sm">帮助指南 · {activeGameInfo.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/50">按右侧 [ ? ] 键关闭</span>
                  </div>

                  <div className="space-y-2.5 max-w-md mx-auto w-full py-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOptionsOpen(false);
                        openGame(activeGameInfo.id);
                      }}
                      className="w-full p-3 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between text-xs text-white hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Play className="size-3.5 text-[#7CD090] fill-current" />
                        <strong>立即启动游戏</strong>
                      </span>
                      <span className="text-[10px] text-[#7CD090] font-mono">按 PLAY / A 键</span>
                    </button>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-white/80">
                      <span className="flex items-center gap-2">
                        <HelpCircle className="size-3.5 text-white/60" />
                        <span>操作方式</span>
                      </span>
                      <span className="text-[10px] text-white/50 font-mono">{activeGameInfo.tip}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-white/80">
                      <span className="flex items-center gap-2">
                        <Trophy className="size-3.5 text-amber-400" />
                        <span>游戏类型与版本</span>
                      </span>
                      <span className="text-[10px] text-white/50 font-mono">{activeGameInfo.genre} · {activeGameInfo.version}</span>
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
            {/* 3. 掌机右侧专属区：右按键握把 + 侧插式实体装载卡槽 (Right Bay & Grip) */}
            {/* ============================================================= */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-between gap-3 w-full lg:w-48 shrink-0 py-2 select-none">
              
              {/* 实体右侧按键群 (Face Buttons & Online status) */}
              <div className="flex lg:flex-col items-center justify-around w-full gap-4">
                {/* Online Badge */}
                <div className="hidden lg:flex items-center gap-1 text-[#6F7E70]">
                  <Wifi className="size-3.5" />
                  <span className="font-mono text-[9px] font-bold">ONLINE</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* HELP 帮助按键 (?) */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!isPoweredOn) {
                        setIsPoweredOn(true);
                      } else if (insertedCartridge) {
                        setIsOptionsOpen((prev) => !prev);
                      }
                    }}
                    className={`size-11 rounded-2xl transition-all flex flex-col items-center justify-center gap-0.5 border cursor-pointer active:scale-90 ${
                      isOptionsOpen
                        ? "bg-[#36513B] text-white border-[#7CD090] shadow-[0_0_14px_rgba(124,208,144,0.4)] ring-2 ring-[#7CD090]/40"
                        : "bg-[#26352A] dark:bg-[#0D150F] text-[#7CD090] border-white/15 hover:bg-[#36513B] shadow-md hover:border-[#7CD090]/50"
                    }`}
                    title="帮助指南 (?)"
                  >
                    <span className="font-bold text-sm leading-none">?</span>
                    <span className="font-mono text-[7px] font-bold tracking-tighter">HELP</span>
                  </button>

                  {/* START 启动按键 (A) */}
                  {isPoweredOn && insertedCartridge ? (
                    <button
                      type="button"
                      onClick={() => openGame(activeGameInfo.id)}
                      className="size-11 rounded-full bg-[#26352A] dark:bg-[#0D150F] hover:bg-[#36513B] text-white transition-all flex flex-col items-center justify-center gap-0.5 border border-white/15 shadow-md active:scale-90 cursor-pointer group hover:border-[#7CD090]/50"
                      title="启动游戏 (A)"
                    >
                      <span className="font-black text-xs text-[#7CD090] leading-none group-hover:scale-110 transition-transform">A</span>
                      <span className="font-mono text-[7px] font-bold tracking-tighter text-white/80">START</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={powerOn}
                      className="size-11 rounded-full bg-amber-500 hover:bg-amber-400 text-[#121413] transition-all flex flex-col items-center justify-center gap-0.5 border border-white/20 shadow-[0_0_15px_rgba(245,158,11,0.4)] active:scale-90 cursor-pointer group animate-pulse"
                      title="投币开机"
                    >
                      <Coins className="size-3.5" />
                      <span className="font-mono text-[7px] font-bold tracking-tighter">COIN</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 🎴 掌机右侧实体插卡装载舱 (Right-Side Cartridge Loading Bay & Drag Dropzone) */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOverBay(true);
                }}
                onDragLeave={() => setIsDragOverBay(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOverBay(false);
                  const gameId = e.dataTransfer.getData("text/plain") as GameId;
                  if (gameId && GAMES.some((g) => g.id === gameId)) {
                    insertCartridge(gameId);
                  }
                }}
                className={`relative w-full rounded-2xl p-2.5 sm:p-3 transition-all duration-300 flex flex-col justify-between border-2 ${
                  isDragOverBay
                    ? "bg-[#36513B]/80 border-[#7CD090] shadow-[0_0_24px_rgba(124,208,144,0.6)] ring-4 ring-[#7CD090]/40 scale-105"
                    : insertedCartridge
                    ? "bg-[#18261D] border-[#36513B] shadow-inner"
                    : "bg-[#141B16] border-dashed border-[#7CD090]/40 hover:border-[#7CD090] shadow-inner"
                }`}
              >
                {/* 舱位顶部状态与弹卡键 */}
                <div className="flex items-center justify-between text-[10px] font-mono pb-1.5 border-b border-white/10">
                  <span className="font-bold flex items-center gap-1 text-[#7CD090]">
                    <Sparkles className="size-3" />
                    <span>SIDE BAY</span>
                  </span>
                  {insertedCartridge ? (
                    <button
                      type="button"
                      onClick={ejectCartridge}
                      className="px-1.5 py-0.5 rounded bg-red-900/60 hover:bg-red-700 text-red-200 border border-red-500/40 text-[9px] font-bold transition-all active:scale-90 cursor-pointer"
                      title="弹出卡带 (E)"
                    >
                      ⏏ 弹卡
                    </button>
                  ) : (
                    <span className="text-amber-400 font-bold animate-pulse">待插卡</span>
                  )}
                </div>

                {/* 卡槽核心展示：已插入的卡带 OR 拖入提示 */}
                {insertedCartridge ? (
                  <div className="py-2 px-1 text-center space-y-1 animate-in zoom-in-95 duration-150">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${activeGameInfo.shellColor} border ${activeGameInfo.borderColor} shadow-md`}>
                      <p className="text-xs font-black font-serif text-white truncate drop-shadow-sm">
                        {activeGameInfo.kanji}
                      </p>
                      <p className="text-[10px] font-bold text-white/90 truncate">
                        {activeGameInfo.name}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[8px] font-mono text-amber-300">
                        <span>{activeGameInfo.code}</span>
                        <span className="text-[#7CD090] font-bold">● LOCKED</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center space-y-1.5">
                    <div className="flex justify-center gap-1 opacity-40">
                      {[...Array(6)].map((_, i) => (
                        <span key={i} className="w-1 h-3 bg-amber-400 rounded-xs" />
                      ))}
                    </div>
                    <p className="text-[11px] font-mono font-bold text-amber-300">
                      {isDragOverBay ? "松开即可插卡！" : "拖拽卡片至此插卡"}
                    </p>
                    <p className="text-[9px] font-mono text-white/40">
                      或点击下方卡片
                    </p>
                  </div>
                )}

                <div className="pt-1 text-[8px] font-mono text-center text-white/35">
                  64-BIT EXPANSION BUS
                </div>
              </div>

            </div>

          </div>

          {/* 掌机底部 SELECT / START 实体胶囊按键 */}
          <div className="flex items-center justify-center gap-6 pt-3 select-none">
            {isPoweredOn && insertedCartridge ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsOptionsOpen((prev) => !prev)}
                  className="px-3.5 py-1 rounded-full bg-[#26352A]/15 dark:bg-white/10 hover:bg-[#36513B] hover:text-white transition-all text-[10px] font-mono font-bold text-[#6F7E70] flex items-center gap-1 cursor-pointer"
                >
                  <span>? 帮助指南</span>
                </button>
                <button
                  type="button"
                  onClick={() => openGame(activeGameInfo.id)}
                  className="px-4 py-1 rounded-full bg-[#36513B] text-white hover:bg-[#46654C] transition-all text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <span>(A) 启动游戏 ▶</span>
                </button>
                <button
                  type="button"
                  onClick={ejectCartridge}
                  className="px-3 py-1 rounded-full bg-red-500/10 hover:bg-red-500 hover:text-white transition-all text-[10px] font-mono font-bold text-red-500 flex items-center gap-1 cursor-pointer"
                  title="弹出卡带"
                >
                  <span>⏏ 弹卡 (Eject)</span>
                </button>
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

        {/* ================================================================= */}
        {/* 🎴 掌机下方 5 盒【真实 3D 可拖拽游戏卡片】(Draggable 3D Physical Cards) */}
        {/* ================================================================= */}
        <div className="playground-page-anim space-y-4 pt-4">
          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-[#7A736A] dark:text-[#9EB3A4] px-1 gap-2">
            <span className="font-bold flex items-center gap-2 text-[#36513B] dark:text-[#7CD090]">
              <Sparkles className="size-4" />
              <span className="text-sm">PHYSICAL CARTRIDGES · 实体卡片阵列</span>
            </span>
            <span className="text-[11px] bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-full border border-black/5 dark:border-white/5">
              🖱️ 按住卡片可<strong>直接拖入右侧卡槽</strong> · 亦支持点击快速装载
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {GAMES.map((game) => {
              const isInserted = insertedCartridge === game.id;
              const isDragging = isDraggingId === game.id;
              return (
                <div
                  key={game.id}
                  draggable={true}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", game.id);
                    e.dataTransfer.effectAllowed = "move";
                    setIsDraggingId(game.id);
                    playGameSound("puzzle-move");
                    triggerGameHaptic("soft");
                  }}
                  onDragEnd={() => {
                    setIsDraggingId(null);
                  }}
                  onClick={() => {
                    if (isInserted) {
                      ejectCartridge();
                    } else {
                      insertCartridge(game.id);
                    }
                  }}
                  className={`group relative rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between gap-3.5 cursor-grab active:cursor-grabbing isolate ${
                    isDragging
                      ? "opacity-40 scale-95 border-2 border-dashed border-[#7CD090]"
                      : isInserted
                      ? "bg-[#FAF7F2] dark:bg-[#111A13] border-2 border-[#7CD090] shadow-[inset_0_2px_8px_rgba(0,0,0,0.15)] ring-2 ring-[#7CD090]/30"
                      : "bg-white dark:bg-[#1E2E23] border border-[#26352A]/15 dark:border-white/15 hover:border-[#7CD090] hover:shadow-[0_20px_36px_rgba(54,81,59,0.25)] hover:-translate-y-2 hover:scale-[1.02]"
                  }`}
                  title="按住拖拽至右侧卡槽，或点击快速装载"
                >
                  {/* 顶部防滑肋槽、ROM 编号与拖拽标识 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-3.5 rounded-xs bg-[#26352A]/40 dark:bg-white/30" />
                      <span className="w-1.5 h-3.5 rounded-xs bg-[#26352A]/40 dark:bg-white/30" />
                      <span className="font-mono text-[11px] font-bold text-[#36513B] dark:text-[#7CD090]">
                        ROM 0{game.index}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold transition-all flex items-center gap-1 ${
                        isInserted
                          ? "bg-[#7CD090] text-[#121413] shadow-[0_0_8px_#7CD090]"
                          : "bg-black/5 dark:bg-white/10 text-[#7A736A] dark:text-[#9EB3A4] group-hover:bg-[#7CD090] group-hover:text-[#121413]"
                      }`}
                    >
                      {isInserted ? "● 已装载" : "⠿ 拖拽/点按"}
                    </span>
                  </div>

                  {/* 卡带 3D 实体封面与烫金全息贴纸 */}
                  <div className={`relative h-28 rounded-xl overflow-hidden bg-gradient-to-br ${game.shellColor} p-2.5 flex flex-col justify-between border-2 border-white/20 shadow-md group-hover:shadow-xl transition-all`}>
                    <div className="flex items-center justify-between text-white">
                      <span className="text-[9px] font-mono font-bold tracking-widest text-amber-300">
                        {game.code}
                      </span>
                      <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-black/40 text-white/80">
                        {game.capacity}
                      </span>
                    </div>

                    <div className="text-center space-y-0.5">
                      <p className="font-serif font-black text-base text-white tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {game.kanji}
                      </p>
                      <p className="text-[11px] font-bold text-white/95 truncate">
                        {game.name}
                      </p>
                    </div>

                    {/* 底部全息激光微条 */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 rounded-full opacity-80 shadow-xs" />
                  </div>

                  {/* 卡带底部：金色金手指插脚触点 */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-center gap-1 py-1 px-2 bg-black/15 dark:bg-black/40 rounded-md border border-black/10">
                      {[...Array(10)].map((_, i) => (
                        <span key={i} className="w-1 h-2.5 rounded-xs bg-amber-400/90 group-hover:bg-amber-300 transition-colors shadow-2xs" />
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#7A736A] dark:text-[#9EB3A4] pt-0.5">
                      <span className="truncate">{game.genre}</span>
                      <span className="text-[9px] opacity-75">{game.publisher}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Global Interactive Game Modal */}
      {isMounted && activeModalGame && (
        <GameModal
          activeGame={activeModalGame}
          activeInfo={GAMES.find((g) => g.id === activeModalGame)}
          isOpen={Boolean(activeModalGame)}
          close={closeGame}
        />
      )}

      <Footer />
    </div>
  );
}
