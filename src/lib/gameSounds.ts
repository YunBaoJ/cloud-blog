import { getGameSoundPreference } from "@/lib/gamePreferences";
import { resolveGamePlaybackVolume } from "@/lib/gameRecords.mts";

const GAME_SOUNDS = {
  "xiangqi-move": ["/sounds/move.wav", 0.72],
  "xiangqi-capture": ["/sounds/capture.wav", 0.78],
  "xiangqi-check": ["/sounds/xiangqi-check.wav", 0.64],
  "xiangqi-victory": ["/sounds/xiangqi-victory.wav", 0.68],
  "gomoku-black": ["/sounds/gomoku-black.wav", 0.66],
  "gomoku-white": ["/sounds/gomoku-white.wav", 0.6],
  "gomoku-victory": ["/sounds/gomoku-victory.wav", 0.62],
  "puzzle-move": ["/sounds/puzzle-move.wav", 0.44],
  "puzzle-win": ["/sounds/puzzle-win.wav", 0.62],
  "2048-move": ["/sounds/2048-move.wav", 0.36],
  "2048-merge": ["/sounds/2048-merge.wav", 0.5],
  "2048-win": ["/sounds/2048-win.wav", 0.62],
  "2048-over": ["/sounds/2048-over.wav", 0.54],
  "snake-eat": ["/sounds/snake-eat.wav", 0.48],
  "snake-crash": ["/sounds/snake-crash.wav", 0.58],
} as const satisfies Record<string, readonly [path: string, volume: number]>;

export type GameSound = keyof typeof GAME_SOUNDS;

const players = new Map<GameSound, HTMLAudioElement>();
const audioBuffers = new Map<string, AudioBuffer>();
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    void audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function triggerGameHaptic(
  type: "soft" | "medium" | "heavy" | "victory" | "warning" = "soft"
): void {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    switch (type) {
      case "soft":
        navigator.vibrate(10);
        break;
      case "medium":
        navigator.vibrate(22);
        break;
      case "heavy":
        navigator.vibrate(40);
        break;
      case "warning":
        navigator.vibrate([25, 40, 25]);
        break;
      case "victory":
        navigator.vibrate([35, 40, 45, 40, 60]);
        break;
    }
  } catch {
    // Haptics are best-effort
  }
}

function getHapticForSound(sound: GameSound): "soft" | "medium" | "heavy" | "victory" | "warning" {
  if (sound.includes("victory") || sound.includes("win")) return "victory";
  if (sound.includes("check")) return "warning";
  if (sound.includes("crash") || sound.includes("over")) return "heavy";
  if (sound.includes("capture") || sound.includes("merge") || sound.includes("eat")) return "medium";
  return "soft";
}

export function playGameSound(sound: GameSound): void {
  if (typeof window === "undefined") return;

  try {
    const [path, volume] = GAME_SOUNDS[sound];
    const preference = getGameSoundPreference();
    if (preference.muted || preference.volume === 0) return;

    // Trigger matching haptic vibration
    triggerGameHaptic(getHapticForSound(sound));

    const finalVolume = resolveGamePlaybackVolume(volume, preference.volume);
    const ctx = getAudioContext();

    if (ctx && ctx.state !== "closed") {
      const cachedBuffer = audioBuffers.get(path);
      if (cachedBuffer) {
        const source = ctx.createBufferSource();
        const gainNode = ctx.createGain();
        source.buffer = cachedBuffer;
        gainNode.gain.setValueAtTime(finalVolume, ctx.currentTime);
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
        return;
      }

      // Fetch and decode for subsequent zero-latency plays
      void fetch(path)
        .then((res) => res.arrayBuffer())
        .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
        .then((decoded) => {
          audioBuffers.set(path, decoded);
          const source = ctx.createBufferSource();
          const gainNode = ctx.createGain();
          source.buffer = decoded;
          gainNode.gain.setValueAtTime(finalVolume, ctx.currentTime);
          source.connect(gainNode);
          gainNode.connect(ctx.destination);
          source.start(0);
        })
        .catch(() => {
          // Fallback to HTMLAudioElement
          playHtmlAudioFallback(sound, path, finalVolume);
        });
      return;
    }

    // HTMLAudioElement Fallback
    playHtmlAudioFallback(sound, path, finalVolume);
  } catch {
    // Audio playback is optional and must not interrupt game input.
  }
}

function playHtmlAudioFallback(sound: GameSound, path: string, finalVolume: number): void {
  try {
    const audio = players.get(sound) ?? new Audio(path);
    audio.volume = finalVolume;
    audio.currentTime = 0;
    players.set(sound, audio);
    void audio.play().catch(() => {});
  } catch {
    // Best-effort
  }
}
