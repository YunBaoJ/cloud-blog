"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { RotateCcw, User, Bot, Users, Undo2, Play, Pause, Sparkles } from "lucide-react";
import { playGameSound } from "@/lib/gameSounds";
import { useGameActivity } from "@/components/games/GameActivityContext";
import { recordGameResult } from "@/lib/gameHistory";

type Stone = "black" | "white" | null;
type Mode = "pvp" | "pve" | "eve_step";
const SIZE = 15;

// ─── Win detection ───────────────────────────────────────────────
const DIRS = [[1,0],[0,1],[1,1],[1,-1]] as const;

function checkWin(board: Stone[], who: Stone, lastIdx: number): boolean {
  const r = Math.floor(lastIdx / SIZE);
  const c = lastIdx % SIZE;
  for (const [dr, dc] of DIRS) {
    let count = 1;
    for (let d = 1; d < 5; d++) {
      const nr = r + dr * d, nc = c + dc * d;
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) break;
      if (board[nr * SIZE + nc] !== who) break;
      count++;
    }
    for (let d = 1; d < 5; d++) {
      const nr = r - dr * d, nc = c - dc * d;
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) break;
      if (board[nr * SIZE + nc] !== who) break;
      count++;
    }
    if (count >= 5) return true;
  }
  return false;
}

// ─── AI Engine: Minimax + Alpha-Beta Pruning + Pattern Threat Detection ────────
function countLine(board: Stone[], r: number, c: number, dr: number, dc: number, who: Stone): { count: number; openEnds: number } {
  let count = 1, openEnds = 0;
  for (let d = 1; d < 5; d++) {
    const nr = r + dr * d, nc = c + dc * d;
    if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) break;
    const v = board[nr * SIZE + nc];
    if (v === who) count++;
    else { if (v === null) openEnds++; break; }
  }
  for (let d = 1; d < 5; d++) {
    const nr = r - dr * d, nc = c - dc * d;
    if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) break;
    const v = board[nr * SIZE + nc];
    if (v === who) count++;
    else { if (v === null) openEnds++; break; }
  }
  return { count, openEnds };
}

// Advanced pattern score evaluator
function scorePoint(board: Stone[], r: number, c: number, who: Stone): number {
  let score = 0;
  let fourCount = 0;
  let openThreeCount = 0;

  for (const [dr, dc] of DIRS) {
    const { count, openEnds } = countLine(board, r, c, dr, dc, who);
    if (count >= 5) score += 10000000;
    else if (count === 4 && openEnds === 2) { score += 1000000; fourCount++; }
    else if (count === 4 && openEnds === 1) { score += 100000; fourCount++; }
    else if (count === 3 && openEnds === 2) { score += 50000; openThreeCount++; }
    else if (count === 3 && openEnds === 1) score += 5000;
    else if (count === 2 && openEnds === 2) score += 1000;
    else if (count === 2 && openEnds === 1) score += 100;
  }

  // Double threat bonus (Double-3 / Double-4 / 4-3 kill)
  if (fourCount >= 2 || (fourCount >= 1 && openThreeCount >= 1)) score += 500000;
  else if (openThreeCount >= 2) score += 200000;

  return score;
}

// Full board static evaluation for Minimax leaf nodes
function evaluateBoard(board: Stone[], aiColor: "black" | "white"): number {
  const humanColor = aiColor === "black" ? "white" : "black";
  let aiTotal = 0;
  let humanTotal = 0;

  for (let i = 0; i < SIZE * SIZE; i++) {
    if (board[i] === null) continue;
    const r = Math.floor(i / SIZE), c = i % SIZE;
    if (board[i] === aiColor) {
      aiTotal += scorePoint(board, r, c, aiColor);
    } else if (board[i] === humanColor) {
      humanTotal += scorePoint(board, r, c, humanColor);
    }
  }

  return aiTotal - humanTotal * 1.1; // Slightly aggressive stance
}

