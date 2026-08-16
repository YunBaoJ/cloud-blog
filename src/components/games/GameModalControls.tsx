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
    <div className="relative flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setGameSoundPreference({ muted: !preference.muted })}
        className="rounded-xl p-2 text-[#7A736A] transition-colors hover:bg-[#2D2B2C]/6 hover:text-[#2D2B2C] dark:hover:bg-white/8 dark:hover:text-[#F0F5F1]"
        aria-label={preference.muted ? "开启游戏声音" : "静音游戏声音"}
        aria-pressed={preference.muted}
      >
        {preference.muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
      </button>
      <label className="hidden items-center sm:flex" aria-label="游戏音量">
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
          className="h-1 w-20 cursor-pointer accent-[#36513B]"
        />
      </label>
      <button
        type="button"
        onClick={() => setShowHistory((current) => !current)}
        className="rounded-xl p-2 text-[#7A736A] transition-colors hover:bg-[#2D2B2C]/6 hover:text-[#2D2B2C] dark:hover:bg-white/8 dark:hover:text-[#F0F5F1]"
        aria-label="查看游戏记录"
        aria-expanded={showHistory}
      >
        <History className="size-4" />
      </button>

      {showHistory && (
        <div className="absolute right-0 top-11 z-20 w-72 rounded-2xl border border-[#2D2B2C]/10 bg-[#FFFCF7]/96 p-3 shadow-[0_16px_45px_rgba(45,43,44,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-[#1A2A1E]/96">
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-xs font-semibold text-[#36513B] dark:text-[#9BC7A6]">最近记录</p>
            <button
              type="button"
              onClick={() => setShowHistory(false)}
              className="rounded-lg p-1 text-[#7A736A] hover:bg-black/5 dark:hover:bg-white/8"
              aria-label="关闭游戏记录"
            >
              <X className="size-3.5" />
            </button>
          </div>
          {history.length === 0 ? (
            <p className="px-1 py-5 text-center text-xs text-[#7A736A] dark:text-[#9EB3A4]">完成一局后会记录在这里</p>
          ) : (
            <ul className="space-y-1.5">
              {history.slice(0, 5).map((record) => (
                <li key={record.id} className="flex items-center justify-between rounded-xl bg-[#36513B]/5 px-3 py-2 text-xs dark:bg-white/5">
                  <span className="font-medium text-[#2D2B2C] dark:text-[#F0F5F1]">{record.gameName}</span>
                  <span className="text-[#7A736A] dark:text-[#9EB3A4]">{record.result}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
