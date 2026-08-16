import { appendGameRecord, type GameId, type GameRecord } from "@/lib/gameRecords.mts";

const HISTORY_KEY = "cloud-game-history";
const HISTORY_EVENT = "cloud-game-history-change";

export function getGameHistory(): GameRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(HISTORY_KEY) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function getGameHistorySnapshot(): string {
  return JSON.stringify(getGameHistory());
}

export function subscribeToGameHistory(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(HISTORY_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(HISTORY_EVENT, callback);
  };
}

export function recordGameResult(gameId: GameId, gameName: string, result: string): void {
  if (typeof window === "undefined") return;
  const playedAt = new Date().toISOString();
  const next = appendGameRecord(getGameHistory(), {
    id: `${playedAt}-${gameId}`,
    gameId,
    gameName,
    result,
    playedAt,
  });
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(HISTORY_EVENT));
}