// Get high-priority candidate moves (radius <= 2 of existing stones)
function getCandidates(board: Stone[]): number[] {
  const candidateSet = new Set<number>();
  let hasStones = false;

  for (let i = 0; i < SIZE * SIZE; i++) {
    if (board[i] === null) continue;
    hasStones = true;
    const r = Math.floor(i / SIZE), c = i % SIZE;

    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr * SIZE + nc] === null) {
          candidateSet.add(nr * SIZE + nc);
        }
      }
    }
  }

  if (!hasStones) {
    return [Math.floor(SIZE / 2) * SIZE + Math.floor(SIZE / 2)];
  }

  return Array.from(candidateSet);
}

// Minimax with Alpha-Beta Pruning (Depth 2 fast lookahead)
function minimax(
  board: Stone[],
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiColor: "black" | "white"
): number {
  if (depth === 0) {
    return evaluateBoard(board, aiColor);
  }

  const humanColor = aiColor === "black" ? "white" : "black";
  const candidates = getCandidates(board);

  if (candidates.length === 0) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const idx of candidates) {
      board[idx] = aiColor;
      if (checkWin(board, aiColor, idx)) {
        board[idx] = null;
        return 10000000; // Immediate win
      }
      const evalVal = minimax(board, depth - 1, alpha, beta, false, aiColor);
      board[idx] = null;

      maxEval = Math.max(maxEval, evalVal);
      alpha = Math.max(alpha, evalVal);
      if (beta <= alpha) break; // Beta cut-off
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const idx of candidates) {
      board[idx] = humanColor;
      if (checkWin(board, humanColor, idx)) {
        board[idx] = null;
        return -10000000; // Immediate loss
      }
      const evalVal = minimax(board, depth - 1, alpha, beta, true, aiColor);
      board[idx] = null;

      minEval = Math.min(minEval, evalVal);
      beta = Math.min(beta, evalVal);
      if (beta <= alpha) break; // Alpha cut-off
    }
    return minEval;
  }
}

// Main AI Decision Engine (With Opening Diversity & Random Jitter)
function bestAIMove(board: Stone[], aiColor: "black" | "white"): number {
  const humanColor = aiColor === "black" ? "white" : "black";
  const candidates = getCandidates(board);

  if (candidates.length === 0) return -1;

  // Count existing stones
  const stoneCount = board.filter(s => s !== null).length;

  // 1. Diverse Opening Moves (防止开局千篇一律)
  if (stoneCount === 0) {
    // First move (Black): Pick randomly from 9 center variations (7,7 and surrounds)
    const center = Math.floor(SIZE / 2);
    const openingOptions = [
      center * SIZE + center,
      (center - 1) * SIZE + center,
      (center + 1) * SIZE + center,
      center * SIZE + (center - 1),
      center * SIZE + (center + 1),
      (center - 1) * SIZE + (center - 1),
      (center + 1) * SIZE + (center + 1),
    ];
    return openingOptions[Math.floor(Math.random() * openingOptions.length)];
  }

  if (stoneCount === 1) {
    // Second move (White): Pick randomly from top defensive neighbors of the first stone
    const firstIdx = board.findIndex(s => s !== null);
    const r = Math.floor(firstIdx / SIZE), c = firstIdx % SIZE;
    const neighbors: number[] = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
          neighbors.push(nr * SIZE + nc);
        }
      }
    }
    return neighbors[Math.floor(Math.random() * neighbors.length)];
  }

  // 2. Instant Win & Critical Block Check (0ms VCF cutoff)
  for (const idx of candidates) {
    const r = Math.floor(idx / SIZE), c = idx % SIZE;

    // Can AI win immediately?
    board[idx] = aiColor;
    const aiScore = scorePoint(board, r, c, aiColor);
    board[idx] = null;
    if (aiScore >= 10000000) return idx;

    // Does Human have immediate win? Block it!
    board[idx] = humanColor;
    const humanScore = scorePoint(board, r, c, humanColor);
    board[idx] = null;
    if (humanScore >= 10000000) return idx;
  }

  // 3. Sort candidate moves by local score with micro-jitter (打破完全死板的排序)
  const scoredCandidates = candidates.map(idx => {
    const r = Math.floor(idx / SIZE), c = idx % SIZE;
    board[idx] = aiColor;
    const atk = scorePoint(board, r, c, aiColor);
    board[idx] = humanColor;
    const def = scorePoint(board, r, c, humanColor);
    board[idx] = null;
    // Add micro jitter (+-50 points) so near-equal choices get fair random picks
    const jitter = (Math.random() - 0.5) * 100;
    return { idx, score: atk * (aiColor === "black" ? 1.25 : 1.1) + def + jitter };
  });

  scoredCandidates.sort((a, b) => b.score - a.score);

  // Take top 12 candidates for Minimax deep tree search
  const topCandidates = scoredCandidates.slice(0, 12);

  const evaluatedMoves: { idx: number; evalVal: number }[] = [];

  for (const { idx } of topCandidates) {
    board[idx] = aiColor;
    const evalVal = minimax(board, 2, -Infinity, Infinity, false, aiColor);
    board[idx] = null;

    // Add tiny random jitter to evalVal to vary equal-score paths
    evaluatedMoves.push({ idx, evalVal: evalVal + (Math.random() - 0.5) * 50 });
  }

  evaluatedMoves.sort((a, b) => b.evalVal - a.evalVal);

  // Pick randomly among top 3 best moves if their scores are within 5% of max
  const maxVal = evaluatedMoves[0].evalVal;
  const bestGroup = evaluatedMoves.filter(m => maxVal - m.evalVal < 500);

  return bestGroup[Math.floor(Math.random() * bestGroup.length)].idx;
}

