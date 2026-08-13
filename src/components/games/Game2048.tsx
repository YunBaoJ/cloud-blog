"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { playGameSound } from '@/lib/gameSounds';
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
    if (gameState === 'over' || (gameState === 'won' && !continued)) return;

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
    } else if (over) {
      setGameState('over');
    }
  }, [bestScore, continued, gameState, grid, score, setBestScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [handleMove]);

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
    <div className="bg-[#FAF7F2] text-[#2D2B2C] dark:bg-transparent flex flex-col items-center">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-[#36513B] dark:text-[#FAF7F2]">2048</h1>
          <div className="flex gap-2">
            <div className="bg-white dark:bg-[#1E2721]/50 px-3 py-1.5 rounded-lg border border-[#2D2B2C]/6 shadow-sm flex flex-col items-center min-w-[60px]">
              <span className="text-[10px] uppercase font-bold text-[#8C4A31]">分数</span>
              <span className="font-bold leading-none dark:text-white">{score}</span>
            </div>
            <div className="bg-white dark:bg-[#1E2721]/50 px-3 py-1.5 rounded-lg border border-[#2D2B2C]/6 shadow-sm flex flex-col items-center min-w-[60px]">
              <span className="text-[10px] uppercase font-bold text-[#8C4A31]">最高分</span>
              <span className="font-bold leading-none dark:text-white">{bestScore}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm opacity-80 dark:text-white/80">合并数字，到达 <strong>2048</strong>！</p>
          <button 
            onClick={resetGame}
            className="bg-[#8C4A31] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#7a3e26] transition-colors"
          >
            重新开始
          </button>
        </div>

        {/* Game Board */}
        <div 
          className="bg-white dark:bg-[#1E2721]/50 rounded-3xl p-4 sm:p-6 border border-[#2D2B2C]/6 shadow-[0_4px_24px_rgba(45,43,44,0.05)] relative touch-none select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <style>{`
            @keyframes tile-pop {
              0% { transform: scale(0.8); opacity: 0.5; }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); opacity: 1; }
            }
            .animate-tile-pop { animation: tile-pop 0.2s ease-in-out; }
          `}</style>
          
          <div className="grid grid-cols-4 grid-rows-4 gap-2 sm:gap-3 bg-[#FAF7F2] dark:bg-[#2D2B2C]/20 p-2 sm:p-3 rounded-2xl">
            {grid.map((row, r) => 
              row.map((val, c) => (
                <div 
                  key={`${r}-${c}`} 
                  className="w-full aspect-square rounded-xl bg-[#EEE4DA] dark:bg-[#2D2B2C]/40 relative"
                >
                  {val > 0 && (
                    <div 
                      key={`${r}-${c}-${val}`}
                      className={`absolute inset-0 flex items-center justify-center rounded-xl font-bold animate-tile-pop
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
            <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl backdrop-blur-[2px]
              ${gameState === 'won' ? 'bg-[#36513B]/80 text-white' : 'bg-white/70 dark:bg-[#1E2721]/90'}`}>
              <h2 className={`text-3xl font-bold mb-4 ${gameState === 'over' ? 'text-[#8C4A31] dark:text-[#F67C5F]' : ''}`}>
                {gameState === 'won' ? '你赢了！' : '游戏结束！'}
              </h2>
              <div className="flex gap-3">
                {gameState === 'won' && !continued && (
                  <button 
                    onClick={() => setContinued(true)}
                    className="bg-white text-[#36513B] px-5 py-2 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-sm"
                  >
                    继续挑战
                  </button>
                )}
                <button 
                  onClick={resetGame}
                  className={`${gameState === 'won' ? 'bg-transparent border-2 border-white' : 'bg-[#36513B] text-white shadow-sm'} 
                    px-5 py-2 rounded-xl font-bold hover:opacity-80 transition-colors`}
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
