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

export function playGameSound(sound: GameSound): void {
  if (typeof Audio === "undefined") return;

  try {
    const [path, volume] = GAME_SOUNDS[sound];
    const audio = players.get(sound) ?? new Audio(path);
    audio.volume = volume;
    audio.currentTime = 0;
    players.set(sound, audio);
    void audio.play().catch(() => {});
  } catch {
    // Audio playback is optional and must not interrupt game input.
  }
}
