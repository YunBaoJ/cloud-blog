"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, RotateCcw } from "lucide-react";
import { playGameSound } from "@/lib/gameSounds";
import { usePersistentNumber } from "@/lib/usePersistentNumber";
import { useGameActivity } from "@/components/games/GameActivityContext";
import { recordGameResult } from "@/lib/gameHistory";

type GameState = "idle" | "playing" | "paused" | "dead";
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Difficulty = "easy" | "normal" | "hard";

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const MIN_BOOST_SPEED = 25; // 长按加速的最高速度上限 (25ms/步)

// Difficulty speed config (ms per step) - 拉大三种难度的基础速度差距
const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { initialSpeed: number; minSpeed: number; canWrap: boolean; label: string }
> = {
  easy: { initialSpeed: 180, minSpeed: 100, canWrap: true, label: "简单 (慢速+可穿墙)" },
  normal: { initialSpeed: 100, minSpeed: 55, canWrap: false, label: "普通 (中速+禁穿墙)" },
  hard: { initialSpeed: 50, minSpeed: 30, canWrap: false, label: "困难 (极速+禁穿墙)" },
};

const INITIAL_SNAKE: Point[] = [{ x: 10, y: 10 }];

export default function SnakeGame() {
  const isGameActive = useGameActivity();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [gameState, setGameState] = useState<GameState>("idle");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = usePersistentNumber("snakeHighScore");

  const snakeRef = useRef<Point[]>([...INITIAL_SNAKE]);
  const directionRef = useRef<Direction>("RIGHT");
  const nextDirectionRef = useRef<Direction>("RIGHT");
  const foodRef = useRef<Point>({ x: 18, y: 10 });
  const speedRef = useRef(DIFFICULTY_CONFIG.normal.initialSpeed);
  const isAcceleratingRef = useRef(false); // 是否处于长按加速状态
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const canvasSizeRef = useRef({ width: 0, height: 400 });
  const gameStepRef = useRef<() => void>(() => {});

  // Touch control reference
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const updateHighScore = useCallback(
    (newScore: number) => {
      if (newScore > highScore) {
        setHighScore(newScore);
      }
    },
    [highScore, setHighScore]
  );

  const generateFood = useCallback((snake: Point[], width: number, height: number): Point => {
    const cols = Math.floor(width / GRID_SIZE);
    const rows = Math.floor(height / GRID_SIZE);
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
      };
      isOccupied = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  // Canvas Drawing
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvasSizeRef.current;

    // 1. Background
    ctx.fillStyle = "#FAF6EE";
    ctx.fillRect(0, 0, width, height);

    // 2. Clear Crisp Grid Background
    ctx.save();
    ctx.strokeStyle = "rgba(45, 43, 44, 0.06)";
    ctx.lineWidth = 1;

    const cols = Math.floor(width / GRID_SIZE);
    const rows = Math.floor(height / GRID_SIZE);

    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * GRID_SIZE, 0);
      ctx.lineTo(c * GRID_SIZE, height);
      ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * GRID_SIZE);
      ctx.lineTo(width, r * GRID_SIZE);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Draw Food
    const foodX = foodRef.current.x * GRID_SIZE + GRID_SIZE / 2;
    const foodY = foodRef.current.y * GRID_SIZE + GRID_SIZE / 2;
    ctx.save();
    ctx.fillStyle = "#B84A39";
    ctx.shadowColor = "rgba(184, 74, 57, 0.3)";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(foodX, foodY, GRID_SIZE / 2 - 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

    // 4. Draw Snake
    const snake = snakeRef.current;
    if (snake.length > 0) {
      ctx.save();

      for (let i = snake.length - 1; i >= 0; i--) {
        const seg = snake[i];
        const x = seg.x * GRID_SIZE + 1.5;
        const y = seg.y * GRID_SIZE + 1.5;
        const size = GRID_SIZE - 3;

        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(x, y, size, size, i === 0 ? 5 : 3);
        } else {
          ctx.rect(x, y, size, size);
        }

        ctx.fillStyle = i === 0 ? "#34543C" : "#36513B";
        ctx.fill();
        ctx.strokeStyle = "#23382C";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw Snake Eyes
      const head = snake[0];
      const hx = head.x * GRID_SIZE;
      const hy = head.y * GRID_SIZE;
      const dir = directionRef.current;

      let e1 = { x: hx, y: hy },
        e2 = { x: hx, y: hy };
      if (dir === "RIGHT") {
        e1 = { x: hx + GRID_SIZE - 5, y: hy + 4 };
        e2 = { x: hx + GRID_SIZE - 5, y: hy + GRID_SIZE - 7 };
      } else if (dir === "LEFT") {
        e1 = { x: hx + 4, y: hy + 4 };
        e2 = { x: hx + 4, y: hy + GRID_SIZE - 7 };
      } else if (dir === "UP") {
        e1 = { x: hx + 4, y: hy + 4 };
        e2 = { x: hx + GRID_SIZE - 7, y: hy + 4 };
      } else if (dir === "DOWN") {
        e1 = { x: hx + 4, y: hy + GRID_SIZE - 5 };
        e2 = { x: hx + GRID_SIZE - 7, y: hy + GRID_SIZE - 5 };
      }

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(e1.x, e1.y, 3, 3);
      ctx.fillRect(e2.x, e2.y, 3, 3);

      ctx.fillStyle = "#111F14";
      ctx.fillRect(e1.x + 0.5, e1.y + 0.5, 1.5, 1.5);
      ctx.fillRect(e2.x + 0.5, e2.y + 0.5, 1.5, 1.5);

      ctx.restore();
    }

  }, []);

  const gameOver = useCallback(() => {
    setGameState("dead");
    isAcceleratingRef.current = false;
    playGameSound("snake-crash");
    updateHighScore(score);
    recordGameResult("snake", "贪吃蛇", `${score} 分 · ${DIFFICULTY_CONFIG[difficulty].label.split(" ")[0]}`);
  }, [difficulty, score, updateHighScore]);

  const gameStep = useCallback(() => {
    if (gameState !== "playing" || !isGameActive) return;

    directionRef.current = nextDirectionRef.current;
    const head = snakeRef.current[0];
    const newHead = { ...head };

    switch (directionRef.current) {
      case "UP":
        newHead.y -= 1;
        break;
      case "DOWN":
        newHead.y += 1;
        break;
      case "LEFT":
        newHead.x -= 1;
        break;
      case "RIGHT":
        newHead.x += 1;
        break;
    }

    const { width, height } = canvasSizeRef.current;
    const cols = Math.floor(width / GRID_SIZE);
    const rows = Math.floor(height / GRID_SIZE);

    const config = DIFFICULTY_CONFIG[difficulty];

    // Easy mode wall wrapping vs Normal/Hard wall collision
    if (config.canWrap) {
      newHead.x = (newHead.x + cols) % cols;
      newHead.y = (newHead.y + rows) % rows;
    } else {
      if (newHead.x < 0 || newHead.x >= cols || newHead.y < 0 || newHead.y >= rows) {
        gameOver();
        return;
      }
    }

    // Self collision
    if (snakeRef.current.some((s) => s.x === newHead.x && s.y === newHead.y)) {
      gameOver();
      return;
    }

    const newSnake = [newHead, ...snakeRef.current];

    // Food collision
    if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
      setScore((s) => s + 1);
      playGameSound("snake-eat");
      speedRef.current = Math.max(config.minSpeed, speedRef.current - 1.5);
      foodRef.current = generateFood(newSnake, width, height);
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    draw();

    // 长按方向键加速计算：如长按则步长缩减为 35%，但最高速度受 MIN_BOOST_SPEED (25ms) 保护
    const currentBaseSpeed = speedRef.current;
    const nextInterval = isAcceleratingRef.current
      ? Math.max(MIN_BOOST_SPEED, Math.floor(currentBaseSpeed * 0.35))
      : currentBaseSpeed;

    gameLoopRef.current = setTimeout(() => gameStepRef.current(), nextInterval);
  }, [gameState, difficulty, gameOver, draw, generateFood, isGameActive]);

  useEffect(() => {
    gameStepRef.current = gameStep;
  }, [gameStep]);

  useEffect(() => {
    if (gameState === "playing" && isGameActive) {
      const currentBaseSpeed = speedRef.current;
      const nextInterval = isAcceleratingRef.current
        ? Math.max(MIN_BOOST_SPEED, Math.floor(currentBaseSpeed * 0.35))
        : currentBaseSpeed;
      gameLoopRef.current = setTimeout(() => gameStepRef.current(), nextInterval);
    }
    return () => {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    };
  }, [gameState, gameStep, isGameActive]);

  // Start / Restart Game with specific difficulty
  const startNewGameWithDifficulty = useCallback(
    (targetDiff: Difficulty) => {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
        gameLoopRef.current = null;
      }

      setDifficulty(targetDiff);

      const { width, height } = canvasSizeRef.current;
      const midX = Math.floor((width || 400) / GRID_SIZE / 2);
      const midY = Math.floor((height || 400) / GRID_SIZE / 2);

      snakeRef.current = [{ x: midX, y: midY }];
      directionRef.current = "RIGHT";
      nextDirectionRef.current = "RIGHT";
      setScore(0);
      speedRef.current = DIFFICULTY_CONFIG[targetDiff].initialSpeed;
      isAcceleratingRef.current = false;

      foodRef.current = generateFood(snakeRef.current, width || 400, height || 400);
      setGameState("playing");
    },
    [generateFood]
  );

  // Resize Observer
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === containerRef.current) {
          const { width } = entry.contentRect;
          const canvasWidth = Math.floor(width / GRID_SIZE) * GRID_SIZE;
          if (canvasRef.current) {
            canvasRef.current.width = canvasWidth;
            canvasRef.current.height = 400;
            canvasSizeRef.current = { width: canvasWidth, height: 400 };
            draw();
          }
        }
      }
    });

    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [draw]);

  // ⌨️ Keyboard Events: Turn & Hold Key Boost
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }

      if (gameState !== "playing" || !isGameActive) return;

      // 开启长按加速
      isAcceleratingRef.current = true;

      const current = directionRef.current;
      if ((e.code === "KeyW" || e.code === "ArrowUp") && current !== "DOWN") {
        nextDirectionRef.current = "UP";
      } else if ((e.code === "KeyS" || e.code === "ArrowDown") && current !== "UP") {
        nextDirectionRef.current = "DOWN";
      } else if ((e.code === "KeyA" || e.code === "ArrowLeft") && current !== "RIGHT") {
        nextDirectionRef.current = "LEFT";
      } else if ((e.code === "KeyD" || e.code === "ArrowRight") && current !== "LEFT") {
        nextDirectionRef.current = "RIGHT";
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (["KeyW", "KeyS", "KeyA", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        isAcceleratingRef.current = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState, isGameActive]);

  // Touch Swipe Controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    isAcceleratingRef.current = true; // Touch & Hold for boost
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    isAcceleratingRef.current = false;
    if (!touchStartRef.current || gameState !== "playing" || !isGameActive) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) < 15 && Math.abs(dy) < 15) return;

    const current = directionRef.current;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && current !== "LEFT") {
        nextDirectionRef.current = "RIGHT";
      } else if (dx < 0 && current !== "RIGHT") {
        nextDirectionRef.current = "LEFT";
      }
    } else {
      if (dy > 0 && current !== "UP") {
        nextDirectionRef.current = "DOWN";
      } else if (dy < 0 && current !== "DOWN") {
        nextDirectionRef.current = "UP";
      }
    }
  };

  return (
    <div className="min-w-0 space-y-4 rounded-3xl border border-[#2D2B2C]/6 bg-white p-3 shadow-[0_4px_24px_rgba(45,43,44,0.05)] dark:border-white/8 dark:bg-[#1E2721]/50 sm:p-6">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#2D2B2C]/8 dark:border-white/10">
        {/* Scores */}
        <div className="flex items-center gap-4 text-xs font-bold text-[#2D2B2C] dark:text-[#F0F5F1]">
          <span>
            得 分: <strong className="text-[#8C4A31] text-base">{score}</strong>
          </span>
          <span className="text-[#7A736A] dark:text-[#9EB3A4]">
            最高分: <strong>{highScore}</strong>
          </span>
        </div>

        {/* Mode Switch Buttons (点击直接切换模式并强制重开一局) */}
        <div className="grid w-full grid-cols-3 items-center gap-1 rounded-2xl border border-[#2D2B2C]/6 bg-[#FAF7F2] p-1 text-xs font-semibold dark:border-white/10 dark:bg-[#24221F] sm:w-auto">
          <button
            onClick={() => startNewGameWithDifficulty("easy")}
            className={`min-w-0 px-2 py-1 rounded-xl transition-all ${
              difficulty === "easy"
                ? "bg-[#36513B] text-white shadow-2xs font-bold"
                : "text-[#7A736A] hover:text-[#2D2B2C] dark:hover:text-white"
            }`}
          >
            简单 (可穿墙)
          </button>
          <button
            onClick={() => startNewGameWithDifficulty("normal")}
            className={`min-w-0 px-2 py-1 rounded-xl transition-all ${
              difficulty === "normal"
                ? "bg-[#36513B] text-white shadow-2xs font-bold"
                : "text-[#7A736A] hover:text-[#2D2B2C] dark:hover:text-white"
            }`}
          >
            普通
          </button>
          <button
            onClick={() => startNewGameWithDifficulty("hard")}
            className={`min-w-0 px-2 py-1 rounded-xl transition-all ${
              difficulty === "hard"
                ? "bg-[#8C4A31] text-white shadow-2xs font-bold"
                : "text-[#7A736A] hover:text-[#2D2B2C] dark:hover:text-white"
            }`}
          >
            困难 (极速)
          </button>
        </div>
      </div>

      {/* Game Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden shadow-inner border-2 border-[#2D2B2C]/10 dark:border-white/10"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <canvas ref={canvasRef} className="block w-full h-[400px]" />

        {/* Start Overlay */}
        {gameState === "idle" && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h3 className="text-2xl font-bold text-white tracking-wide">贪吃蛇大冒险</h3>
            <p className="text-xs text-white/80 max-w-xs">
              {DIFFICULTY_CONFIG[difficulty].label} · 长按方向键可加速（上限 25ms）
            </p>
            <button
              onClick={() => startNewGameWithDifficulty(difficulty)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#36513B] text-white font-bold hover:scale-105 transition-all shadow-md"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>开始游戏</span>
            </button>
          </div>
        )}

        {/* GameOver Overlay */}
        {gameState === "dead" && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-200">
            <h3 className="text-2xl font-bold text-white">游戏结束！</h3>
            <p className="text-sm text-gray-300">
              得分: <strong className="text-amber-400 font-bold">{score}</strong> | 最高分: <strong>{highScore}</strong>
            </p>
            <button
              onClick={() => startNewGameWithDifficulty(difficulty)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#36513B] text-white font-bold hover:scale-105 transition-all shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>再试一次</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
