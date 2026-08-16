export type GameId = "snake" | "2048" | "puzzle" | "gomoku" | "xiangqi";

export interface GameRecord {
  id: string;
  gameId: GameId;
  gameName: string;
  result: string;
  playedAt: string;
}

export function appendGameRecord(
  records: readonly GameRecord[],
  record: GameRecord,
  limit = 20,
): GameRecord[] {
  return [record, ...records].slice(0, Math.max(1, limit));
}

export function clampGameVolume(value: number): number {
  if (!Number.isFinite(value)) return 0.8;
  return Math.min(1, Math.max(0, value));
}

const GAME_LOUDNESS_BOOST = 2.4;

export function resolveGamePlaybackVolume(baseVolume: number, preferenceVolume: number): number {
  return clampGameVolume(baseVolume * preferenceVolume * GAME_LOUDNESS_BOOST);
}
