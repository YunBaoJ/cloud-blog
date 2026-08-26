"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Footer from "@/components/Footer";
import SnakeGame from "@/components/games/SnakeGame";
import Game2048 from "@/components/games/Game2048";
import SlidePuzzle from "@/components/games/SlidePuzzle";
import Gomoku from "@/components/games/Gomoku";
import Xiangqi from "@/components/games/Xiangqi";
import {
  Battery,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Coins,
  HelpCircle,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Trophy,
  Wifi,
  X,
} from "lucide-react";
import { useMounted } from "@/lib/useMounted";
import GameModalControls from "@/components/games/GameModalControls";
import { GameActivityProvider } from "@/components/games/GameActivityContext";
import { playGameSound, triggerGameHaptic } from "@/lib/gameSounds";

export type GameId = "xiangqi" | "gomoku" | "snake" | "2048" | "puzzle";

export interface GameData {
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

export const PLAYGROUND_GAMES: GameData[] = [
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
  return PLAYGROUND_GAMES.some((game) => game.id === id)
    ? (id as GameId)
    : null;
}

function GameModal({
  activeGame,
  activeInfo,
  isOpen,
  close,
}: {
  activeGame: GameId;
  activeInfo: (typeof PLAYGROUND_GAMES)[number] | undefined;
  isOpen: boolean;
  close: () => void;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const invoker =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const raf = requestAnimationFrame(() => closeButtonRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const nodes = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(raf);
      invoker?.focus();
    };
  }, [close, isOpen]);

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md ${isFullscreen ? "p-0" : "p-3 sm:p-6"}`}
      style={{ display: isOpen ? "flex" : "none" }}
      role="dialog"
      aria-modal="true"
      aria-label={activeInfo?.name ?? "游戏窗口"}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        className={`relative flex flex-col overflow-hidden border border-[#36513B]/20 dark:border-white/15 bg-[#FAF7F2] dark:bg-[#16231A] shadow-[0_28px_90px_rgba(0,0,0,0.55)] ${isFullscreen ? "h-full w-full rounded-none" : "max-h-[94dvh] w-full max-w-3xl rounded-3xl"}`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#36513B]/10 dark:border-white/10 bg-white/85 dark:bg-[#1A261D]/90 px-4 py-3.5 backdrop-blur-md sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-[#26352A] dark:text-[#F0F5F1]">
              {activeInfo?.name}
            </p>
            <p className="text-xs text-[#6F7E70] dark:text-[#9EB3A4]">
              {activeInfo?.nameEn}
            </p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <GameModalControls />
            <button
              type="button"
              onClick={() => setIsFullscreen((value) => !value)}
              className="rounded-xl p-2 text-[#6F7E70] hover:bg-black/5 hover:text-[#26352A] dark:text-[#9EB3A4] dark:hover:bg-white/10 dark:hover:text-white transition-colors"
              aria-label={isFullscreen ? "退出全屏" : "全屏沉浸"}
            >
              {isFullscreen ? (
                <Minimize2 className="size-4" />
              ) : (
                <Maximize2 className="size-4" />
              )}
            </button>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              className="rounded-xl p-2 text-[#6F7E70] hover:bg-black/5 hover:text-[#26352A] dark:text-[#9EB3A4] dark:hover:bg-white/10 dark:hover:text-white transition-colors"
              aria-label="关闭"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
        <GameActivityProvider active={isOpen}>
          <div
            className="min-w-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-6"
            key={activeGame}
          >
            {activeGame === "snake" && <SnakeGame />}
            {activeGame === "2048" && <Game2048 />}
            {activeGame === "puzzle" && <SlidePuzzle />}
            {activeGame === "gomoku" && <Gomoku />}
            {activeGame === "xiangqi" && <Xiangqi />}
          </div>
        </GameActivityProvider>
      </div>
    </div>,
    document.body,
  );
}