// ─── Winning line highlight ──────────────────────────────────────
function getWinLine(board: Stone[], who: Stone, lastIdx: number): number[] {
  const r = Math.floor(lastIdx / SIZE), c = lastIdx % SIZE;
  for (const [dr, dc] of DIRS) {
    const line = [lastIdx];
    for (let d = 1; d < 5; d++) {
      const nr = r + dr * d, nc = c + dc * d;
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE || board[nr * SIZE + nc] !== who) break;
      line.push(nr * SIZE + nc);
    }
    for (let d = 1; d < 5; d++) {
      const nr = r - dr * d, nc = c - dc * d;
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE || board[nr * SIZE + nc] !== who) break;
      line.push(nr * SIZE + nc);
    }
    if (line.length >= 5) return line;
  }
  return [];
}

// ─── Component ───────────────────────────────────────────────────
export default function Gomoku() {
  const isGameActive = useGameActivity();
  const recordedWinnerRef = useRef<Stone>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [playerColor, setPlayerColor] = useState<"black" | "white">("black");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [board, setBoard] = useState<Stone[]>(Array(SIZE * SIZE).fill(null));
  const [history, setHistory] = useState<number[]>([]);
  const [turn, setTurn] = useState<"black" | "white">("black");
  const [winner, setWinner] = useState<Stone>(null);
  const [winLine, setWinLine] = useState<number[]>([]);
  const [aiThinking, setAiThinking] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [scores, setScores] = useState({ black: 0, white: 0 });

  const aiColor = playerColor === "black" ? "white" : "black";

  const place = useCallback((idx: number, b: Stone[], t: "black" | "white"): Stone[] => {
    const next = [...b];
    next[idx] = t;
    playGameSound(t === "black" ? "gomoku-black" : "gomoku-white");
    return next;
  }, []);

  // ─── AI Step Execution (触发 AI 替下一步) ──────────────────────────
  const executeAIMove = useCallback(() => {
    if (!isGameActive || winner || aiThinking) return;

    setAiThinking(true);
    requestAnimationFrame(() => {
      const currentTurn = turn;
      const aiIdx = bestAIMove(board, currentTurn);

      if (aiIdx !== -1) {
        const nextBoard = place(aiIdx, board, currentTurn);
        const won = checkWin(nextBoard, currentTurn, aiIdx);
        setBoard(nextBoard);
        setHistory(h => [...h, aiIdx]);

        if (won) {
          setWinLine(getWinLine(nextBoard, currentTurn, aiIdx));
          setWinner(currentTurn);
          playGameSound("gomoku-victory");
          setScores(s => ({ ...s, [currentTurn]: s[currentTurn] + 1 }));
          setIsAutoPlay(false);
        } else {
          setTurn(currentTurn === "black" ? "white" : "black");
        }
      }
      setAiThinking(false);
    });
  }, [board, turn, winner, aiThinking, isGameActive, place]);

  useEffect(() => {
    if (!winner) {
      recordedWinnerRef.current = null;
      return;
    }
    if (recordedWinnerRef.current === winner) return;
    recordedWinnerRef.current = winner;
    const outcome = mode === "pve"
      ? (winner === playerColor ? "胜利" : "失利")
      : `${winner === "black" ? "黑方" : "白方"}胜利`;
    recordGameResult("gomoku", "五子棋", `${outcome} · ${history.length} 手`);
  }, [history.length, mode, playerColor, winner]);

  const startPveGame = useCallback((chosenColor: "black" | "white") => {
    const centerIdx = Math.floor(SIZE / 2) * SIZE + Math.floor(SIZE / 2);
    setPlayerColor(chosenColor);
    setMode("pve");
    setShowColorPicker(false);
    setWinner(null);
    setWinLine([]);
    setAiThinking(false);
    setIsAutoPlay(false);

    if (chosenColor === "black") {
      setBoard(Array(SIZE * SIZE).fill(null));
      setHistory([]);
      setTurn("black");
    } else {
      const initialBoard = Array(SIZE * SIZE).fill(null);
      initialBoard[centerIdx] = "black";
      setBoard(initialBoard);
      setHistory([centerIdx]);
      setTurn("white");
    }
  }, []);

  const reset = useCallback((m?: Mode) => {
    setIsAutoPlay(false);
    if (m === "pve") {
      startPveGame(playerColor);
    } else {
      setBoard(Array(SIZE * SIZE).fill(null));
      setHistory([]);
      setTurn("black");
      setWinner(null);
      setWinLine([]);
      setAiThinking(false);
      if (m !== undefined) setMode(m);
    }
  }, [playerColor, startPveGame]);

  // ─── Auto Play Loop for EvE Mode ──────────────────────────────────
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGameActive && mode === "eve_step" && isAutoPlay && !winner && !aiThinking) {
      timer = setTimeout(() => {
        executeAIMove();
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [mode, isAutoPlay, winner, aiThinking, executeAIMove, isGameActive]);

  // ─── Undo Move (悔棋) ──────────────────────────────────────────
  const undo = useCallback(() => {
    if (aiThinking) return;
    if (mode === "pve") {
      // In PvE mode, undo 2 moves (both AI and Player)
      // If player is white and only 1 move (AI opening), cannot undo
      const minHist = playerColor === "black" ? 2 : 3;
      if (history.length < minHist) return;
      const newHistory = history.slice(0, -2);
      const newBoard = Array(SIZE * SIZE).fill(null);
      newHistory.forEach((idx, i) => {
        newBoard[idx] = i % 2 === 0 ? "black" : "white";
      });
      setHistory(newHistory);
      setBoard(newBoard);
      setWinner(null);
      setWinLine([]);
      setTurn(playerColor);
    } else if (mode === "pvp") {
      // In PvP mode, undo 1 move
      if (history.length < 1) return;
      const newHistory = history.slice(0, -1);
      const newBoard = Array(SIZE * SIZE).fill(null);
      newHistory.forEach((idx, i) => {
        newBoard[idx] = i % 2 === 0 ? "black" : "white";
      });
      setHistory(newHistory);
      setBoard(newBoard);
      setWinner(null);
      setWinLine([]);
      setTurn(t => t === "black" ? "white" : "black");
    }
  }, [aiThinking, mode, history, playerColor]);

  const handleClick = useCallback((idx: number) => {
    if (!isGameActive || !mode || board[idx] || winner || aiThinking) return;
    if (mode === "pve" && turn !== playerColor) return;

    if (mode === "pve") {
      setAiThinking(true);
    }

    // 1. Place stone for current turn
    const currentTurn = turn;
    const nextTurn = currentTurn === "black" ? "white" : "black";

    const boardWithMove = place(idx, board, currentTurn);
    const hasWon = checkWin(boardWithMove, currentTurn, idx);
    const newHist = [...history, idx];
    setHistory(newHist);

    if (hasWon) {
      setBoard(boardWithMove);
      setWinLine(getWinLine(boardWithMove, currentTurn, idx));
      setWinner(currentTurn);
      playGameSound("gomoku-victory");
      setScores(s => ({ ...s, [currentTurn]: s[currentTurn] + 1 }));
      setAiThinking(false);
      setIsAutoPlay(false);
      return;
    }

    if (mode === "pve") {
      // 2. PvE Mode: Instant AI counter-move
      setBoard(boardWithMove);
      setTurn(aiColor);

      requestAnimationFrame(() => {
        const aiIdx = bestAIMove(boardWithMove, aiColor);
        if (aiIdx !== -1) {
          const boardWithAI = place(aiIdx, boardWithMove, aiColor);
          const aiWon = checkWin(boardWithAI, aiColor, aiIdx);
          setBoard(boardWithAI);
          setHistory([...newHist, aiIdx]);

          if (aiWon) {
            setBoard(boardWithAI);
            setWinLine(getWinLine(boardWithAI, aiColor, aiIdx));
            setWinner(aiColor);
            playGameSound("gomoku-victory");
            setScores(s => ({ ...s, [aiColor]: s[aiColor] + 1 }));
          } else {
            setTurn(playerColor);
          }
        }
        setAiThinking(false);
      });
    } else {
      // PvP / EvE Mode: Switch turn
      setBoard(boardWithMove);
      setTurn(nextTurn);
    }
  }, [mode, board, winner, aiThinking, turn, place, history, playerColor, aiColor, isGameActive]);

  // Last Move Index
  const lastMoveIdx = history.length > 0 ? history[history.length - 1] : null;
  const minUndoCount = mode === "pve" ? (playerColor === "black" ? 2 : 3) : 1;
  const canUndo = history.length >= minUndoCount && !aiThinking;

  // ── Mode selection screen ──
  if (!mode) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="text-center space-y-1.5 pt-2">
          <div className="flex items-center justify-center gap-1.5 py-1">
            <span className="size-5 rounded-full bg-[#1C1C1C] shadow-xs inline-block" />
            <span className="size-5 rounded-full bg-[#FAF6EE] border border-[#2D2B2C]/20 shadow-xs inline-block" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">五子棋</h3>
          <p className="text-xs sm:text-sm text-[var(--muted)]">黑白对弈，五子连珠</p>
        </div>

        {!showColorPicker ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <button
              onClick={() => setShowColorPicker(true)}
              className="flex flex-col items-center gap-2.5 p-4 sm:p-5 rounded-2xl border border-[var(--border-line-color)] hover:border-[var(--accent-green)] bg-[var(--surface)] dark:bg-[#1B2D22]/70 shadow-xs transition-all group"
            >
              <div className="flex items-center gap-2 text-[var(--accent-green)]">
                <User className="size-5" />
                <span className="text-sm font-bold font-mono">VS</span>
                <Bot className="size-5 text-[var(--accent-clay)]" />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm text-[var(--foreground)]">人机对弈</p>
                <p className="text-[11px] text-[var(--muted)] mt-0.5">挑战 Minimax 剪枝 AI</p>
              </div>
            </button>

            <button
              onClick={() => { reset("pvp"); }}
              className="flex flex-col items-center gap-2.5 p-4 sm:p-5 rounded-2xl border border-[var(--border-line-color)] hover:border-[var(--accent-green)] bg-[var(--surface)] dark:bg-[#1B2D22]/70 shadow-xs transition-all group"
            >
              <Users className="size-5 text-[var(--accent-green)]" />
              <div className="text-center">
                <p className="font-bold text-sm text-[var(--foreground)]">双人对弈</p>
                <p className="text-[11px] text-[var(--muted)] mt-0.5">与好友同屏切磋</p>
              </div>
            </button>

            <button
              onClick={() => { reset("eve_step"); }}
              className="flex flex-col items-center gap-2.5 p-4 sm:p-5 rounded-2xl border border-[var(--border-line-color)] hover:border-[var(--accent-clay)] bg-[var(--surface)] dark:bg-[#1B2D22]/70 shadow-xs transition-all group"
            >
              <div className="flex items-center gap-1.5 text-[var(--accent-clay)]">
                <Bot className="size-5" />
                <span className="text-xs font-bold font-mono">VS</span>
                <Bot className="size-5" />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm text-[var(--foreground)]">AI 军师</p>
                <p className="text-[11px] text-[var(--muted)] mt-0.5">AI 推演与模拟对弈</p>
              </div>
            </button>
          </div>
        ) : (
          /* PvE Stone Color Selection Modal/Card */
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-[var(--accent-green)]">选择执棋颜色</p>
              <p className="text-xs text-[var(--muted)]">黑棋先手落子，白棋后手落子</p>
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              <button
                onClick={() => startPveGame("black")}
                className="flex flex-col items-center gap-2.5 p-4 sm:p-5 rounded-2xl border border-[var(--border-line-color)] hover:border-[var(--accent-green)] bg-[var(--surface)] dark:bg-[#1B2D22]/70 shadow-xs transition-all group"
              >
                <div className="size-9 rounded-full bg-gradient-to-br from-[#404040] to-[#111111] shadow-md flex items-center justify-center text-white text-xs font-bold">
                  先手
                </div>
                <div className="text-center">
                  <p className="font-bold text-xs sm:text-sm text-[var(--foreground)]">执黑 (先手)</p>
                  <p className="text-[11px] text-[var(--muted)] mt-0.5">玩家先落子</p>
                </div>
              </button>

              <button
                onClick={() => startPveGame("white")}
                className="flex flex-col items-center gap-2.5 p-4 sm:p-5 rounded-2xl border border-[var(--border-line-color)] hover:border-[var(--accent-green)] bg-[var(--surface)] dark:bg-[#1B2D22]/70 shadow-xs transition-all group"
              >
                <div className="size-9 rounded-full bg-gradient-to-br from-white to-[#E0E0E0] border border-gray-300 shadow-md flex items-center justify-center text-[#2D2B2C] text-xs font-bold">
                  后手
                </div>
                <div className="text-center">
                  <p className="font-bold text-xs sm:text-sm text-[var(--foreground)]">执白 (后手)</p>
                  <p className="text-[11px] text-[var(--muted)] mt-0.5">AI 率先落子</p>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowColorPicker(false)}
              className="w-full py-2 text-xs text-[var(--muted)] hover:text-[var(--foreground)] text-center transition-colors"
            >
              ← 返回上一步
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Game screen ──
  const turnLabel = mode === "pve"
    ? (turn === playerColor ? "你的回合" : aiThinking ? "AI 思考中…" : "AI 回合")
    : (turn === "black" ? "黑棋 回合" : "白棋 回合");

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-black/[0.03] dark:bg-white/[0.04] p-2.5 sm:p-3 rounded-2xl border border-[var(--border-line-color)] backdrop-blur-xs">
        <div className="flex items-center gap-3">
          {/* Score */}
          <div className="flex items-center gap-2 text-xs font-mono bg-[var(--surface)] px-2.5 py-1 rounded-xl border border-[var(--border-line-color)] shadow-2xs">
            <span className="flex items-center gap-1">
              <span className="size-2.5 rounded-full bg-[#1C1C1C] inline-block" />
              <span className="text-[var(--foreground)] font-bold">{scores.black}</span>
            </span>
            <span className="text-[var(--muted)]">:</span>
            <span className="flex items-center gap-1">
              <span className="size-2.5 rounded-full bg-[#FAF6EE] border border-[#2D2B2C]/30 inline-block" />
              <span className="text-[var(--foreground)] font-bold">{scores.white}</span>
            </span>
          </div>
          {/* Status */}
          {!winner && (
            <span className={`text-xs px-2.5 py-1 rounded-xl font-medium border ${
              aiThinking
                ? "bg-[var(--accent-clay)]/10 text-[var(--accent-clay)] border-[var(--accent-clay)]/20 animate-pulse"
                : "bg-[var(--accent-green)]/10 text-[var(--accent-green)] border-[var(--accent-green)]/20"
            }`}>
              {turnLabel}
            </span>
          )}
          {winner && (
            <span className="text-xs px-2.5 py-1 rounded-xl font-bold bg-[var(--accent-green)] text-white shadow-2xs">
              {mode === "pve"
                ? (winner === playerColor ? "你赢了！" : "AI 获胜")
                : (winner === "black" ? "黑棋获胜" : "白棋获胜")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {/* AI Helper Step Button */}
          {!winner && (
            <button
              onClick={executeAIMove}
              disabled={aiThinking}
              title="让 AI 替当前回合下出一步"
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl border border-[var(--accent-clay)]/30 bg-[var(--accent-clay)]/10 text-[var(--accent-clay)] hover:bg-[var(--accent-clay)]/20 transition-all active:scale-95 disabled:opacity-50 shadow-2xs"
            >
              <Sparkles className="size-3.5" />
              <span>AI 提示</span>
            </button>
          )}

          {/* EvE AutoPlay Toggle */}
          {mode === "eve_step" && !winner && (
            <button
              onClick={() => setIsAutoPlay(p => !p)}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl border transition-all shadow-2xs ${
                isAutoPlay
                  ? "bg-[var(--accent-green)] text-white border-[var(--accent-green)] animate-pulse"
                  : "border-[var(--border-line-color)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-black/5"
              }`}
            >
              {isAutoPlay ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              <span>{isAutoPlay ? "暂停" : "自动推演"}</span>
            </button>
          )}

          {/* Undo Button (悔棋) */}
          <button
            onClick={undo}
            disabled={!canUndo}
            title="悔棋"
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl border transition-all shadow-2xs ${
              canUndo
                ? "border-[var(--border-line-color)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-black/5 active:scale-95"
                : "border-transparent text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50"
            }`}
          >
            <Undo2 className="size-3.5" />
            <span>悔棋</span>
          </button>
          <button
            onClick={() => setMode(null)}
            className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] px-2.5 py-1 rounded-xl border border-[var(--border-line-color)] bg-[var(--surface)] hover:bg-black/5 transition-all shadow-2xs"
          >
            换模式
          </button>
          <button
            onClick={() => reset(mode)}
            title="重开"
            className="p-1.5 rounded-xl border border-[var(--border-line-color)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/5 transition-all active:scale-95 shadow-2xs"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Standard 15x15 Gomoku Board — Natural Kaya Wood Grain */}
      <div className="overflow-x-auto pb-2 flex justify-center">
        <div
          className="relative mx-auto select-none rounded-2xl p-6 sm:p-7 border-4 border-[#A57849] dark:border-[#523A22] overflow-hidden"
          style={{
            width: SIZE * 28 + 36,
            height: SIZE * 28 + 36,
            background: "#F3DEBD",
            backgroundImage: `
              repeating-linear-gradient(90deg, transparent, transparent 38px, rgba(160, 115, 65, 0.05) 39px, transparent 40px),
              radial-gradient(ellipse at 50% 50%, #F8E8D0 0%, #EED4AA 75%, #E4C596 100%)
            `,
            boxShadow: "0 20px 48px rgba(75, 45, 15, 0.22), 0 4px 12px rgba(50, 30, 10, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.7), inset 0 -2px 3px rgba(120, 70, 20, 0.2)",
          }}
        >
          {/* SVG Standard Grid Lines, Double Outer Frame, 5 Star Points, Coordinates */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={SIZE * 28 + 36}
            height={SIZE * 28 + 36}
          >
            {/* Outer Double Frame Line */}
            <rect
              x="12"
              y="12"
              width={SIZE * 28 + 12}
              height={SIZE * 28 + 12}
              fill="none"
              stroke="#9A6B3C"
              strokeWidth="2"
              rx="2"
            />
            <rect
              x="15"
              y="15"
              width={SIZE * 28 + 6}
              height={SIZE * 28 + 6}
              fill="none"
              stroke="#1C442D"
              strokeWidth="1"
            />

            {/* 15x15 Grid Lines in Dark Pine Green */}
            {Array.from({ length: SIZE }).map((_, i) => {
              const pos = 18 + i * 28;
              return (
                <g key={i}>
                  {/* Vertical Line */}
                  <line
                    x1={pos}
                    y1={18}
                    x2={pos}
                    y2={18 + (SIZE - 1) * 28}
                    stroke="#1C442D"
                    strokeWidth="1.2"
                  />
                  {/* Horizontal Line */}
                  <line
                    x1={18}
                    y1={pos}
                    x2={18 + (SIZE - 1) * 28}
                    y2={pos}
                    stroke="#1C442D"
                    strokeWidth="1.2"
                  />
                </g>
              );
            })}

            {/* 5 Standard Star Points (天元 (7,7) & 四角星 (3,3),(11,3),(3,11),(11,11)) */}
            {[[3, 3], [3, 11], [7, 7], [11, 3], [11, 11]].map(([r, c]) => (
              <g key={`star-${r}-${c}`}>
                <circle
                  cx={18 + c * 28}
                  cy={18 + r * 28}
                  r="3.2"
                  fill="#1C442D"
                />
              </g>
            ))}

            {/* Coordinate Labels: Top/Bottom A-O, Left/Right 15-1 */}
            {Array.from({ length: SIZE }).map((_, i) => {
              const pos = 18 + i * 28;
              const colLabel = String.fromCharCode(65 + (i >= 8 ? i + 1 : i)); // A-O (Skip I as per Go/Renju rules)
              const rowLabel = (15 - i).toString();

              return (
                <g key={`label-${i}`} fill="#8A643B" fontSize="9" fontWeight="bold" fontFamily="serif">
                  {/* Top Column Label */}
                  <text x={pos} y="9" textAnchor="middle">{colLabel}</text>
                  {/* Bottom Column Label */}
                  <text x={pos} y={SIZE * 28 + 31} textAnchor="middle">{colLabel}</text>
                  {/* Left Row Label */}
                  <text x="6" y={pos + 3} textAnchor="middle">{rowLabel}</text>
                  {/* Right Row Label */}
                  <text x={SIZE * 28 + 30} y={pos + 3} textAnchor="middle">{rowLabel}</text>
                </g>
              );
            })}
          </svg>

          {/* Cells (intersection clicks) with 3D Slate & Clamshell Stones */}
          {board.map((stone, idx) => {
            const r = Math.floor(idx / SIZE), c = idx % SIZE;
            const isWinCell = winLine.includes(idx);
            const isLastMove = idx === lastMoveIdx;

            return (
              <div
                key={idx}
                onClick={() => handleClick(idx)}
                className={`absolute flex items-center justify-center transition-transform duration-100 ${
                  !stone && !winner && !(mode === "pve" && turn === "white")
                    ? "cursor-pointer hover:scale-110"
                    : "cursor-default"
                }`}
                style={{
                  left: 18 + c * 28 - 12,
                  top: 18 + r * 28 - 12,
                  width: 24, height: 24,
                }}
              >
                {stone && (
                  <div
                    className={`relative size-5 sm:size-5.5 rounded-full flex items-center justify-center transition-all ${
                      isWinCell ? "ring-4 ring-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.8)] scale-110 animate-pulse" : ""
                    }`}
                    style={{
                      background: stone === "black"
                        ? "radial-gradient(circle at 35% 32%, #4A4A4A 0%, #202020 55%, #0D0D0D 100%)"
                        : "radial-gradient(circle at 35% 32%, #FFFFFF 0%, #F5F2EC 55%, #DDD6C8 100%)",
                      boxShadow: stone === "black"
                        ? "0 3px 7px rgba(0,0,0,0.55), inset 0 1px 2px rgba(255,255,255,0.35), inset 0 -1px 2px rgba(0,0,0,0.6)"
                        : "0 3px 7px rgba(70,45,20,0.35), inset 0 2px 2px rgba(255,255,255,0.95), inset 0 -1px 2px rgba(160,140,110,0.3)",
                      border: stone === "black" ? "0.5px solid rgba(0,0,0,0.8)" : "0.5px solid rgba(180,160,130,0.4)",
                    }}
                  >
                    {/* Last Move Indicator Dot */}
                    {isLastMove && !isWinCell && (
                      <span className="relative flex h-2 w-2 items-center justify-center">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          stone === "black" ? "bg-amber-400" : "bg-red-600"
                        }`} />
                        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                          stone === "black" ? "bg-amber-400" : "bg-red-600"
                        }`} />
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-[10px] text-[#B0A99F] dark:text-[#4A6B55] font-mono">
        {mode === "eve_step"
          ? "AI 军师推演模式 · 可随时点【AI 下一步】或由你插手落子"
          : mode === "pve"
          ? (playerColor === "black" ? "你执黑先行 · 可随时点【AI 下一步】助攻" : "你执白后手 · AI 执黑先手 · 可点【AI 下一步】助攻")
          : "双人同台对弈 · 任意时刻可点【AI 下一步】军师帮下"}
      </p>
    </div>
  );
}
