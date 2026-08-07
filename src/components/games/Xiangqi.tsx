"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { RefreshCw, RotateCcw, User, Bot, Play, Pause, Sparkles, Award } from "lucide-react";

// --- Xiangqi Types & Constants ---
type PieceType = "r" | "n" | "b" | "a" | "k" | "c" | "p"; // rook, knight(horse), bishop(elephant), advisor, king, cannon, pawn
type Side = "red" | "black";

interface Piece {
  type: PieceType;
  side: Side;
}

// 9 columns x 10 rows grid (0..8 x, 0..9 y)
type Board = (Piece | null)[][];

interface Move {
  from: [number, number];
  to: [number, number];
  captured?: Piece | null;
}

// Piece Values for Evaluation
const PIECE_VALUES: Record<PieceType, number> = {
  k: 10000,
  r: 1000,
  c: 450,
  n: 400,
  b: 200,
  a: 200,
  p: 100,
};

// Initial Xiangqi Setup
const INITIAL_BOARD: (string | null)[][] = [
  ["r_r", "r_n", "r_b", "r_a", "r_k", "r_a", "r_b", "r_n", "r_r"], // y=0 (black top)
  [null, null, null, null, null, null, null, null, null],
  [null, "r_c", null, null, null, null, null, "r_c", null],
  ["r_p", null, "r_p", null, "r_p", null, "r_p", null, "r_p"],
  [null, null, null, null, null, null, null, null, null],
  // --- River --- (y=4 to y=5)
  [null, null, null, null, null, null, null, null, null],
  ["red_p", null, "red_p", null, "red_p", null, "red_p", null, "red_p"],
  [null, "red_c", null, null, null, null, null, "red_c", null],
  [null, null, null, null, null, null, null, null, null],
  ["red_r", "red_n", "red_b", "red_a", "red_k", "red_a", "red_b", "red_n", "red_r"], // y=9 (red bottom)
];

function createInitialBoard(): Board {
  const board: Board = Array(10).fill(null).map(() => Array(9).fill(null));
  
  // Black pieces at top (y=0..3)
  const bRow0: PieceType[] = ["r", "n", "b", "a", "k", "a", "b", "n", "r"];
  bRow0.forEach((type, x) => { board[0][x] = { type, side: "black" }; });
  board[2][1] = { type: "c", side: "black" };
  board[2][7] = { type: "c", side: "black" };
  [0, 2, 4, 6, 8].forEach((x) => { board[3][x] = { type: "p", side: "black" }; });

  // Red pieces at bottom (y=6..9)
  const rRow9: PieceType[] = ["r", "n", "b", "a", "k", "a", "b", "n", "r"];
  rRow9.forEach((type, x) => { board[9][x] = { type, side: "red" }; });
  board[7][1] = { type: "c", side: "red" };
  board[7][7] = { type: "c", side: "red" };
  [0, 2, 4, 6, 8].forEach((x) => { board[6][x] = { type: "p", side: "red" }; });

  return board;
}

// Chinese labels for display
const PIECE_NAMES: Record<Side, Record<PieceType, string>> = {
  red: { k: "帥", a: "仕", b: "相", n: "馬", r: "車", c: "砲", p: "兵" },
  black: { k: "將", a: "士", b: "象", n: "馬", r: "車", c: "砲", p: "卒" },
};

// Check inside palace
function inPalace(x: number, y: number, side: Side): boolean {
  if (x < 3 || x > 5) return false;
  if (side === "black") return y >= 0 && y <= 2;
  return y >= 7 && y <= 9;
}

// Check if Red King and Black King face each other directly in the same column without pieces between them (照面/飞将)
function isFlyingGeneral(board: Board): boolean {
  let redKingPos: [number, number] | null = null;
  let blackKingPos: [number, number] | null = null;

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece?.type === "k") {
        if (piece.side === "red") redKingPos = [x, y];
        if (piece.side === "black") blackKingPos = [x, y];
      }
    }
  }

  if (!redKingPos || !blackKingPos) return false;
  if (redKingPos[0] !== blackKingPos[0]) return false;

  const col = redKingPos[0];
  const minY = Math.min(redKingPos[1], blackKingPos[1]);
  const maxY = Math.max(redKingPos[1], blackKingPos[1]);

  for (let y = minY + 1; y < maxY; y++) {
    if (board[y][col] !== null) return false; // Has blocking piece
  }

  return true; // Flying general violation!
}

