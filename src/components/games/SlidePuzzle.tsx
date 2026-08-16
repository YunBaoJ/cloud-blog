"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { playGameSound } from '@/lib/gameSounds';
import { Pause, Play } from 'lucide-react';
import { useGameActivity } from '@/components/games/GameActivityContext';
import { recordGameResult } from '@/lib/gameHistory';

// Wabi-sabi theme colors
// background: #FAF7F2
// primary: #36513B
// text: #2D2B2C
// accent: #8C4A31
// card bg: bg-white dark:bg-[#1E2721]/50
// tile bg: #E2EBE4
// empty tile: #FAF7F2

type GridSize = 3 | 4;

interface SlidePuzzleProps {
  initialSize?: GridSize;
}

function createBoard(gridSize: GridSize) {
  const numTiles = gridSize * gridSize;
  const board = Array.from({ length: numTiles }, (_, i) => i + 1);
  board[numTiles - 1] = 0;

  let emptyIdx = numTiles - 1;
  let lastSwappedIdx = -1;
  for (let move = 0; move < gridSize * gridSize * 15; move++) {
    const row = Math.floor(emptyIdx / gridSize);
    const col = emptyIdx % gridSize;
    const neighbors: number[] = [];
    if (row > 0) neighbors.push(emptyIdx - gridSize);
    if (row < gridSize - 1) neighbors.push(emptyIdx + gridSize);
    if (col > 0) neighbors.push(emptyIdx - 1);
    if (col < gridSize - 1) neighbors.push(emptyIdx + 1);
    const candidates = neighbors.filter((index) => index !== lastSwappedIdx);
    const nextIdx = (candidates.length ? candidates : neighbors)[Math.floor(Math.random() * (candidates.length || neighbors.length))];
    [board[emptyIdx], board[nextIdx]] = [board[nextIdx], board[emptyIdx]];
    lastSwappedIdx = emptyIdx;
    emptyIdx = nextIdx;
  }

  return board;
}

