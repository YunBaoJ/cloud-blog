"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, RotateCcw, User, Bot, Award, Sparkles, Play, Pause, AlertTriangle } from "lucide-react";

// --- Xiangqi Types & Constants ---
type PieceType = "r" | "n" | "b" | "a" | "k" | "c" | "p"; // rook(车), knight(马), bishop(象/相), advisor(士/仕), king(将/帅), cannon(炮), pawn(卒/兵)
type Side = "red" | "black";

interface Piece {
  type: PieceType;
  side: Side;
}

// 9 columns (0..8) x 10 rows (0..9) board
type Board = (Piece | null)[][];

interface Move {
  from: [number, number];
  to: [number, number];
  captured?: Piece | null;
}

const PIECE_VALUES: Record<PieceType, number> = {
  k: 10000,
  r: 1000,
  c: 450,
  n: 400,
  b: 200,
  a: 200,
  p: 100,
};

const PIECE_NAMES: Record<Side, Record<PieceType, string>> = {
  red: { k: "帥", a: "仕", b: "相", n: "馬", r: "車", c: "砲", p: "兵" },
  black: { k: "將", a: "士", b: "象", n: "馬", r: "車", c: "砲", p: "卒" },
};

function createInitialBoard(): Board {
  const board: Board = Array(10).fill(null).map(() => Array(9).fill(null));

  // Black pieces (Top: y=0..3)
  const bRow0: PieceType[] = ["r", "n", "b", "a", "k", "a", "b", "n", "r"];
  bRow0.forEach((type, x) => { board[0][x] = { type, side: "black" }; });
  board[2][1] = { type: "c", side: "black" };
  board[2][7] = { type: "c", side: "black" };
  [0, 2, 4, 6, 8].forEach((x) => { board[3][x] = { type: "p", side: "black" }; });

  // Red pieces (Bottom: y=6..9)
  const rRow9: PieceType[] = ["r", "n", "b", "a", "k", "a", "b", "n", "r"];
  rRow9.forEach((type, x) => { board[9][x] = { type, side: "red" }; });
  board[7][1] = { type: "c", side: "red" };
  board[7][7] = { type: "c", side: "red" };
  [0, 2, 4, 6, 8].forEach((x) => { board[6][x] = { type: "p", side: "red" }; });

  return board;
}

// Check inside palace (九宫格: x=3..5, y=0..2 for black, y=7..9 for red)
function inPalace(x: number, y: number, side: Side): boolean {
  if (x < 3 || x > 5) return false;
  if (side === "black") return y >= 0 && y <= 2;
  return y >= 7 && y <= 9;
}

// Find king position for a given side
function findKing(board: Board, side: Side): [number, number] | null {
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const p = board[y][x];
      if (p?.type === "k" && p.side === side) return [x, y];
    }
  }
  return null;
}

// Check if Flying General occurs (将帅照面/飞将: same col & no blocking piece)
function isFlyingGeneral(board: Board): boolean {
  const redKing = findKing(board, "red");
  const blackKing = findKing(board, "black");

  if (!redKing || !blackKing) return false;
  if (redKing[0] !== blackKing[0]) return false; // Not in same column

  const col = redKing[0];
  const minY = Math.min(redKing[1], blackKing[1]);
  const maxY = Math.max(redKing[1], blackKing[1]);

  for (let y = minY + 1; y < maxY; y++) {
    if (board[y][col] !== null) return false; // Intervening piece exists
  }
  return true; // Flying general violation!
}

// Apply a move to a board immutably
function makeMove(board: Board, move: Move): Board {
  const newBoard = board.map((row) => [...row]);
  const [fx, fy] = move.from;
  const [tx, ty] = move.to;
  newBoard[ty][tx] = newBoard[fy][fx];
  newBoard[fy][fx] = null;
  return newBoard;
}