// Apply move to board
function makeMove(board: Board, move: Move): Board {
  const newBoard = board.map((row) => [...row]);
  const [fx, fy] = move.from;
  const [tx, ty] = move.to;
  newBoard[ty][tx] = newBoard[fy][fx];
  newBoard[fy][fx] = null;
  return newBoard;
}

// Candidate move generator for a given board
function getRawMoves(board: Board, side: Side): Move[] {
  const moves: Move[] = [];

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (!piece || piece.side !== side) continue;

      const { type } = piece;

      // 1. King (General)
      if (type === "k") {
        const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        dirs.forEach(([dx, dy]) => {
          const nx = x + dx, ny = y + dy;
          if (inPalace(nx, ny, side)) {
            const target = board[ny][nx];
            if (!target || target.side !== side) moves.push({ from: [x, y], to: [nx, ny], captured: target });
          }
        });
      }

      // 2. Advisor
      else if (type === "a") {
        const dirs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        dirs.forEach(([dx, dy]) => {
          const nx = x + dx, ny = y + dy;
          if (inPalace(nx, ny, side)) {
            const target = board[ny][nx];
            if (!target || target.side !== side) moves.push({ from: [x, y], to: [nx, ny], captured: target });
          }
        });
      }

      // 3. Elephant (Bishop) - Cannot cross river, check eye
      else if (type === "b") {
        const dirs = [[2, 2], [2, -2], [-2, 2], [-2, -2]];
        dirs.forEach(([dx, dy]) => {
          const nx = x + dx, ny = y + dy;
          const eyeX = x + dx / 2, eyeY = y + dy / 2;
          const isCrossRiver = side === "red" ? ny < 5 : ny > 4;
          if (nx >= 0 && nx < 9 && ny >= 0 && ny < 10 && !isCrossRiver && !board[eyeY][eyeX]) {
            const target = board[ny][nx];
            if (!target || target.side !== side) moves.push({ from: [x, y], to: [nx, ny], captured: target });
          }
        });
      }

      // 4. Horse (Knight) - Check horse leg
      else if (type === "n") {
        const jumps = [
          { step: [0, -1], to: [[-1, -2], [1, -2]] },
          { step: [0, 1], to: [[-1, 2], [1, 2]] },
          { step: [-1, 0], to: [[-2, -1], [-2, 1]] },
          { step: [1, 0], to: [[2, -1], [2, 1]] },
        ];
        jumps.forEach(({ step, to }) => {
          const legX = x + step[0], legY = y + step[1];
          if (legX >= 0 && legX < 9 && legY >= 0 && legY < 10 && !board[legY][legX]) {
            to.forEach(([dx, dy]) => {
              const nx = x + dx, ny = y + dy;
              if (nx >= 0 && nx < 9 && ny >= 0 && ny < 10) {
                const target = board[ny][nx];
                if (!target || target.side !== side) moves.push({ from: [x, y], to: [nx, ny], captured: target });
              }
            });
          }
        });
      }

      // 5. Rook (Chariot)
      else if (type === "r") {
        const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        dirs.forEach(([dx, dy]) => {
          let nx = x + dx, ny = y + dy;
          while (nx >= 0 && nx < 9 && ny >= 0 && ny < 10) {
            const target = board[ny][nx];
            if (!target) {
              moves.push({ from: [x, y], to: [nx, ny], captured: null });
            } else {
              if (target.side !== side) moves.push({ from: [x, y], to: [nx, ny], captured: target });
              break;
            }
            nx += dx;
            ny += dy;
          }
        });
      }

      // 6. Cannon (Cannon)
      else if (type === "c") {
        const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        dirs.forEach(([dx, dy]) => {
          let nx = x + dx, ny = y + dy;
          let jumped = false;
          while (nx >= 0 && nx < 9 && ny >= 0 && ny < 10) {
            const target = board[ny][nx];
            if (!jumped) {
              if (!target) {
                moves.push({ from: [x, y], to: [nx, ny], captured: null });
              } else {
                jumped = true;
              }
            } else {
              if (target) {
                if (target.side !== side) moves.push({ from: [x, y], to: [nx, ny], captured: target });
                break;
              }
            }
            nx += dx;
            ny += dy;
          }
        });
      }

      // 7. Pawn (Soldier)
      else if (type === "p") {
        const dirY = side === "red" ? -1 : 1;
        const hasCrossed = side === "red" ? y <= 4 : y >= 5;

        // Forward
        const fy = y + dirY;
        if (fy >= 0 && fy < 10) {
          const target = board[fy][x];
          if (!target || target.side !== side) moves.push({ from: [x, y], to: [x, fy], captured: target });
        }

        // Sideways if crossed river
        if (hasCrossed) {
          [-1, 1].forEach((dx) => {
            const nx = x + dx;
            if (nx >= 0 && nx < 9) {
              const target = board[y][nx];
              if (!target || target.side !== side) moves.push({ from: [x, y], to: [nx, y], captured: target });
            }
          });
        }
      }
    }
  }

  return moves;
}

