"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { playGameSound } from '@/lib/gameSounds';
import { useGameActivity } from '@/components/games/GameActivityContext';
import { recordGameResult } from '@/lib/gameHistory';
import { usePersistentNumber } from '@/lib/usePersistentNumber';

type GameState = 'playing' | 'won' | 'over';
type Grid = number[][];

const GRID_SIZE = 4;

const getColorForValue = (value: number) => {
  switch (value) {
    case 2: return 'bg-[#EEE4DA] text-[#776E65]';
    case 4: return 'bg-[#EDE0C8] text-[#776E65]';
    case 8: return 'bg-[#F2B179] text-white';
    case 16: return 'bg-[#F59563] text-white';
    case 32: return 'bg-[#F67C5F] text-white';
    case 64: return 'bg-[#F65E3B] text-white';
    case 128: return 'bg-[#EDCF72] text-white';
    case 256: return 'bg-[#EDCC61] text-white';
    case 512: return 'bg-[#EDC850] text-white';
    case 1024: return 'bg-[#EDC53F] text-white';
    case 2048: return 'bg-[#36513B] text-white';
    default:
      if (value > 2048) return 'bg-[#36513B] text-white';
      return 'bg-[#EEE4DA] text-[#9F8B7B]/0'; 
  }
};

const getFontSize = (value: number) => {
  if (value < 100) return 'text-4xl';
  if (value < 1000) return 'text-3xl';
  return 'text-2xl';
};

const createEmptyGrid = (): Grid => Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));

const addRandomTile = (grid: Grid): Grid => {
  const emptyCells: { r: number; c: number }[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) emptyCells.push({ r, c });
    }
  }
  
  if (emptyCells.length === 0) return grid;
  
  const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newGrid = grid.map(row => [...row]);
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
};

const rotateRight = (grid: Grid): Grid => {
  const newGrid = createEmptyGrid();
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      newGrid[c][GRID_SIZE - 1 - r] = grid[r][c];
    }
  }
  return newGrid;
};

const moveLeft = (grid: Grid): { newGrid: Grid; scoreIncrease: number; moved: boolean } => {
  const newGrid = createEmptyGrid();
  let scoreIncrease = 0;
  let moved = false;
  
  for (let r = 0; r < GRID_SIZE; r++) {
    const row = grid[r].filter(val => val !== 0);
    const newRow: number[] = [];
    
    for (let i = 0; i < row.length; i++) {
      if (i < row.length - 1 && row[i] === row[i + 1]) {
        newRow.push(row[i] * 2);
        scoreIncrease += row[i] * 2;
        i++;
        moved = true;
      } else {
        newRow.push(row[i]);
      }
    }
    
    while (newRow.length < GRID_SIZE) {
      newRow.push(0);
    }
    
    if (newRow.join(',') !== grid[r].join(',')) {
      moved = true;
    }
    
    newGrid[r] = newRow;
  }
  
  return { newGrid, scoreIncrease, moved };
};

const move = (grid: Grid, direction: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'): { newGrid: Grid; scoreIncrease: number; moved: boolean } => {
  let rotations = 0;
  if (direction === 'UP') rotations = 3;
  else if (direction === 'RIGHT') rotations = 2;
  else if (direction === 'DOWN') rotations = 1;
  else if (direction === 'LEFT') rotations = 0;

  let tempGrid = grid;
  for (let i = 0; i < rotations; i++) {
    tempGrid = rotateRight(tempGrid);
  }

  const { newGrid: movedGrid, scoreIncrease, moved } = moveLeft(tempGrid);

  let finalGrid = movedGrid;
  const backRotations = (4 - rotations) % 4;
  for (let i = 0; i < backRotations; i++) {
    finalGrid = rotateRight(finalGrid);
  }

  return { newGrid: finalGrid, scoreIncrease, moved };
};

const checkGameOver = (grid: Grid): boolean => {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) return false;
      if (c < GRID_SIZE - 1 && grid[r][c] === grid[r][c + 1]) return false;
      if (r < GRID_SIZE - 1 && grid[r][c] === grid[r + 1][c]) return false;
    }
  }
  return true;
};

