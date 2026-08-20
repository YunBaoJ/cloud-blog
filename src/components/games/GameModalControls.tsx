"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { History, Volume2, VolumeX, X } from "lucide-react";
import {
  getGameSoundPreference,
  getGameSoundPreferenceSnapshot,
  setGameSoundPreference,
  subscribeToGameSoundPreference,
} from "@/lib/gamePreferences";
import {
  getGameHistorySnapshot,
  subscribeToGameHistory,
} from "@/lib/gameHistory";
import type { GameRecord } from "@/lib/gameRecords.mts";

const emptyHistory = "[]";
const serverPreference = "0.8:false";

export default function GameModalControls() {
  const [showHistory, setShowHistory] = useState(false);
  useSyncExternalStore(
    subscribeToGameSoundPreference,
    getGameSoundPreferenceSnapshot,
    () => serverPreference,
  );
  const historySnapshot = useSyncExternalStore(
    subscribeToGameHistory,
    getGameHistorySnapshot,
    () => emptyHistory,
  );
  const preference = getGameSoundPreference();
  const history = useMemo(
    () => JSON.parse(historySnapshot) as GameRecord[],
    [historySnapshot],
  );

  return (
    <div className="relative flex items-center gap-1">
      <button
        type="button"
        onClick={() => setGameSoundPreference({ muted: !preference.muted })}
        className="rounded-xl p-1.5 sm:p-2 text-[var(--muted)] transition-colors hover:bg-black/5 hover:text-[var(--foreground)] dark:hover:bg-white/8"
        aria-label={preference.muted ? "开启游戏声音" : "静音游戏声音"}
        aria-pressed={preference.muted}
      >
        {preference.muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
      </button>

      <label className="hidden items-center sm:flex px-1" aria-label="游戏音量">
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={preference.volume}
          onChange={(event) => setGameSoundPreference({
            volume: Number(event.target.value),
            muted: false,
          })}
          className="h-1 w-18 cursor-pointer accent-[var(--accent-green)]"
        />
      </label>

      <button
        type="button"
        onClick={() => setShowHistory((current) => !current)}
        className={`rounded-xl p-1.5 sm:p-2 transition-colors ${
          showHistory
            ? "bg-[var(--accent-green)]/10 text-[var(--accent-green)]"
            : "text-[var(--muted)] hover:bg-black/5 hover:text-[var(--foreground)] dark:hover:bg-white/8"
        }`}
        aria-label="查看游戏记录"
        aria-expanded={showHistory}
      >
        <History className="size-4" />
      </button>

      {showHistory && (
        <div className="absolute right-0 top-11 z-30 w-72 sm:w-80 rounded-2xl border border-[var(--border-line-color)] bg-[var(--surface)]/95 p-3.5 shadow-[0_16px_45px_rgba(0,0,0,0.2)] backdrop-blur-xl dark:bg-[#1B2D22]/95 animate-in fade-in zoom-in-95 duration-150">
          <div className="mb-2.5 flex items-center justify-between px-1">
            <p className="text-xs font-semibold text-[var(--accent-green)]">战绩记录</p>
            <button
              type="button"
              onClick={() => setShowHistory(false)}
              className="rounded-lg p-1 text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/8 hover:text-[var(--foreground)] transition-colors"
              aria-label="关闭游戏记录"
            >
              <X className="size-3.5" />
            </button>
          </div>
          {history.length === 0 ? (
            <p className="px-1 py-6 text-center text-xs text-[var(--muted)]">完成一局后会在此记录成绩</p>
          ) : (
            <ul className="space-y-1.5 max-h-56 overflow-y-auto pr-0.5">
              {history.slice(0, 8).map((record) => (
                <li key={record.id} className="flex items-center justify-between rounded-xl bg-[var(--surface-2)]/70 px-3 py-2 text-xs">
                  <span className="font-medium text-[var(--foreground)]">{record.gameName}</span>
                  <span className="text-[var(--muted)] font-mono text-[11px]">{record.result}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