// Legal move generator filtering out moves that cause flying general (将帅照面)
function getLegalMoves(board: Board, side: Side): Move[] {
  const rawMoves = getRawMoves(board, side);
  return rawMoves.filter((m) => {
    const nextBoard = makeMove(board, m);
    return !isFlyingGeneral(nextBoard);
  });
}
// Evaluate board score for Red (+) vs Black (-)
function evaluateBoard(board: Board): number {
  let score = 0;
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (!piece) continue;
      let val = PIECE_VALUES[piece.type];

      // Positional Bonuses
      if (piece.type === "p") {
        const crossed = piece.side === "red" ? y <= 4 : y >= 5;
        if (crossed) val += 80; // Pawn crossed river is dangerous
      } else if (piece.type === "r" || piece.type === "c") {
        // Control center files
        if (x >= 3 && x <= 5) val += 30;
      } else if (piece.type === "n") {
        // Advanced knights
        if (piece.side === "red" && y <= 6) val += 30;
        if (piece.side === "black" && y >= 3) val += 30;
      }

      if (piece.side === "red") score += val;
      else score -= val;
    }
  }
  return score;
}

// Minimax with Alpha-Beta Pruning (Depth 2-3)
function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): { score: number; move: Move | null } {
  if (depth === 0) {
    // Add small random jitter so AI doesn't play identical games
    const jitter = (Math.random() - 0.5) * 6;
    return { score: evaluateBoard(board) + jitter, move: null };
  }

  const currentSide: Side = isMaximizing ? "red" : "black";
  const legalMoves = getLegalMoves(board, currentSide);

  if (legalMoves.length === 0) {
    return { score: isMaximizing ? -99999 : 99999, move: null };
  }

  // Move ordering: evaluate capture moves first to optimize alpha-beta pruning
  legalMoves.sort((a, b) => {
    const valA = a.captured ? PIECE_VALUES[a.captured.type] : 0;
    const valB = b.captured ? PIECE_VALUES[b.captured.type] : 0;
    return valB - valA;
  });

  let bestMove: Move | null = legalMoves[0];

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of legalMoves) {
      const nextBoard = makeMove(board, move);
      const { score } = minimax(nextBoard, depth - 1, alpha, beta, false);
      if (score > maxEval) {
        maxEval = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break; // Alpha-beta cutoff
    }
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    for (const move of legalMoves) {
      const nextBoard = makeMove(board, move);
      const { score } = minimax(nextBoard, depth - 1, alpha, beta, true);
      if (score < minEval) {
        minEval = score;
        bestMove = move;
      }
      beta = Math.min(beta, score);
      if (beta <= alpha) break; // Alpha-beta cutoff
    }
    return { score: minEval, move: bestMove };
  }
}

