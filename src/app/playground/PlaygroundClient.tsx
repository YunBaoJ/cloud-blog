"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Footer from "@/components/Footer";
import SnakeGame from "@/components/games/SnakeGame";
import Game2048 from "@/components/games/Game2048";
import SlidePuzzle from "@/components/games/SlidePuzzle";
import Gomoku from "@/components/games/Gomoku";
import Xiangqi from "@/components/games/Xiangqi";
import { X, Play, Gamepad2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

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
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useGSAP(() => {
    gsap.from(".game-card-anim", {
      y: 25,
      opacity: 0,
      scale: 0.96,
      duration: 0.5,
      stagger: 0.08,
      ease: "power2.out",
      clearProps: "all",
    });
  }, { scope: gridRef });

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

        {/* Header Section */}
        <section className="pt-32 pb-14 px-6 sm:px-12 lg:px-20 border-b border-[#2D2B2C]/8 dark:border-white/8 bg-gradient-to-b from-[#E2EBE4]/35 via-[#FAF7F2] to-[#FAF7F2] dark:from-[#23382C]/30 dark:to-transparent">
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E2EBE4] dark:bg-[#23382C] text-[#36513B] dark:text-[#7CD090] text-xs font-mono font-semibold border border-[#36513B]/15 shadow-2xs">
              <Gamepad2 className="w-4 h-4" />
              <span>复古街机 &amp; 经典小游戏实验室</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2B2C] dark:text-[#F0F5F1]">
              摸鱼游乐场 (Playground Arcade)
            </h1>
            <p className="text-base sm:text-lg text-[#7A736A] dark:text-[#9EB3A4] max-w-2xl font-normal leading-relaxed">
              工作余暇的放松驿站。提供贪吃蛇、2048、数字华容道、五子棋 AI 与中国象棋 AI 等 5 款精巧小游戏，支持键盘与移动端触摸操控。
            </p>
          </div>
        </section>

        {/* Game Cards Grid — Spacious 3-column Layout */}
        <section ref={gridRef} className="py-16 pb-24 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-9">
            {GAMES.map((game) => (
              <div
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className="game-card-anim group relative bg-white dark:bg-[#1E2721]/90 rounded-3xl overflow-hidden border border-[#2D2B2C]/8 dark:border-white/10 shadow-[0_8px_30px_rgba(45,43,44,0.05)] hover:shadow-[0_20px_45px_rgba(45,43,44,0.14)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between cursor-pointer"
              >
                {/* Cover Image Box — 16:10 Wide Aspect Ratio */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#F0EDE6] dark:bg-[#23382C] border-b border-[#2D2B2C]/5 dark:border-white/5">
                  <Image
                    src={game.cover}
                    alt={game.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Dark Overlay with Play Icon on Hover */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-3xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 dark:bg-[#36513B] text-[#36513B] dark:text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                  </div>

                  {/* Tag Pill */}
                  <span className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white font-mono border border-white/20">
                    {game.tag}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-[#2D2B2C] dark:text-[#F0F5F1] group-hover:text-[#36513B] dark:group-hover:text-[#7CD090] transition-colors">
                        {game.name}
                      </h2>
                      <span className="text-xs font-mono text-[#7A736A] dark:text-[#9EB3A4] font-semibold">
                        {game.nameEn}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5A5551] dark:text-[#9EB3A4] leading-relaxed font-normal">
                      {game.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#2D2B2C]/6 dark:border-white/8 flex items-center justify-between text-xs text-[#7A736A] dark:text-[#9EB3A4]">
                    <span className="font-mono text-[11px] bg-[#FAF7F2] dark:bg-[#142219] px-2.5 py-1 rounded-lg border border-[#2D2B2C]/5 dark:border-white/5">
                      🎮 {game.tip}
                    </span>

                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#36513B] dark:bg-[#2E4D36] text-white text-xs font-bold hover:bg-[#283E2C] dark:hover:bg-[#385E42] active:scale-95 transition-all shadow-2xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>开始游戏</span>
                    </button>
                  </div>
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