// Generate raw candidate moves without self-check / flying-general filter
function getRawMoves(board: Board, side: Side): Move[] {
  const moves: Move[] = [];

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (!piece || piece.side !== side) continue;
      const { type } = piece;

      // 1. General/King (将/帅): Orthogonal 1 step in palace
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

      // 2. Advisor (士/仕): Diagonal 1 step in palace
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

      // 3. Elephant (象/相): Diagonal 2 steps ("田"), cannot cross river, check eye (塞象眼)
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

      // 4. Horse (马/馬): "日" shape, check leg (蹩马腿)
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

      // 5. Chariot (车/車): Orthogonal unlimited steps until blocked
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

      // 6. Cannon (炮/砲): Moves like Rook without capture; Captures by jumping 1 platform (炮架)
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
                jumped = true; // Platform found
              }
            } else {
              if (target) {
                if (target.side !== side) moves.push({ from: [x, y], to: [nx, ny], captured: target });
                break; // Stop after first target after platform
              }
            }
            nx += dx;
            ny += dy;
          }
        });
      }

      // 7. Soldier/Pawn (兵/卒): 1 step forward; After crossing river, 1 step left/right/forward (no backward)
      else if (type === "p") {
        const dirY = side === "red" ? -1 : 1;
        const hasCrossed = side === "red" ? y <= 4 : y >= 5;

        // Forward
        const fy = y + dirY;
        if (fy >= 0 && fy < 10) {
          const target = board[fy][x];
          if (!target || target.side !== side) moves.push({ from: [x, y], to: [x, fy], captured: target });
        }

        // Sideways if river crossed
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

// Check if a side is in check (将军)
function isCheck(board: Board, side: Side): boolean {
  const kingPos = findKing(board, side);
  if (!kingPos) return true; // King dead

  const enemySide: Side = side === "red" ? "black" : "red";
  const enemyRawMoves = getRawMoves(board, enemySide);

  return enemyRawMoves.some((m) => m.to[0] === kingPos[0] && m.to[1] === kingPos[1]);
}

// Strictly legal move generator filtering out moves causing self-check or Flying General (照面)
function getLegalMoves(board: Board, side: Side): Move[] {
  const rawMoves = getRawMoves(board, side);
  return rawMoves.filter((m) => {
    const nextBoard = makeMove(board, m);
    // 1. Flying General filter
    if (isFlyingGeneral(nextBoard)) return false;
    // 2. Self King in Check filter
    if (isCheck(nextBoard, side)) return false;
    return true;
  });
}

// Board evaluation function
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
        if (crossed) val += 80;
      } else if (piece.type === "r" || piece.type === "c") {
        if (x >= 3 && x <= 5) val += 30; // Center files
      } else if (piece.type === "n") {
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
    const jitter = (Math.random() - 0.5) * 8;
    return { score: evaluateBoard(board) + jitter, move: null };
  }

  const currentSide: Side = isMaximizing ? "red" : "black";
  const legalMoves = getLegalMoves(board, currentSide);

  if (legalMoves.length === 0) {
    return { score: isMaximizing ? -99999 : 99999, move: null };
  }

  // Order capture moves first
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
      if (beta <= alpha) break;
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
      if (beta <= alpha) break;
    }
    return { score: minEval, move: bestMove };
  }
}