// --- Component ---
export default function Xiangqi() {
  const [mode, setMode] = useState<"pve" | "pvp" | "eve" | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [userSide, setUserSide] = useState<Side>("red");
  
  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [turn, setTurn] = useState<Side>("red");
  const [selectedPos, setSelectedPos] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [history, setHistory] = useState<{ board: Board; turn: Side; lastMove: Move | null }[]>([]);
  const [lastMove, setLastMove] = useState<Move | null>(null);

  const [status, setStatus] = useState<"playing" | "red_win" | "black_win">("playing");
  const [autoPlayEve, setAutoPlayEve] = useState(false);
  const [thinking, setThinking] = useState(false);

  // Reset Game
  const resetGame = useCallback((chosenMode?: "pve" | "pvp" | "eve", side: Side = "red") => {
    const newBoard = createInitialBoard();
    setBoard(newBoard);
    setTurn("red");
    setSelectedPos(null);
    setValidMoves([]);
    setHistory([]);
    setLastMove(null);
    setStatus("playing");
    setThinking(false);
    setAutoPlayEve(false);
    setShowColorPicker(false);
    if (chosenMode) setMode(chosenMode);
  }, []);

  const startPveGame = useCallback((side: Side) => {
    setUserSide(side);
    resetGame("pve", side);
  }, [resetGame]);

  // Check Game Winner
  const checkWinner = (b: Board) => {
    let redKing = false;
    let blackKing = false;
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
        const p = b[y][x];
        if (p?.type === "k") {
          if (p.side === "red") redKing = true;
          if (p.side === "black") blackKing = true;
        }
      }
    }
    if (!redKing) return "black_win";
    if (!blackKing) return "red_win";
    return "playing";
  };

  // Perform Move
  const executeMove = useCallback(
    (move: Move) => {
      setHistory((prev) => [...prev, { board, turn, lastMove }]);
      const nextBoard = makeMove(board, move);
      setBoard(nextBoard);
      setLastMove(move);
      setSelectedPos(null);
      setValidMoves([]);

      const nextStatus = checkWinner(nextBoard);
      if (nextStatus !== "playing") {
        setStatus(nextStatus);
        return;
      }

      setTurn((prev) => (prev === "red" ? "black" : "red"));
    },
    [board, turn, lastMove]
  );

  // Trigger AI Move
  const triggerAiMove = useCallback(() => {
    if (status !== "playing" || thinking) return;

    setThinking(true);
    setTimeout(() => {
      const isMax = turn === "red";
      const { move } = minimax(board, 2, -Infinity, Infinity, isMax);
      setThinking(false);

      if (move) {
        executeMove(move);
      }
    }, 150);
  }, [board, turn, status, thinking, executeMove]);

  // Handle AI turn trigger for PvE (when AI's turn) or EvE auto play
  useEffect(() => {
    if (status !== "playing" || !mode) return;
    if (mode === "pve" && turn !== userSide) {
      triggerAiMove();
    } else if (mode === "eve" && autoPlayEve) {
      const timer = setTimeout(() => {
        triggerAiMove();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [mode, turn, userSide, status, autoPlayEve, triggerAiMove]);

  // Player click handler: In EvE mode, player can manually move BOTH Red and Black pieces!
  const handleCellClick = (x: number, y: number) => {
    if (status !== "playing" || !mode) return;

    // In PvE mode, restrict clicks only to user's side when it's user's turn
    if (mode === "pve" && turn !== userSide) return;

    const clickedPiece = board[y][x];

    // Select piece of current turn's side (In EvE / PvP, allows selecting whoever's turn it is)
    if (clickedPiece && clickedPiece.side === turn) {
      setSelectedPos([x, y]);
      const allMoves = getLegalMoves(board, turn);
      const filtered = allMoves.filter((m) => m.from[0] === x && m.from[1] === y);
      setValidMoves(filtered);
      return;
    }

    // Move to targeted position if selected
    if (selectedPos) {
      const targetMove = validMoves.find((m) => m.to[0] === x && m.to[1] === y);
      if (targetMove) {
        executeMove(targetMove);
      } else {
        setSelectedPos(null);
        setValidMoves([]);
      }
    }
  };

  // Undo Move (悔棋)
  const handleUndo = () => {
    if (history.length === 0 || thinking) return;

    let stepsToUndo = 1;
    if (mode === "pve" && history.length >= 2) {
      stepsToUndo = 2;
    }

    const targetHistoryIndex = history.length - stepsToUndo;
    const targetState = history[targetHistoryIndex];

    setBoard(targetState.board);
    setTurn(targetState.turn);
    setLastMove(targetState.lastMove);
    setHistory(history.slice(0, targetHistoryIndex));
    setSelectedPos(null);
    setValidMoves([]);
    setStatus("playing");
  };

  // ── Mode selection initial overlay ──────────────────────────────
  if (!mode) {
    return (
      <div className="bg-white dark:bg-[#1E2721]/50 rounded-3xl p-6 sm:p-8 border border-[#2D2B2C]/6 dark:border-white/8 shadow-[0_4px_24px_rgba(45,43,44,0.05)] space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FDEEE9] dark:bg-[#38231C] text-[#8C4A31] dark:text-[#E5987D] text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>中国象棋 (Xiangqi AI)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2D2B2C] dark:text-[#F0F5F1]">
            选择对弈模式
          </h2>
          <p className="text-xs sm:text-sm text-[#7A736A] dark:text-[#9EB3A4] max-w-sm mx-auto">
            楚河汉界，运筹帷幄。内置 Minimax 剪枝 AI 引擎。
          </p>
        </div>

        {!showColorPicker ? (
          /* Mode Options Grid */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setShowColorPicker(true)}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-[#36513B]/20 hover:border-[#36513B] bg-[#FAF7F2] dark:bg-[#23382C] hover:bg-[#E2EBE4] dark:hover:bg-[#2D4A35] transition-all group"
            >
              <User className="w-6 h-6 text-[#36513B] group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <p className="font-bold text-[#2D2B2C] dark:text-[#F0F5F1]">单人对弈</p>
                <p className="text-[11px] text-[#7A736A] dark:text-[#9EB3A4] mt-0.5">挑战 Minimax 象棋 AI</p>
              </div>
            </button>

            <button
              onClick={() => resetGame("pvp")}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-[#36513B]/20 hover:border-[#36513B] bg-[#FAF7F2] dark:bg-[#23382C] hover:bg-[#E2EBE4] dark:hover:bg-[#2D4A35] transition-all group"
            >
              <User className="w-6 h-6 text-[#36513B] group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <p className="font-bold text-[#2D2B2C] dark:text-[#F0F5F1]">双人模式</p>
                <p className="text-[11px] text-[#7A736A] dark:text-[#9EB3A4] mt-0.5">与好友同台切磋</p>
              </div>
            </button>

            <button
              onClick={() => resetGame("eve")}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-[#8C4A31]/30 hover:border-[#8C4A31] bg-[#FDEEE9] dark:bg-[#38231C] hover:bg-[#F8E3DC] dark:hover:bg-[#4A2D23] transition-all group"
            >
              <Bot className="w-6 h-6 text-[#8C4A31] group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <p className="font-bold text-[#2D2B2C] dark:text-[#F0F5F1]">AI 军师模式</p>
                <p className="text-[11px] text-[#8C4A31] dark:text-[#E5987D] mt-0.5">可自选操控 + AI替下</p>
              </div>
            </button>
          </div>
        ) : (
          /* PvE Piece Color Selection */
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-[#36513B] dark:text-[#7CD090]">请选择你的执棋阵营</p>
              <p className="text-xs text-[#7A736A] dark:text-[#9EB3A4]">红方先手落子，黑方后手落子</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => startPveGame("red")}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-red-600 hover:scale-105 bg-[#FAF7F2] dark:bg-[#23382C] transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-red-600 shadow-md flex items-center justify-center text-white text-xs font-bold">
                  先手
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#C82A2A] dark:text-red-400">执红棋 🔴</p>
                  <p className="text-[11px] text-[#7A736A] dark:text-[#9EB3A4] mt-0.5">优先执红先行</p>
                </div>
              </button>

              <button
                onClick={() => startPveGame("black")}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-[#2D2B2C] hover:scale-105 bg-[#FAF7F2] dark:bg-[#23382C] transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-[#2D2B2C] shadow-md flex items-center justify-center text-white text-xs font-bold">
                  后手
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#2D2B2C] dark:text-[#F0F5F1]">执黑棋 ⬛</p>
                  <p className="text-[11px] text-[#7A736A] dark:text-[#9EB3A4] mt-0.5">AI 率先执红落子</p>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowColorPicker(false)}
              className="w-full py-2 text-xs text-[#7A736A] dark:text-[#9EB3A4] hover:text-[#2D2B2C] text-center font-mono"
            >
              ← 返回上一步
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1E2721]/50 rounded-3xl p-6 border border-[#2D2B2C]/6 dark:border-white/8 shadow-[0_4px_24px_rgba(45,43,44,0.05)] space-y-6">
      {/* Side Color & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-[#FAF7F2] dark:bg-[#24221F] p-3 rounded-2xl border border-[#2D2B2C]/6 dark:border-white/10">
        {/* Status Indicator */}
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-[#7A736A] dark:text-[#9EB3A4]">回合:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold shadow-2xs ${
              turn === "red"
                ? "bg-red-600 text-white border border-red-700"
                : "bg-[#2D2B2C] text-white border border-black"
            }`}
          >
            {turn === "red" ? "🔴 红方 (先手)" : "⬛ 黑方 (后手)"}
          </span>

          {thinking && (
            <span className="flex items-center gap-1 text-[#8C4A31] dark:text-[#E5987D] font-bold animate-pulse ml-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI 思考演算中...</span>
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {mode === "pve" && (
            <div className="flex items-center gap-1 bg-white dark:bg-[#1E2721] px-2 py-1 rounded-xl border border-[#2D2B2C]/8 dark:border-white/10 shadow-2xs">
              <span className="text-[11px] font-semibold text-[#7A736A] dark:text-[#9EB3A4]">玩家持棋:</span>
              <button
                onClick={() => { setUserSide("red"); resetGame(); }}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                  userSide === "red" ? "bg-red-600 text-white shadow-2xs" : "text-[#7A736A] hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
              >
                执红 (先手)
              </button>
              <button
                onClick={() => { setUserSide("black"); resetGame(); }}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                  userSide === "black" ? "bg-[#2D2B2C] text-white shadow-2xs" : "text-[#7A736A] hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
              >
                执黑 (后手)
              </button>
            </div>
          )}

          {mode === "eve" && (
            <>
              <button
                onClick={triggerAiMove}
                disabled={thinking || status !== "playing"}
                className="px-3 py-1.5 rounded-xl bg-[#36513B] dark:bg-[#7CD090] text-white dark:text-[#142219] font-bold hover:scale-105 active:scale-95 transition-all shadow-xs disabled:opacity-50"
              >
                AI 替下一步
              </button>
              <button
                onClick={() => setAutoPlayEve(!autoPlayEve)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shadow-xs ${
                  autoPlayEve
                    ? "bg-[#8C4A31] text-white"
                    : "bg-white dark:bg-[#1E2721] text-[#2D2B2C] dark:text-[#F0F5F1] border border-[#2D2B2C]/10 dark:border-white/10"
                }`}
              >
                {autoPlayEve ? <Pause className="w-3.5 h-3.5 inline mr-1" /> : <Play className="w-3.5 h-3.5 inline mr-1" />}
                {autoPlayEve ? "暂停自动" : "自动对弈"}
              </button>
            </>
          )}

          <button
            onClick={handleUndo}
            disabled={history.length === 0 || thinking}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E2721] border border-[#2D2B2C]/10 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 font-bold transition-all disabled:opacity-40 shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#8C4A31]" />
            <span>悔棋</span>
          </button>

          <button
            onClick={() => resetGame()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E2721] border border-[#2D2B2C]/10 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 font-bold transition-all shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#36513B]" />
            <span>重开</span>
          </button>
        </div>
      </div>

      {/* Xiangqi Board (Wood Wabi-Sabi Styling) */}
      <div className="relative mx-auto max-w-lg aspect-[9/10] bg-[#E8D4B0] dark:bg-[#2A231A] rounded-2xl p-4 sm:p-6 shadow-inner border-4 border-[#8C6D46] dark:border-[#423321] select-none overflow-hidden">
        {/* River Separator */}
        <div className="absolute left-4 right-4 top-[48%] -translate-y-1/2 h-10 border-y border-[#A88B5E]/60 flex items-center justify-around text-[#7C633E] dark:text-[#9E8256] font-serif font-bold text-sm tracking-[1.5em] pointer-events-none">
          <span>楚河</span>
          <span>漢界</span>
        </div>

        {/* 9x10 Grid Overlay */}
        <div className="relative w-full h-full grid grid-cols-9 grid-rows-10">
          {board.map((row, y) =>
            row.map((piece, x) => {
              const isSelected = selectedPos?.[0] === x && selectedPos?.[1] === y;
              const isValidMoveTarget = validMoves.some((m) => m.to[0] === x && m.to[1] === y);
              const isLastMoveFrom = lastMove?.from[0] === x && lastMove?.from[1] === y;
              const isLastMoveTo = lastMove?.to[0] === x && lastMove?.to[1] === y;

              return (
                <div
                  key={`${x}-${y}`}
                  onClick={() => handleCellClick(x, y)}
                  className="relative flex items-center justify-center cursor-pointer group"
                >
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Vertical Line */}
                    {y !== 4 || x === 0 || x === 8 ? (
                      <div className="w-px h-full bg-[#B89B6E] dark:bg-[#52422F]" />
                    ) : null}
                    {/* Horizontal Line */}
                    <div className="h-px w-full bg-[#B89B6E] dark:bg-[#52422F] absolute" />
                  </div>

                  {/* Last move trajectory highlight */}
                  {(isLastMoveFrom || isLastMoveTo) && (
                    <div className="absolute inset-1 rounded-full border-2 border-dashed border-[#8C4A31] animate-pulse pointer-events-none" />
                  )}

                  {/* Target Move Indicator Dot */}
                  {isValidMoveTarget && (
                    <div className="z-20 w-3.5 h-3.5 rounded-full bg-[#36513B] opacity-80 animate-ping" />
                  )}

                  {/* Piece Disc */}
                  {piece && (
                    <div
                      className={`z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-base sm:text-lg shadow-md transition-transform duration-150 ${
                        isSelected
                          ? "scale-110 ring-4 ring-[#8C4A31]"
                          : "hover:scale-105"
                      } ${
                        piece.side === "red"
                          ? "bg-[#FDFBF7] text-[#C82A2A] border-2 border-[#C82A2A] shadow-[inset_0_2px_4px_rgba(200,42,42,0.2)]"
                          : "bg-[#2D2B2C] text-[#F0F5F1] border-2 border-[#1A1819] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]"
                      }`}
                    >
                      {PIECE_NAMES[piece.side][piece.type]}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* GameOver Overlay */}
        {status !== "playing" && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-200">
            <h3 className="text-2xl font-bold text-white">
              {status === "red_win" ? "🎉 绝杀！红方胜出！" : "🎉 绝杀！黑方胜出！"}
            </h3>
            <p className="text-xs text-gray-300">
              {status === "red_win" ? "帅统六合，红棋大获全胜" : "将定乾坤，黑棋克敌制胜"}
            </p>
            <button
              onClick={() => resetGame()}
              className="px-6 py-2.5 rounded-2xl bg-[#36513B] text-white font-bold hover:scale-105 transition-all shadow-md"
            >
              再来一局
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
