import { clampGameVolume } from "@/lib/gameRecords.mts";

const VOLUME_KEY = "cloud-game-volume";
const MUTED_KEY = "cloud-game-muted";
const PREFERENCE_EVENT = "cloud-game-preference";

export interface GameSoundPreference {
  volume: number;
  muted: boolean;
}

const fallbackPreference: GameSoundPreference = { volume: 0.8, muted: false };

export function getGameSoundPreference(): GameSoundPreference {
  if (typeof window === "undefined") return fallbackPreference;

  const parsed = Number(window.localStorage.getItem(VOLUME_KEY));
  return {
    volume: window.localStorage.getItem(VOLUME_KEY) === null ? 0.8 : clampGameVolume(parsed),
    muted: window.localStorage.getItem(MUTED_KEY) === "true",
  };
}

export function getGameSoundPreferenceSnapshot(): string {
  const preference = getGameSoundPreference();
  return `${preference.volume}:${preference.muted}`;
}

export function setGameSoundPreference(next: Partial<GameSoundPreference>): void {
  if (typeof window === "undefined") return;
  const current = getGameSoundPreference();
  const preference = { ...current, ...next };
  window.localStorage.setItem(VOLUME_KEY, String(clampGameVolume(preference.volume)));
  window.localStorage.setItem(MUTED_KEY, String(preference.muted));
  window.dispatchEvent(new Event(PREFERENCE_EVENT));
}

export function subscribeToGameSoundPreference(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(PREFERENCE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(PREFERENCE_EVENT, callback);
  };
}
