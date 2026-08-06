"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';

type GameState = 'idle' | 'playing' | 'paused' | 'dead';
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 22;
const INITIAL_SPEED = 150;
const MIN_SPEED = 60;
const SPEED_DECREMENT = 2; // per food

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 }
];

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const snakeRef = useRef<Point[]>([...INITIAL_SNAKE]);
  const directionRef = useRef<Direction>('RIGHT');
  const nextDirectionRef = useRef<Direction>('RIGHT');
  const foodRef = useRef<Point>({ x: 18, y: 10 });
  const speedRef = useRef(INITIAL_SPEED);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const canvasSizeRef = useRef({ width: 0, height: 440 });
  const showDeathTextRef = useRef(false);

  // For touch controls
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  const updateHighScore = useCallback((newScore: number) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('snakeHighScore', newScore.toString());
    }
  }, [highScore]);

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
      isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasSizeRef.current;
    
    // 1. Clear & Background (Warm cream off-white, matching wabi-sabi tone)
    ctx.fillStyle = '#FAF6EE';
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Food — Red circular dot with subtle highlight
    const foodX = foodRef.current.x * GRID_SIZE + GRID_SIZE / 2;
    const foodY = foodRef.current.y * GRID_SIZE + GRID_SIZE / 2;
    ctx.save();
    ctx.fillStyle = '#B84A39';
    ctx.beginPath();
    ctx.arc(foodX, foodY, GRID_SIZE / 2 - 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

    // 3. Draw Snake — Classic 8-Bit Retro Pixel Grid Style
    const snake = snakeRef.current;
    if (snake.length > 0) {
      ctx.save();

      // Draw Pixel Segments
      for (let i = snake.length - 1; i >= 0; i--) {
        const seg = snake[i];
        const x = seg.x * GRID_SIZE + 1.5;
        const y = seg.y * GRID_SIZE + 1.5;
        const size = GRID_SIZE - 3;

        ctx.beginPath();
        // Rounded pixel block
        ctx.roundRect(x, y, size, size, i === 0 ? 6 : 4);

        // Color fill
        ctx.fillStyle = i === 0 ? '#34543C' : '#36513B';
        ctx.fill();
        ctx.strokeStyle = '#23382C';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Draw Classic Pixel Eyes on Head Block
      const head = snake[0];
      const hx = head.x * GRID_SIZE;
      const hy = head.y * GRID_SIZE;
      const dir = directionRef.current;

      let e1 = { x: hx, y: hy }, e2 = { x: hx, y: hy };
      if (dir === 'RIGHT') {
        e1 = { x: hx + GRID_SIZE - 6, y: hy + 5 };
        e2 = { x: hx + GRID_SIZE - 6, y: hy + GRID_SIZE - 8 };
      } else if (dir === 'LEFT') {
        e1 = { x: hx + 4, y: hy + 5 };
        e2 = { x: hx + 4, y: hy + GRID_SIZE - 8 };
      } else if (dir === 'UP') {
        e1 = { x: hx + 5, y: hy + 4 };
        e2 = { x: hx + GRID_SIZE - 8, y: hy + 4 };
      } else if (dir === 'DOWN') {
        e1 = { x: hx + 5, y: hy + GRID_SIZE - 6 };
        e2 = { x: hx + GRID_SIZE - 8, y: hy + GRID_SIZE - 6 };
      }

      // Eye White Pixels
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(e1.x, e1.y, 3.5, 3.5);
      ctx.fillRect(e2.x, e2.y, 3.5, 3.5);

      // Pupil Black Pixels
      ctx.fillStyle = '#111F14';
      ctx.fillRect(e1.x + 1, e1.y + 1, 1.8, 1.8);
      ctx.fillRect(e2.x + 1, e2.y + 1, 1.8, 1.8);

      ctx.restore();
    }

    if (showDeathTextRef.current) {
      ctx.fillStyle = '#8C4A31';
      ctx.font = 'bold 48px "HarmonyOS Sans SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('撞了', width / 2, height / 2);
    }
  }, []);

  const gameOver = useCallback(() => {
    setGameState('dead');
    showDeathTextRef.current = true;
    updateHighScore(score);
    draw(); // Draw "撞了"
    
    setTimeout(() => {
      showDeathTextRef.current = false;
      setGameState(prev => prev); // force render for overlay
    }, 800);
  }, [score, updateHighScore, draw]);

  const gameStep = useCallback(() => {
    if (gameState !== 'playing') return;

    directionRef.current = nextDirectionRef.current;
    const head = snakeRef.current[0];
    const newHead = { ...head };

    switch (directionRef.current) {
      case 'UP': newHead.y -= 1; break;
      case 'DOWN': newHead.y += 1; break;
      case 'LEFT': newHead.x -= 1; break;
      case 'RIGHT': newHead.x += 1; break;
    }

    const { width, height } = canvasSizeRef.current;
    const cols = Math.floor(width / GRID_SIZE);
    const rows = Math.floor(height / GRID_SIZE);

    // Check collisions
    if (
      newHead.x < 0 || newHead.x >= cols ||
      newHead.y < 0 || newHead.y >= rows ||
      snakeRef.current.some(s => s.x === newHead.x && s.y === newHead.y)
    ) {
      gameOver();
      return;
    }

    const newSnake = [newHead, ...snakeRef.current];

    // Check food
    if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
      setScore(s => s + 1);
      speedRef.current = Math.max(MIN_SPEED, speedRef.current - SPEED_DECREMENT);
      foodRef.current = generateFood(newSnake, width, height);
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    draw();

    gameLoopRef.current = setTimeout(gameStep, speedRef.current);
  }, [gameState, gameOver, draw, generateFood]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setTimeout(gameStep, speedRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    };
  }, [gameState, gameStep]);

  const startGame = useCallback(() => {
    const { width, height } = canvasSizeRef.current;
    const midX = Math.floor(width / GRID_SIZE / 2);
    const midY = Math.floor(height / GRID_SIZE / 2);
    snakeRef.current = [
      { x: midX, y: midY }
    ];
    directionRef.current = 'RIGHT';
    nextDirectionRef.current = 'RIGHT';
    setScore(0);
    speedRef.current = INITIAL_SPEED;
    showDeathTextRef.current = false;
    foodRef.current = generateFood(snakeRef.current, width, height);
    setGameState('playing');
  }, [generateFood]);

  // Handle Resize
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === containerRef.current) {
          const { width } = entry.contentRect;
          const canvasWidth = Math.floor(width / GRID_SIZE) * GRID_SIZE; // Keep it aligned to grid
          if (canvasRef.current) {
            canvasRef.current.width = canvasWidth;
            canvasRef.current.height = 440;
          }
          canvasSizeRef.current = { width: canvasWidth, height: 440 };
          draw();
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [draw]);

  // Handle Keyboard Inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key)) {
        e.preventDefault();
      }

      const key = e.key.toLowerCase();

      // Restart on Enter or Space if game is over or idle
      if ((key === 'enter' || key === ' ') && (gameState === 'dead' || gameState === 'idle')) {
        startGame();
        return;
      }

      if (gameState !== 'playing') return;

      if ((key === 'arrowup' || key === 'w') && directionRef.current !== 'DOWN') {
        nextDirectionRef.current = 'UP';
      } else if ((key === 'arrowdown' || key === 's') && directionRef.current !== 'UP') {
        nextDirectionRef.current = 'DOWN';
      } else if ((key === 'arrowleft' || key === 'a') && directionRef.current !== 'RIGHT') {
        nextDirectionRef.current = 'LEFT';
      } else if ((key === 'arrowright' || key === 'd') && directionRef.current !== 'LEFT') {
        nextDirectionRef.current = 'RIGHT';
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startGame]);

  // Handle Touch Inputs
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || gameState !== 'playing') return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const dx = touchEndX - touchStartRef.current.x;
    const dy = touchEndY - touchStartRef.current.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30 && directionRef.current !== 'LEFT') {
        nextDirectionRef.current = 'RIGHT';
      } else if (dx < -30 && directionRef.current !== 'RIGHT') {
        nextDirectionRef.current = 'LEFT';
      }
    } else {
      if (dy > 30 && directionRef.current !== 'UP') {
        nextDirectionRef.current = 'DOWN';
      } else if (dy < -30 && directionRef.current !== 'DOWN') {
        nextDirectionRef.current = 'UP';
      }
    }
    touchStartRef.current = null;
  };

  const isNewHighScore = score > 0 && score >= highScore;

  return (
    <div className="bg-white dark:bg-[#1E2721]/50 rounded-3xl p-6 border border-[#2D2B2C]/6 dark:border-white/10 shadow-[0_4px_24px_rgba(45,43,44,0.05)] font-['HarmonyOS_Sans_SC',sans-serif] relative max-w-2xl mx-auto">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-4 text-[#2D2B2C] dark:text-[#FAF7F2]">
        <div className="flex flex-col">
          <span className="text-xs font-mono text-[#7A736A] uppercase tracking-wider">当前得分</span>
          <span className="text-3xl font-bold text-[#8C4A31] font-mono">{score}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-xs font-mono text-[#7A736A] uppercase tracking-wider">最高纪录</span>
          <span className="text-2xl font-bold text-[#36513B] dark:text-[#567a5d] font-mono">{highScore}</span>
        </div>
      </div>

      {/* Game Area */}
      <div 
        ref={containerRef} 
        className="relative w-full rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#2D2B2C]/10 shadow-inner"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <canvas 
          ref={canvasRef}
          className="block w-full h-[440px]"
        />

        {/* Initial Idle Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF7F2]/85 backdrop-blur-sm p-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#36513B]/10 border border-[#36513B]/20 flex items-center justify-center text-3xl shadow-sm animate-bounce">
              🐍
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-[#2D2B2C] dark:text-[#FAF7F2]">贪吃蛇灵感冒险</h3>
              <p className="text-xs text-[#7A736A] font-mono">点击按钮或按键盘 Enter 键开始游戏</p>
            </div>
            <button 
              onClick={startGame}
              className="px-8 py-3 bg-[#36513B] hover:bg-[#2d4432] text-[#FAF7F2] rounded-2xl font-bold text-base transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <span>开始游戏</span>
              <span className="text-xs font-mono opacity-60 bg-white/20 px-2 py-0.5 rounded">Enter ↵</span>
            </button>
          </div>
        )}

        {/* GameOver UX/UI Overlay - Designed with UI/UX Pro Max guidelines */}
        {gameState === 'dead' && !showDeathTextRef.current && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1E2721]/50 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-200 p-6 z-30">
            <div className="bg-[#FAF7F2] dark:bg-[#1E2721] p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col items-center border border-white/80 dark:border-white/10 max-w-sm w-full space-y-5 animate-in zoom-in-95 duration-200">
              
              {/* Header Title & Badge */}
              <div className="text-center space-y-1.5">
                {isNewHighScore ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold animate-pulse mb-1">
                    <span>🏆</span>
                    <span>创下新纪录！NEW BEST</span>
                  </div>
                ) : (
                  <div className="text-xs font-mono text-[#8C4A31] font-semibold uppercase tracking-widest">
                    GAME OVER ● 游戏结束
                  </div>
                )}
                <h3 className="text-2xl font-bold text-[#2D2B2C] dark:text-[#FAF7F2]">
                  {isNewHighScore ? '太棒了！突破极限' : '这次差一点点'}
                </h3>
              </div>

              {/* Score Dashboard Matrix */}
              <div className="grid grid-cols-2 gap-3 w-full bg-white dark:bg-[#151C17] p-4 rounded-2xl border border-[#2D2B2C]/8 dark:border-white/8 shadow-2xs">
                <div className="flex flex-col items-center justify-center p-2 border-r border-[#2D2B2C]/8 dark:border-white/8">
                  <span className="text-[11px] font-mono text-[#7A736A] uppercase">本次得分</span>
                  <span className="text-3xl font-extrabold text-[#8C4A31] font-mono mt-0.5">{score}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2">
                  <span className="text-[11px] font-mono text-[#7A736A] uppercase">历史最高</span>
                  <span className="text-2xl font-bold text-[#36513B] dark:text-[#567a5d] font-mono mt-0.5">{highScore}</span>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="w-full space-y-2 pt-1">
                <button 
                  onClick={startGame}
                  className="w-full py-3 bg-[#36513B] hover:bg-[#2d4432] text-[#FAF7F2] rounded-2xl font-bold transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
                >
                  <span>再来一局</span>
                  <span className="text-xs font-mono opacity-70 bg-white/20 px-2 py-0.5 rounded group-hover:bg-white/30 transition-colors">Enter ↵</span>
                </button>
              </div>

              <p className="text-[11px] font-mono text-[#7A736A] text-center">
                键盘按下 <kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 border border-black/10 font-sans">Enter</kbd> 或 <kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 border border-black/10 font-sans">Space</kbd> 可快速重开
              </p>

            </div>
          </div>
        )}
      </div>
      
      {/* Controls Hint */}
      <div className="mt-4 text-center text-xs font-mono text-[#2D2B2C]/60 dark:text-[#FAF7F2]/60 flex items-center justify-center gap-4">
        <span>键盘 WASD / 方向键</span>
        <span>•</span>
        <span>支持触摸滑动</span>
      </div>
    </div>
  );
}