export default function SlidePuzzle({ initialSize = 4 }: SlidePuzzleProps) {
  const isGameActive = useGameActivity();
  const [size, setSize] = useState<GridSize>(initialSize);
  const [tiles, setTiles] = useState<number[]>(() => createBoard(initialSize));
  const [isStarted, setIsStarted] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [steps, setSteps] = useState(0);
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Initialize board with 100% guaranteed solvability (Reverse random moves)
  const initBoard = useCallback((gridSize: GridSize) => {
    setTiles(createBoard(gridSize));
    setSteps(0);
    setTime(0);
    setIsStarted(false);
    setIsWon(false);
    setIsPaused(false);
  }, []);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted && !isWon && !isPaused && isGameActive) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGameActive, isPaused, isStarted, isWon]);



  const isSolved = (arr: number[]) => {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] !== i + 1) return false;
    }
    return arr[arr.length - 1] === 0;
  };

  const handleTileClick = (index: number) => {
    if (isWon || isPaused || !isGameActive) return;

    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / size);
    const col = index % size;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;

    const isAdjacent =
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      if (!isStarted) setIsStarted(true);

      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      const solved = isSolved(newTiles);
      setTiles(newTiles);
      setSteps((s) => s + 1);

      playGameSound(solved ? 'puzzle-win' : 'puzzle-move');
      if (solved) {
        setIsWon(true);
        recordGameResult('puzzle', '华容道', `${steps + 1} 步 · ${formatTime(time)}`);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Determine positions for rendering
  const getTileStyle = (index: number) => {
    const row = Math.floor(index / size);
    const col = index % size;
    return {
      transform: `translate(${col * 100}%, ${row * 100}%)`,
      width: `${100 / size}%`,
      height: `${100 / size}%`,
      padding: '4px', // small gap
    };
  };

  return (
    <div className="bg-white dark:bg-[#1E2721]/50 rounded-3xl p-6 border border-[#2D2B2C]/6 shadow-[0_4px_24px_rgba(45,43,44,0.05)] w-full max-w-md mx-auto font-sans relative overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4 text-[#2D2B2C] dark:text-[#FAF7F2]">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider opacity-60">步数</span>
            <span className="text-xl font-bold font-mono">{steps}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider opacity-60">用时</span>
            <span className="text-xl font-bold font-mono">{formatTime(time)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isStarted && !isWon && (
            <button
              type="button"
              onClick={() => setIsPaused((current) => !current)}
              className="rounded-lg bg-[#36513B]/8 p-2 text-[#36513B] transition-colors hover:bg-[#36513B]/14 dark:text-[#E2EBE4]"
              aria-label={isPaused ? '继续游戏' : '暂停游戏'}
            >
              {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
            </button>
          )}
          <select
            value={size}
            onChange={(e) => {
              const nextSize = Number(e.target.value) as GridSize;
              setSize(nextSize);
              initBoard(nextSize);
            }}
            className="bg-[#FAF7F2] dark:bg-[#2D2B2C] text-[#36513B] dark:text-[#E2EBE4] rounded-lg px-2 py-1 text-sm outline-none border-none cursor-pointer focus:ring-2 focus:ring-[#8C4A31]"
          >
            <option value={3}>3x3</option>
            <option value={4}>4x4</option>
          </select>
          <button
            onClick={() => initBoard(size)}
            className="bg-[#36513B] hover:bg-[#2a402e] text-[#FAF7F2] px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            打乱
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="relative w-full aspect-square bg-[#FAF7F2] dark:bg-[#2D2B2C]/30 rounded-2xl p-1 overflow-hidden">
        {tiles.map((val) => {
          if (val === 0) return null; // We can optionally render empty space or just let background show
          const currentPosIndex = tiles.indexOf(val);
          return (
            <div
              key={val}
              className="absolute top-0 left-0 transition-all duration-150 ease-out"
              style={getTileStyle(currentPosIndex)}
              onClick={() => handleTileClick(currentPosIndex)}
            >
              <div className="w-full h-full bg-[#E2EBE4] dark:bg-[#36513B]/80 rounded-2xl flex items-center justify-center cursor-pointer shadow-sm hover:brightness-95 active:scale-95 transition-all">
                <span className="text-[#36513B] dark:text-[#FAF7F2] font-bold text-2xl lg:text-3xl">
                  {val}
                </span>
              </div>
            </div>
          );
        })}
        {isPaused && (
          <button
            type="button"
            onClick={() => setIsPaused(false)}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-[#FAF7F2]/88 text-sm font-semibold text-[#36513B] backdrop-blur-sm dark:bg-[#1E2721]/88 dark:text-[#E2EBE4]"
          >
            <Play className="size-6" />
            继续游戏
          </button>
        )}
      </div>

      {/* Win Overlay */}
      {isWon && (
        <div className="absolute inset-0 bg-[#FAF7F2]/90 dark:bg-[#1E2721]/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-3xl animate-in fade-in duration-300">
          <div className="text-center space-y-4 p-6 bg-white dark:bg-[#2D2B2C] border border-[#2D2B2C]/10 dark:border-white/10 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-[#8C4A31]">完成！</h2>
            <div className="flex justify-center space-x-6 text-[#2D2B2C] dark:text-[#FAF7F2]">
              <div className="text-center">
                <p className="text-sm opacity-70">步数</p>
                <p className="text-2xl font-mono font-bold">{steps}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-70">用时</p>
                <p className="text-2xl font-mono font-bold">{formatTime(time)}</p>
              </div>
            </div>
            <button
              onClick={() => initBoard(size)}
              className="mt-4 w-full bg-[#8C4A31] hover:bg-[#733c27] text-[#FAF7F2] px-6 py-3 rounded-xl font-medium transition-colors"
            >
              再来一局
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