// ── SVG Standard Xiangqi Board Renderer (With Palace Cross & Corner Markers) ───────────
function StandardBoardSVG() {
  const cellSize = 44;
  const paddingX = 22;
  const paddingY = 22;

  // Grid coordinates
  const gx = (x: number) => paddingX + x * cellSize;
  const gy = (y: number) => paddingY + y * cellSize;

  // Corner markers ("└ ┐ ┌ ┘" clips) for Cannon and Pawn positions
  const markerPositions: [number, number][] = [
    // Cannons
    [1, 2], [7, 2], [1, 7], [7, 7],
    // Pawns
    [0, 3], [2, 3], [4, 3], [6, 3], [8, 3],
    [0, 6], [2, 6], [4, 6], [6, 6], [8, 6],
  ];

  const renderCornerMarker = (cx: number, cy: number, gridX: number) => {
    const d = 4;
    const len = 8;
    const isLeftEdge = gridX === 0;
    const isRightEdge = gridX === 8;

    return (
      <g key={`marker-${cx}-${cy}`} stroke="#7C633E" strokeWidth="1.2" fill="none">
        {/* Top-Left */}
        {!isLeftEdge && (
          <path d={`M ${cx - d - len} ${cy - d} L ${cx - d} ${cy - d} L ${cx - d} ${cy - d - len}`} />
        )}
        {/* Bottom-Left */}
        {!isLeftEdge && (
          <path d={`M ${cx - d - len} ${cy + d} L ${cx - d} ${cy + d} L ${cx - d} ${cy + d + len}`} />
        )}
        {/* Top-Right */}
        {!isRightEdge && (
          <path d={`M ${cx + d + len} ${cy - d} L ${cx + d} ${cy - d} L ${cx + d} ${cy - d - len}`} />
        )}
        {/* Bottom-Right */}
        {!isRightEdge && (
          <path d={`M ${cx + d + len} ${cy + d} L ${cx + d} ${cy + d} L ${cx + d} ${cy + d + len}`} />
        )}
      </g>
    );
  };

  return (
    <svg viewBox="0 0 396 440" className="w-full h-full pointer-events-none select-none">
      {/* Outer Border */}
      <rect x="14" y="14" width="368" height="412" fill="none" stroke="#7C633E" strokeWidth="2.5" />
      <rect x="18" y="18" width="360" height="404" fill="none" stroke="#7C633E" strokeWidth="1" />

      {/* Horizontal Lines (10 lines: y=0..9) */}
      {Array.from({ length: 10 }).map((_, y) => (
        <line
          key={`h-${y}`}
          x1={gx(0)}
          y1={gy(y)}
          x2={gx(8)}
          y2={gy(y)}
          stroke="#8C6D46"
          strokeWidth="1.2"
        />
      ))}

      {/* Vertical Lines (9 lines: x=0..8). Interrupted at River (y=4 to y=5) EXCEPT borders x=0, x=8 */}
      {Array.from({ length: 9 }).map((_, x) => {
        if (x === 0 || x === 8) {
          return (
            <line
              key={`v-${x}`}
              x1={gx(x)}
              y1={gy(0)}
              x2={gx(x)}
              y2={gy(9)}
              stroke="#8C6D46"
              strokeWidth="1.2"
            />
          );
        }
        return (
          <g key={`v-${x}`}>
            {/* Top Half (y=0..4) */}
            <line x1={gx(x)} y1={gy(0)} x2={gx(x)} y2={gy(4)} stroke="#8C6D46" strokeWidth="1.2" />
            {/* Bottom Half (y=5..9) */}
            <line x1={gx(x)} y1={gy(5)} x2={gx(x)} y2={gy(9)} stroke="#8C6D46" strokeWidth="1.2" />
          </g>
        );
      })}

      {/* Black Palace Cross Slashes (九宫格斜线: y=0..2, x=3..5) */}
      <line x1={gx(3)} y1={gy(0)} x2={gx(5)} y2={gy(2)} stroke="#8C6D46" strokeWidth="1.2" />
      <line x1={gx(5)} y1={gy(0)} x2={gx(3)} y2={gy(2)} stroke="#8C6D46" strokeWidth="1.2" />

      {/* Red Palace Cross Slashes (九宫格斜线: y=7..9, x=3..5) */}
      <line x1={gx(3)} y1={gy(7)} x2={gx(5)} y2={gy(9)} stroke="#8C6D46" strokeWidth="1.2" />
      <line x1={gx(5)} y1={gy(7)} x2={gx(3)} y2={gy(9)} stroke="#8C6D46" strokeWidth="1.2" />

      {/* Cannon & Pawn Corner Markers */}
      {markerPositions.map(([x, y]) => renderCornerMarker(gx(x), gy(y), x))}

      {/* River Text: 楚河 漢界 */}
      <text
        x={gx(1.8)}
        y={gy(4.65)}
        fill="#7C633E"
        fontSize="17"
        fontWeight="bold"
        fontFamily="serif"
        letterSpacing="2"
      >
        楚 河
      </text>
      <text
        x={gx(5.8)}
        y={gy(4.65)}
        fill="#7C633E"
        fontSize="17"
        fontWeight="bold"
        fontFamily="serif"
        letterSpacing="2"
      >
        漢 界
      </text>
    </svg>
  );
}