export default function PlaygroundClient() {
  const isMounted = useMounted();
  const rawHashGame = useSyncExternalStore(
    subscribeToHash,
    getGameFromHash,
    () => null,
  );

  const [activeModalGame, setActiveModalGame] = useState<GameId | null>(null);
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("23:59");
  const [credits] = useState(2);
  const hashEntryOursRef = useRef(false);

  const activeGame = PLAYGROUND_GAMES[selectedIdx];

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

  const openGame = useCallback((gameId: GameId) => {
    playGameSound("puzzle-move");
    triggerGameHaptic("medium");
    setActiveModalGame(gameId);
    window.location.hash = gameId;
    hashEntryOursRef.current = true;
  }, []);

  const powerOn = useCallback(() => {
    playGameSound("2048-win");
    triggerGameHaptic("victory");
    setIsPoweredOn(true);
  }, []);

  const prevGame = useCallback(() => {
    playGameSound("puzzle-move");
    triggerGameHaptic("soft");
    if (!isPoweredOn) {
      setIsPoweredOn(true);
      return;
    }
    setSelectedIdx((prev) =>
      prev === 0 ? PLAYGROUND_GAMES.length - 1 : prev - 1,
    );
  }, [isPoweredOn]);

  const nextGame = useCallback(() => {
    playGameSound("puzzle-move");
    triggerGameHaptic("soft");
    if (!isPoweredOn) {
      setIsPoweredOn(true);
      return;
    }
    setSelectedIdx((prev) =>
      prev === PLAYGROUND_GAMES.length - 1 ? 0 : prev + 1,
    );
  }, [isPoweredOn]);

  const launchCurrentGame = useCallback(() => {
    openGame(activeGame.id);
  }, [activeGame.id, openGame]);

  const closeGame = useCallback(() => {
    if (window.location.hash && hashEntryOursRef.current) {
      window.history.back();
      return;
    }
    setActiveModalGame(null);
    if (window.location.hash)
      window.history.pushState(null, "", window.location.pathname);
  }, []);

  // 检查是否从主页点击 START 跳转进入（?start=true）或带有特定游戏 Hash
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("start") === "true") {
        setIsPoweredOn(true);
      }
    }
  }, []);

  const [previousHash, setPreviousHash] = useState(rawHashGame);
  if (rawHashGame !== previousHash) {
    setPreviousHash(rawHashGame);
    if (rawHashGame) {
      setActiveModalGame(rawHashGame);
      const foundIdx = PLAYGROUND_GAMES.findIndex((g) => g.id === rawHashGame);
      if (foundIdx !== -1) setSelectedIdx(foundIdx);
      setIsPoweredOn(true);
    } else if (activeModalGame) setActiveModalGame(null);
  }

  useEffect(() => {
    if (!rawHashGame) hashEntryOursRef.current = false;
  }, [rawHashGame]);

  // 🎮 键盘快捷键监听
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        activeModalGame ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        (event.target instanceof HTMLElement &&
          event.target.closest(
            "input, textarea, select, button, a[href], [role='button'], [contenteditable]",
          ))
      )
        return;

      if (!isPoweredOn) {
        if (
          event.key === "Enter" ||
          event.key === " " ||
          event.key === "s" ||
          event.key === "S"
        ) {
          event.preventDefault();
          powerOn();
        }
        return;
      }

      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowLeft" ||
        event.key === "w" ||
        event.key === "a" ||
        event.key === "W" ||
        event.key === "A"
      ) {
        event.preventDefault();
        prevGame();
      } else if (
        event.key === "ArrowDown" ||
        event.key === "ArrowRight" ||
        event.key === "s" ||
        event.key === "d" ||
        event.key === "S" ||
        event.key === "D"
      ) {
        event.preventDefault();
        nextGame();
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        launchCurrentGame();
      } else if (event.key === "Escape") {
        setIsOptionsOpen(false);
        setIsPoweredOn(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    activeModalGame,
    isPoweredOn,
    launchCurrentGame,
    nextGame,
    powerOn,
    prevGame,
  ]);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-transparent text-[var(--foreground)]">
      <main className="flex-1">
        {/* 顶部标题区（与随笔笔记、作品画廊、文章归档等路由完全统一） */}
        <section className="px-5 pb-9 pt-28 sm:px-8 lg:px-12 lg:pt-32">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl border-b border-[var(--border-line-color)] pb-10">
              <h1 className="inner-page-title">
                <span className="inner-page-title__lead">灵感</span><span className="inner-page-title__rest">掌机</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base sm:leading-7">
                复古街机投币待机与掌机卡带载入，在沉思与编码之余唤醒纯粹的投币心流。
              </p>
            </div>
          </div>
        </section>

        {/* 🎮 经典主页掌机硬件机身 (Home Classic Handheld Frame) */}
        <section className="px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
          <div className="relative mx-auto w-full max-w-6xl pt-6 sm:pt-8">
          
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
            {/* 左侧握把区：一体化实体十字键 (D-PAD) + 呼吸灯 (Left Grip) */}
            {/* ============================================================= */}
            <div className="hidden md:flex flex-col items-center justify-between h-[360px] w-24 shrink-0 py-4 select-none">
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

              {/* 实体掌机一体化十字方向键 (Classic Console Seamless Cross D-Pad) */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative size-20 sm:size-22 rounded-full bg-[#18231B] border border-white/12 shadow-[inset_0_3px_6px_rgba(0,0,0,0.75),0_6px_14px_rgba(0,0,0,0.35)] flex items-center justify-center">
                  {/* 十字交叉背部实体外壳 */}
                  <div className="absolute h-16 w-5.5 rounded-lg bg-gradient-to-b from-[#2B3E30] via-[#233227] to-[#1C281F] border border-white/15 shadow-sm pointer-events-none" />
                  <div className="absolute w-16 h-5.5 rounded-lg bg-gradient-to-r from-[#2B3E30] via-[#233227] to-[#1C281F] border border-white/15 shadow-sm pointer-events-none" />

                  {/* 中轴凹陷指托 */}
                  <div className="absolute size-5 rounded-full bg-[#18231B] shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)] z-10 pointer-events-none flex items-center justify-center">
                    <div className="size-2 rounded-full bg-black/40" />
                  </div>

                  {/* 4 个方向实体触发区域 */}
                  {/* 上键 -> 上选择 */}
                  <button
                    type="button"
                    onClick={prevGame}
                    className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-6 flex items-center justify-center text-white/90 hover:text-[#7CD090] active:scale-90 transition-all cursor-pointer z-20"
                    title="向上选择游戏 (上 / W)"
                    aria-label="向上选择游戏"
                  >
                    <ChevronUp className="size-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                  </button>

                  {/* 下键 -> 下选择 */}
                  <button
                    type="button"
                    onClick={nextGame}
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-6 flex items-center justify-center text-white/90 hover:text-[#7CD090] active:scale-90 transition-all cursor-pointer z-20"
                    title="向下选择游戏 (下 / S)"
                    aria-label="向下选择游戏"
                  >
                    <ChevronDown className="size-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                  </button>

                  {/* 左键 -> 上选择 */}
                  <button
                    type="button"
                    onClick={prevGame}
                    className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-6 flex items-center justify-center text-white/90 hover:text-[#7CD090] active:scale-90 transition-all cursor-pointer z-20"
                    title="向左选择游戏 (左 / A)"
                    aria-label="向左选择游戏"
                  >
                    <ChevronLeft className="size-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                  </button>

                  {/* 右键 -> 下选择 */}
                  <button
                    type="button"
                    onClick={nextGame}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-6 flex items-center justify-center text-white/90 hover:text-[#7CD090] active:scale-90 transition-all cursor-pointer z-20"
                    title="向右选择游戏 (右 / D)"
                    aria-label="向右选择游戏"
                  >
                    <ChevronRight className="size-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                  </button>
                </div>
                <span className="font-mono text-[9px] text-[#7A736A] dark:text-[#9EB3A4] tracking-wider font-semibold">
                  D-PAD
                </span>
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
            <div className="relative flex-1 w-full min-h-[460px] sm:min-h-[500px] md:min-h-[520px] rounded-[1.8rem] sm:rounded-[2.4rem] bg-[#0A0D0B] p-4 sm:p-6 sm:px-7 shadow-[inset_0_4px_32px_rgba(0,0,0,0.98)] border border-white/10 overflow-hidden flex flex-col justify-between select-none">
              
              {!isPoweredOn ? (
                /* ========================================================= */
                /* 🪙 状态 1：街机待机/投币演示画面 (Attract Mode / Insert Coin) */
                /* ========================================================= */
                <div className="relative z-10 flex-1 flex flex-col justify-between py-3 text-center animate-in fade-in duration-300">
                  
                  {/* Arcade Top Score Bar */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/50 border-b border-white/10 pb-2.5 px-1">
                    <span className="text-[#7CD090] font-bold">1P: 002480</span>
                    <span className="text-amber-400 font-bold tracking-wider">HIGH SCORE: 999990</span>
                    <span className="text-white/70">CREDIT: 0{credits}</span>
                  </div>

                  {/* Arcade Center Neon Title & Insert Coin Prompt */}
                  <div className="space-y-5 py-8">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-mono tracking-[0.3em] text-[#7CD090] uppercase font-bold">
                        ★ CLOUD ARCADE SYSTEM 1998 ★
                      </p>
                      <h3 className="text-3xl sm:text-5xl font-black text-white tracking-wider font-mono drop-shadow-[0_0_24px_rgba(124,208,144,0.4)]">
                        INSERT COIN
                      </h3>
                      <p className="text-xs font-mono text-white/60 pt-1">
                        请投币或按下下方按钮开机
                      </p>
                    </div>

                    {/* Blinking Push Start / Insert Coin */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={powerOn}
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-[#121413] text-xs font-black tracking-widest uppercase transition-all shadow-[0_0_24px_rgba(251,191,36,0.5)] animate-pulse hover:scale-105 active:scale-95 cursor-pointer"
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
                /* 🕹️ 状态 2：游戏机正式运行与卡带选择界面 (Console Running OS) */
                /* ========================================================= */
                <div className="relative z-10 flex-1 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
                  
                  {/* 1. 真实主机顶部状态栏 */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/70 border-b border-white/10 pb-2.5 px-1">
                    <div className="flex items-center gap-2">
                      <div className="size-4.5 rounded-full bg-[#36513B] text-[#7CD090] flex items-center justify-center font-bold text-[9px] border border-[#7CD090]/40">
                        K
                      </div>
                      <span className="font-bold text-white text-[11px]">Cloud OS · 游乐场</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold tracking-wider text-white text-xs">{currentTime}</span>
                      <Wifi className="size-3.5 text-[#7CD090]" />
                      <div className="flex items-center gap-1 text-[#7CD090]">
                        <Battery className="size-3.5" />
                        <span className="text-[10px] font-bold">100%</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. 【上半部分】：左边游戏列表（宽敞舒适） + 右边游戏大封面 */}
                  <div className="grid flex-1 gap-5 sm:gap-6 py-4 md:grid-cols-[1fr_1.25fr] items-stretch min-h-0">

                    {/* 📋 左侧：游戏列表（卡片高度舒适、字号清晰） */}
                    <div className="flex flex-col justify-start space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#7CD090] uppercase px-1 pb-1">
                        <span>SELECT GAME / 游戏库</span>
                        <span className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">0{selectedIdx + 1} / 05</span>
                      </div>

                      <nav aria-label="游戏菜单列表" className="space-y-1.5">
                        {PLAYGROUND_GAMES.map((game, idx) => {
                          const isSelected = selectedIdx === idx;
                          return (
                            <button
                              key={game.id}
                              type="button"
                              onClick={() => {
                                playGameSound("puzzle-move");
                                triggerGameHaptic("soft");
                                setSelectedIdx(idx);
                              }}
                              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs sm:text-sm transition-all duration-200 cursor-pointer border ${
                                isSelected
                                  ? "bg-[#36513B] text-white border-[#7CD090] shadow-[0_0_18px_rgba(124,208,144,0.35)] ring-1 ring-[#7CD090]/50 translate-x-1.5 font-bold"
                                  : "bg-white/[0.04] text-white/70 border-white/6 hover:bg-white/[0.08] hover:text-white"
                              }`}
                            >
                              <span className="flex items-center gap-2.5">
                                <span
                                  className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    isSelected
                                      ? "bg-[#1B271F] text-[#7CD090]"
                                      : "bg-white/10 text-white/50"
                                  }`}
                                >
                                  {game.index}
                                </span>
                                <span className="truncate">{game.name}</span>
                              </span>
                              {isSelected && (
                                <span className="font-mono text-[9px] font-bold text-[#7CD090] flex items-center gap-1">
                                  <span className="size-1.5 rounded-full bg-[#7CD090] animate-pulse" />
                                  <span>READY</span>
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </nav>
                    </div>

                    {/* 🖼️ 右侧：游戏大封面海报 (高清晰大图展示) */}
                    <div className="relative min-h-[220px] sm:min-h-[260px] overflow-hidden rounded-2xl border border-white/20 bg-black/80 shadow-[0_12px_36px_rgba(0,0,0,0.7)] group">
                      <Image
                        key={activeGame.id}
                        src={activeGame.cover}
                        alt={activeGame.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />

                      {/* 封面内嵌标题与代码标 */}
                      <div className="absolute inset-x-4 bottom-3.5 space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-mono font-bold text-[#7CD090] border border-[#7CD090]/40">
                            ROM 0{selectedIdx + 1}
                          </span>
                          <span className="text-[10px] font-mono text-white/70">
                            {activeGame.version}
                          </span>
                        </div>
                        <p className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md">
                          {activeGame.name}
                        </p>
                        <p className="text-xs text-white/70 font-mono">
                          {activeGame.nameEn}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* 3. 【下半部分】：精炼介绍区（舒展大气） */}
                  <div className="border-t border-white/10 pt-3 pb-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
                      <span className="font-bold text-white flex items-center gap-2">
                        <span className="size-2 rounded-full bg-[#7CD090]" />
                        <span>{activeGame.genre}</span>
                      </span>
                      <span className="text-[11px] text-white/60 font-mono">
                        {activeGame.publisher} · {activeGame.players}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-xs text-white/80">
                      <span className="truncate text-white/70">🎮 操作指引：{activeGame.tip}</span>
                      <button
                        type="button"
                        onClick={launchCurrentGame}
                        className="shrink-0 text-xs font-mono font-bold text-[#121413] bg-[#7CD090] hover:bg-[#8de8a3] px-3.5 py-1 rounded-full shadow-[0_0_12px_rgba(124,208,144,0.4)] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                      >
                        <Play className="size-3 fill-current" />
                        <span>(A) 启动游戏</span>
                      </button>
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
                    <button
                      type="button"
                      onClick={() => setIsOptionsOpen(false)}
                      className="text-[10px] font-mono text-white/50 hover:text-white cursor-pointer"
                    >
                      按右侧 [ ? ] 键关闭
                    </button>
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
                      powerOn();
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
                  <button
                    type="button"
                    onClick={launchCurrentGame}
                    className="size-12 rounded-full bg-[#26352A] dark:bg-[#0D150F] hover:bg-[#36513B] text-white transition-all flex flex-col items-center justify-center gap-0.5 border border-white/15 shadow-md active:scale-90 cursor-pointer group hover:border-[#7CD090]/50"
                    title="启动游戏 (A)"
                    aria-label="启动游戏"
                  >
                    <span className="font-black text-sm text-[#7CD090] leading-none group-hover:scale-110 transition-transform">A</span>
                    <span className="font-mono text-[8px] font-bold tracking-tighter text-white/80">START</span>
                  </button>
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
          <div className="flex items-center justify-center gap-6 pt-5 select-none">
            {isPoweredOn ? (
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
                  onClick={launchCurrentGame}
                  className="px-4 py-1 rounded-full bg-[#36513B] text-white hover:bg-[#46654C] transition-all text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <span>(A) 启动游戏 ▶</span>
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
      </section>
    </main>

      {/* 游戏全屏/弹窗运行环境 */}
      {isMounted && activeModalGame && (
        <GameModal
          activeGame={activeModalGame}
          activeInfo={PLAYGROUND_GAMES.find((game) => game.id === activeModalGame)}
          isOpen={Boolean(activeModalGame)}
          close={closeGame}
        />
      )}

      <Footer />
    </div>
  );
}
