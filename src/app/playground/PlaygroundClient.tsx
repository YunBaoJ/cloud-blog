"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Footer from "@/components/Footer";
import SnakeGame from "@/components/games/SnakeGame";
import Game2048 from "@/components/games/Game2048";
import SlidePuzzle from "@/components/games/SlidePuzzle";
import Gomoku from "@/components/games/Gomoku";
import Xiangqi from "@/components/games/Xiangqi";
import { X, Play } from "lucide-react";

type GameId = "snake" | "2048" | "puzzle" | "gomoku" | "xiangqi";

const GAMES: {
  id: GameId;
  name: string;
  nameEn: string;
  cover: string;
  desc: string;
  tip: string;
  tag: string;
}[] = [
  {
    id: "snake",
    name: "贪吃蛇",
    nameEn: "Snake",
    cover: "/game-snake-v6.jpg",
    desc: "操控蛇身不断成长，别撞上自己的尾巴。",
    tip: "方向键 / WASD · 触摸滑动",
    tag: "经典",
  },
  {
    id: "2048",
    name: "2048",
    nameEn: "Merge",
    cover: "/game-2048.jpg",
    desc: "滑动方块合并相同数字，目标合成 2048。",
    tip: "方向键 / WASD · 触摸滑动",
    tag: "益智",
  },
  {
    id: "puzzle",
    name: "华容道",
    nameEn: "Slide Puzzle",
    cover: "/game-puzzle.jpg",
    desc: "滑动数字方块还原正确顺序，挑战最少步数。",
    tip: "点击相邻方块移动",
    tag: "挑战",
  },
  {
    id: "gomoku",
    name: "五子棋",
    nameEn: "Gomoku",
    cover: "/game-gomoku.jpg",
    desc: "黑白对弈，五子连珠，支持单人 AI 对弈与双人对战。",
    tip: "单人 / 双人模式可选",
    tag: "对弈",
  },
  {
    id: "xiangqi",
    name: "中国象棋",
    nameEn: "Xiangqi AI",
    cover: "/game-xiangqi-v2.jpg",
    desc: "楚河汉界，运筹帷幄，支持单人 AI 博弈与 AI 军师步进。",
    tip: "单人 AI / 步进模式可选",
    tag: "博弈",
  },
];

// ── Game Modal — rendered via portal to document.body ──────────────
function GameModal({
  activeGame,
  activeInfo,
  close,
}: {
  activeGame: GameId;
  activeInfo: (typeof GAMES)[number] | undefined;
  close: () => void;
}) {
  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "rgba(45,43,44,0.55)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "720px",
          maxHeight: "90dvh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
          background: "var(--modal-bg, #FAF7F2)",
          animation: "modal-in 0.18s ease",
        }}
        className="bg-[#FAF7F2] dark:bg-[#1A2A1E]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D2B2C]/8 dark:border-white/8 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#2D2B2C] dark:text-[#F0F5F1]">
              {activeInfo?.name}
            </span>
            <span className="text-xs font-mono text-[#B0A99F] dark:text-[#4A6B55]">
              {activeInfo?.nameEn}
            </span>
          </div>
          <button
            onClick={close}
            className="p-2 rounded-xl text-[#7A736A] hover:text-[#2D2B2C] dark:hover:text-[#F0F5F1] hover:bg-[#2D2B2C]/6 dark:hover:bg-white/8 transition-all"
            aria-label="关闭"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Game content */}
        <div className="p-4 sm:p-5 overflow-y-auto" key={activeGame}>
          {activeGame === "snake"   && <SnakeGame />}
          {activeGame === "2048"    && <Game2048 />}
          {activeGame === "puzzle"  && <SlidePuzzle />}
          {activeGame === "gomoku"  && <Gomoku />}
          {activeGame === "xiangqi" && <Xiangqi />}
        </div>
      </div>

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}

// ── Main page ──────────────────────────────────────────────────────
export default function PlaygroundClient() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const close = useCallback(() => setActiveGame(null), []);

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = activeGame ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeGame]);

  const activeInfo = GAMES.find((g) => g.id === activeGame);

  return (
    <>
      <main className="min-h-screen bg-[#FAF7F2] dark:bg-[#142219] text-[#2D2B2C] dark:text-[#F0F5F1]">

        {/* Header */}
        <section className="pt-32 pb-12 px-6 sm:px-12 lg:px-20 border-b border-[#2D2B2C]/8 dark:border-white/8 bg-gradient-to-b from-[#E2EBE4]/30 to-transparent">
          <div className="max-w-5xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              摸鱼游乐场
            </h1>
            <p className="text-sm text-[#7A736A] dark:text-[#9EB3A4]">
              选择一款游戏，点击 Play 开始。
            </p>
          </div>
        </section>

        {/* Game Cards Grid */}
        <section className="py-14 px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {GAMES.map((game) => (
              <div
                key={game.id}
                className="group bg-white dark:bg-[#1E2721]/70 rounded-2xl overflow-hidden border border-[#2D2B2C]/6 dark:border-white/8 shadow-[0_2px_12px_rgba(45,43,44,0.04)] hover:shadow-[0_8px_28px_rgba(45,43,44,0.10)] transition-all duration-300 hover:-translate-y-1"
              >
                {/* Cover */}
                <div className="relative aspect-square overflow-hidden bg-[#F0EDE6] dark:bg-[#23382C]">
                  <Image
                    src={game.cover}
                    alt={game.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/85 dark:bg-[#142219]/85 backdrop-blur-sm text-[#36513B] dark:text-[#7CD090]">
                    {game.tag}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3">
                  <div>
                    <h2 className="text-sm font-bold text-[#2D2B2C] dark:text-[#F0F5F1]">
                      {game.name}
                    </h2>
                    <p className="text-[11px] text-[#7A736A] dark:text-[#9EB3A4] leading-relaxed mt-0.5">
                      {game.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveGame(game.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#36513B] dark:bg-[#2A4D32] text-white text-xs font-bold hover:bg-[#283E2C] active:scale-95 transition-all"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Play
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </main>

      {/* Portal modal — mounted outside <main>, directly on document.body */}
      {mounted && activeGame && (
        <GameModal
          activeGame={activeGame}
          activeInfo={activeInfo}
          close={close}
        />
      )}
    </>
  );
}