// --- Main Xiangqi Component ---
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

  // Check state
  const inCheck = isCheck(board, turn);
  const [showCheckAlert, setShowCheckAlert] = useState(false);

  // ── Xiangqi Recorded Audio Sample Effects ──────────────────────────
  // 1. Move Sound (真实实木象棋叩击棋盘声)
  const playMoveSound = useCallback(() => {
    try {
      const audio = new Audio("/sounds/move.wav");
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch {
      // Audio fallback
    }
  }, []);

  // 2. Capture Sound (两块实木棋子强烈相撞+砸落重响)
  const playCaptureSound = useCallback(() => {
    try {
      const audio = new Audio("/sounds/capture.wav");
      audio.volume = 0.9;
      audio.play().catch(() => {});
    } catch {
      // Audio fallback
    }
  }, []);

  // 3. Play Check Sound (将军警报)
  const playCheckSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.22);
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    } catch {
      // Audio fallback
    }
  }, []);

  // 4. Victory Fanfare (绝杀胜出三重音)
  const playVictorySound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const now = ctx.currentTime;
      const notes = [392, 523.25, 659.25, 783.99]; // G4, C5, E5, G5

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.25, now + i * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.65);
      });
    } catch {
      // Audio fallback
    }
  }, []);

  // Trigger giant check banner & sound effect whenever check occurs
  useEffect(() => {
    if (inCheck && status === "playing") {
      setShowCheckAlert(true);
      playCheckSound();
      const timer = setTimeout(() => setShowCheckAlert(false), 1600);
      return () => clearTimeout(timer);
    } else {
      setShowCheckAlert(false);
    }
  }, [inCheck, status, turn, playCheckSound]);

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
  const checkWinner = (b: Board, nextTurn: Side): "playing" | "red_win" | "black_win" => {
    const redKing = findKing(b, "red");
    const blackKing = findKing(b, "black");

    if (!redKing) return "black_win";
    if (!blackKing) return "red_win";

    // If opponent has no legal moves (Checkmate or Stalemate/困毙)
    const moves = getLegalMoves(b, nextTurn);
    if (moves.length === 0) {
      return nextTurn === "red" ? "black_win" : "red_win";
    }

    return "playing";
  };

  // Perform Move (With Move vs Capture Audio Logic)
  const executeMove = useCallback(
    (move: Move) => {
      setHistory((prev) => [...prev, { board, turn, lastMove }]);
      const nextBoard = makeMove(board, move);
      setBoard(nextBoard);
      setLastMove(move);
      setSelectedPos(null);
      setValidMoves([]);

      // Play Move or Capture sound according to logic
      if (move.captured) {
        playCaptureSound();
      } else {
        playMoveSound();
      }

      const nextTurn: Side = turn === "red" ? "black" : "red";
      const nextStatus = checkWinner(nextBoard, nextTurn);

      if (nextStatus !== "playing") {
        setStatus(nextStatus);
        playVictorySound();
        return;
      }

      setTurn(nextTurn);
    },
    [board, turn, lastMove, playMoveSound, playCaptureSound, playVictorySound]
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

  // Handle AI turn trigger for PvE or EvE auto play
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
    if (mode === "pve" && turn !== userSide) return;

    const clickedPiece = board[y][x];

    // Select piece of current turn's side
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
        {/* Status & Check Indicator */}
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

          {inCheck && status === "playing" && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs animate-bounce shadow-md border border-red-400">
              <AlertTriangle className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span className="tracking-wider">⚠️ 將軍！</span>
            </span>
          )}

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
                执红
              </button>
              <button
                onClick={() => { setUserSide("black"); resetGame(); }}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                  userSide === "black" ? "bg-[#2D2B2C] text-white shadow-2xs" : "text-[#7A736A] hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
              >
                执黑
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
            <span>重新模式</span>
          </button>
        </div>
      </div>

      {/* Xiangqi Board (SVG Precision Standard Wabi-Sabi Styling) */}
      <div className="relative mx-auto max-w-md aspect-[396/440] bg-[#E8D4B0] dark:bg-[#2A231A] rounded-2xl p-2 sm:p-3 shadow-inner border-4 border-[#8C6D46] dark:border-[#423321] select-none overflow-hidden">
        {/* SVG Standard Lines (Palace Cross Slashes, River Lines, Corner Markers) */}
        <StandardBoardSVG />

        {/* 90 Intersection Points Overlay (9 cols x 10 rows) */}
        <div className="absolute inset-0 p-[22px] grid grid-cols-9 grid-rows-10">
          {board.map((row, y) =>
            row.map((piece, x) => {
              const isSelected = selectedPos?.[0] === x && selectedPos?.[1] === y;
              const isValidMoveTarget = validMoves.some((m) => m.to[0] === x && m.to[1] === y);
              const isLastMoveFrom = lastMove?.from[0] === x && lastMove?.from[1] === y;
              const isLastMoveTo = lastMove?.to[0] === x && lastMove?.to[1] === y;

              // Check if THIS piece is the King currently in check!
              const isKingInCheck = inCheck && piece?.type === "k" && piece?.side === turn;

              return (
                <div
                  key={`${x}-${y}`}
                  onClick={() => handleCellClick(x, y)}
                  className="relative flex items-center justify-center cursor-pointer group"
                >
                  {/* Red King in Check Pulsing Halo Ring */}
                  {isKingInCheck && (
                    <div className="absolute inset-0 rounded-full border-4 border-red-600 animate-ping opacity-90 pointer-events-none" />
                  )}

                  {/* Last Move Trajectory Highlight */}
                  {(isLastMoveFrom || isLastMoveTo) && (
                    <div className="absolute inset-0.5 rounded-full border-2 border-dashed border-[#8C4A31] animate-pulse pointer-events-none" />
                  )}

                  {/* Move Target Dot */}
                  {isValidMoveTarget && (
                    <div className="z-20 w-3.5 h-3.5 rounded-full bg-[#36513B] opacity-85 animate-ping shadow-md" />
                  )}

                  {/* Piece Disc */}
                  {piece && (
                    <div
                      className={`z-10 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base md:text-lg shadow-md transition-transform duration-150 ${
                        isKingInCheck
                          ? "scale-115 ring-4 ring-red-600 bg-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.9)] animate-pulse"
                          : isSelected
                          ? "scale-110 ring-4 ring-[#8C4A31]"
                          : "hover:scale-105"
                      } ${
                        !isKingInCheck && piece.side === "red"
                          ? "bg-[#FDFBF7] text-[#C82A2A] border-2 border-[#C82A2A] shadow-[inset_0_2px_4px_rgba(200,42,42,0.2)]"
                          : !isKingInCheck && piece.side === "black"
                          ? "bg-[#2D2B2C] text-[#F0F5F1] border-2 border-[#1A1819] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]"
                          : ""
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

        {/* Center Giant Check Banner Overlay */}
        {showCheckAlert && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-in zoom-in-75 fade-in duration-200">
            <div className="bg-red-600/95 text-white px-8 py-3.5 rounded-3xl shadow-[0_10px_40px_rgba(220,38,38,0.6)] border-2 border-red-300 flex items-center gap-3 animate-bounce">
              <AlertTriangle className="w-8 h-8 text-yellow-300 animate-pulse" />
              <span className="text-2xl sm:text-3xl font-black tracking-widest drop-shadow-md">
                {turn === "red" ? "帥 被 將 軍 ！" : "將 被 將 軍 ！"}
              </span>
            </div>
          </div>
        )}

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