export default function Game2048() {
  const isGameActive = useGameActivity();
  const [grid, setGrid] = useState<Grid>(() => addRandomTile(addRandomTile(createEmptyGrid())));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = usePersistentNumber('2048-best-score');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [continued, setContinued] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const resetGame = () => {
    setGrid(addRandomTile(addRandomTile(createEmptyGrid())));
    setScore(0);
    setGameState('playing');
    setContinued(false);
  };

  const handleMove = useCallback((direction: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT') => {
    if (!isGameActive || gameState === 'over' || (gameState === 'won' && !continued)) return;

    const { newGrid, scoreIncrease, moved } = move(grid, direction);
    if (!moved) return;

    const nextGrid = addRandomTile(newGrid);
    const nextScore = score + scoreIncrease;
    setGrid(nextGrid);
    setScore(nextScore);
    if (nextScore > bestScore) setBestScore(nextScore);

    const won = nextGrid.some((row) => row.includes(2048)) && gameState !== 'won' && !continued;
    const over = !won && checkGameOver(nextGrid);

    if (won) playGameSound('2048-win');
    else if (over) playGameSound('2048-over');
    else playGameSound(scoreIncrease > 0 ? '2048-merge' : '2048-move');

    if (won) {
      setGameState('won');
      recordGameResult('2048', '2048', `${nextScore} 分 · 达成 2048`);
    } else if (over) {
      setGameState('over');
      recordGameResult('2048', '2048', `${nextScore} 分`);
    }
  }, [bestScore, continued, gameState, grid, isGameActive, score, setBestScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGameActive) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          handleMove('UP');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          handleMove('RIGHT');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          handleMove('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          handleMove('LEFT');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, isGameActive]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > 30) {
        handleMove(deltaX > 0 ? 'RIGHT' : 'LEFT');
      }
    } else {
      if (Math.abs(deltaY) > 30) {
        handleMove(deltaY > 0 ? 'DOWN' : 'UP');
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-sm space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-[var(--foreground)]">2048</h2>
            <p className="text-xs text-[var(--muted)]">滑动合并方块</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-[var(--surface-2)] px-3 py-1.5 rounded-xl border border-[var(--border-line-color)] flex flex-col items-center min-w-[56px]">
              <span className="text-[10px] font-semibold text-[var(--accent-clay)]">得分</span>
              <span className="font-bold font-mono text-sm leading-none text-[var(--foreground)]">{score}</span>
            </div>
            <div className="bg-[var(--surface-2)] px-3 py-1.5 rounded-xl border border-[var(--border-line-color)] flex flex-col items-center min-w-[56px]">
              <span className="text-[10px] font-semibold text-[var(--accent-green)]">最佳</span>
              <span className="font-bold font-mono text-sm leading-none text-[var(--foreground)]">{bestScore}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs text-[var(--muted)]">
          <span>目标合成 <strong>2048</strong></span>
          <button 
            onClick={resetGame}
            className="bg-[var(--surface-2)] hover:bg-black/5 dark:hover:bg-white/10 text-[var(--foreground)] border border-[var(--border-line-color)] px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
          >
            重开
          </button>
        </div>

        {/* Game Board */}
        <div 
          className="bg-[var(--surface)] dark:bg-[#1B2D22]/60 rounded-3xl p-3 sm:p-4 border border-[var(--border-line-color)] shadow-sm relative touch-none select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <style>{`
            @keyframes tile-pop {
              0% { transform: scale(0.8); opacity: 0.5; }
              50% { transform: scale(1.08); }
              100% { transform: scale(1); opacity: 1; }
            }
            .animate-tile-pop { animation: tile-pop 0.18s ease-in-out; }
          `}</style>
          
          <div className="grid grid-cols-4 grid-rows-4 gap-2 sm:gap-2.5 bg-[var(--surface-2)] p-2 sm:p-2.5 rounded-2xl">
            {grid.map((row, r) => 
              row.map((val, c) => (
                <div 
                  key={`${r}-${c}`} 
                  className="w-full aspect-square rounded-xl bg-black/5 dark:bg-white/5 relative"
                >
                  {val > 0 && (
                    <div 
                      key={`${r}-${c}-${val}`}
                      className={`absolute inset-0 flex items-center justify-center rounded-xl font-bold animate-tile-pop shadow-xs
                        ${getColorForValue(val)} ${getFontSize(val)}`}
                    >
                      {val}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Overlays */}
          {gameState !== 'playing' && (
            <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl backdrop-blur-[3px] p-6 text-center space-y-4
              ${gameState === 'won' ? 'bg-[var(--accent-green)]/85 text-white' : 'bg-[var(--surface)]/90 dark:bg-[#1B2D22]/90'}`}>
              <h2 className={`text-2xl sm:text-3xl font-bold ${gameState === 'over' ? 'text-[var(--accent-clay)]' : 'text-white'}`}>
                {gameState === 'won' ? '挑战达成！' : '游戏结束'}
              </h2>
              <div className="flex gap-2.5">
                {gameState === 'won' && !continued && (
                  <button 
                    onClick={() => setContinued(true)}
                    className="bg-white text-[var(--accent-green)] px-4 py-2 rounded-xl text-xs font-semibold hover:bg-gray-100 transition-colors shadow-sm"
                  >
                    继续挑战
                  </button>
                )}
                <button
                  onClick={resetGame}
                  className={`${gameState === 'won' ? 'bg-transparent border border-white text-white' : 'bg-[var(--accent-green)] text-white'} px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-sm`}
                >
                  重新开始
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
