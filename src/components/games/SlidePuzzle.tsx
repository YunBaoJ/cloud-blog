"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { playGameSound } from '@/lib/gameSounds';
import { Pause, Play } from 'lucide-react';
import { useGameActivity } from '@/components/games/GameActivityContext';
import { recordGameResult } from '@/lib/gameHistory';

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
      padding: '4px',
    };
  };

  return (
    <div className="bg-[var(--surface)] dark:bg-[#1B2D22]/60 rounded-3xl p-4 sm:p-6 border border-[var(--border-line-color)] shadow-sm w-full max-w-md mx-auto font-sans relative overflow-hidden space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[var(--border-line-color)]">
        <div className="flex space-x-3 text-[var(--foreground)]">
          <div className="bg-[var(--surface-2)] px-2.5 py-1 rounded-xl border border-[var(--border-line-color)] flex flex-col items-center min-w-[52px]">
            <span className="text-[10px] font-semibold text-[var(--accent-clay)]">步数</span>
            <span className="text-sm font-bold font-mono leading-none">{steps}</span>
          </div>
          <div className="bg-[var(--surface-2)] px-2.5 py-1 rounded-xl border border-[var(--border-line-color)] flex flex-col items-center min-w-[52px]">
            <span className="text-[10px] font-semibold text-[var(--accent-green)]">用时</span>
            <span className="text-sm font-bold font-mono leading-none">{formatTime(time)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isStarted && !isWon && (
            <button
              type="button"
              onClick={() => setIsPaused((current) => !current)}
              className="rounded-xl bg-[var(--surface-2)] p-2 text-[var(--foreground)] border border-[var(--border-line-color)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
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
            className="bg-[var(--surface-2)] text-[var(--foreground)] rounded-xl px-2.5 py-1.5 text-xs font-semibold outline-none border border-[var(--border-line-color)] cursor-pointer"
          >
            <option value={3}>3×3</option>
            <option value={4}>4×4</option>
          </select>
          <button
            onClick={() => initBoard(size)}
            className="bg-[var(--accent-green)] hover:opacity-90 active:scale-95 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs"
          >
            打乱
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="relative w-full aspect-square bg-[var(--surface-2)] rounded-2xl p-1 overflow-hidden border border-[var(--border-line-color)]">
        {tiles.map((val) => {
          if (val === 0) return null;
          const currentPosIndex = tiles.indexOf(val);
          return (
            <div
              key={val}
              className="absolute top-0 left-0 transition-all duration-150 ease-out"
              style={getTileStyle(currentPosIndex)}
              onClick={() => handleTileClick(currentPosIndex)}
            >
              <div className="w-full h-full bg-[var(--surface)] dark:bg-[#23382C] rounded-xl flex items-center justify-center cursor-pointer shadow-xs hover:brightness-95 active:scale-95 transition-all border border-[var(--border-line-color)]">
                <span className="text-[var(--foreground)] font-bold text-xl sm:text-2xl font-mono">
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
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-[var(--surface)]/90 text-sm font-semibold text-[var(--accent-green)] backdrop-blur-xs"
          >
            <Play className="size-6" />
            继续游戏
          </button>
        )}

        {/* Win Overlay */}
        {isWon && (
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center rounded-3xl p-6 text-center animate-in fade-in duration-200">
            <div className="w-full max-w-xs space-y-4 p-6 bg-[var(--surface)] border border-[var(--border-line-color)] rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold text-[var(--accent-clay)]">挑战成功！</h2>
              <div className="flex justify-center space-x-6 text-[var(--foreground)]">
                <div className="text-center">
                  <p className="text-xs text-[var(--muted)]">步数</p>
                  <p className="text-xl font-mono font-bold">{steps}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[var(--muted)]">用时</p>
                  <p className="text-xl font-mono font-bold">{formatTime(time)}</p>
                </div>
              </div>
              <button
                onClick={() => initBoard(size)}
                className="mt-2 w-full bg-[var(--accent-green)] hover:opacity-90 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95"
              >
                再来一局
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
