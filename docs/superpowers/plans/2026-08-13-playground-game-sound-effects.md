# Playground Game Sound Effects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate a restrained WAV sound library and connect it to meaningful actions in all five Playground games without adding background music.

**Architecture:** A deterministic Node script generates mono PCM WAV assets into `public/sounds/`. A small client utility maps semantic sound names to asset paths and handles safe browser playback. Existing game components call that utility only at already-established move, merge, food, collision, win, loss, and check boundaries.

**Tech Stack:** Node.js built-in modules and test runner, Web Audio playback through `HTMLAudioElement`, Next.js 16 App Router, React 19, TypeScript.

## Global Constraints

- Sounds are quiet, tactile, and inspired by wood, stone, paper, and soft percussion.
- Every sound is 0.05–0.7 seconds long.
- No sound loops, autoplays on page load, or behaves as continuous ambience.
- Direction changes in Snake remain silent.
- Generated WAV files live under `public/sounds/`.
- No background-music system, settings UI, new dependency, or unrelated refactor.
- Preserve unrelated working-tree changes in `src/app/notes/NotesClient.tsx`, `src/components/Hero.tsx`, and the existing preview HTML files.

---

## File Map

- Create `scripts/generate-game-sounds.mjs`: deterministic synthesis, PCM WAV encoding, and asset output.
- Create `scripts/generate-game-sounds.test.mjs`: validates the catalog, WAV headers, duration bounds, and non-silent output.
- Create or replace `public/sounds/*.wav`: the generated sound library.
- Create `src/lib/gameSounds.ts`: typed semantic catalog and safe cached playback.
- Modify `src/components/games/Xiangqi.tsx`: replace local recorded/Web Audio playback with catalog calls.
- Modify `src/components/games/Gomoku.tsx`: replace the large local synthesis block with catalog calls.
- Modify `src/components/games/SlidePuzzle.tsx`: add valid-move and completion sounds.
- Modify `src/components/games/Game2048.tsx`: add move, merge, win, and game-over sounds.
- Modify `src/components/games/SnakeGame.tsx`: replace eat/crash synthesis and remove turn sounds.

### Task 1: Generate and Validate the WAV Library

**Files:**
- Create: `scripts/generate-game-sounds.mjs`
- Create: `scripts/generate-game-sounds.test.mjs`
- Create/replace: `public/sounds/*.wav`

**Interfaces:**
- Produces: `SOUND_SPECS: readonly SoundSpec[]`
- Produces: `renderSound(spec: SoundSpec): Float32Array`
- Produces: `encodeWav(samples: Float32Array, sampleRate?: number): Buffer`
- Produces: `generateAll(outputDir: string): Promise<void>`
- Produces these exact asset names:
  `move.wav`, `capture.wav`, `xiangqi-check.wav`, `xiangqi-victory.wav`,
  `gomoku-black.wav`, `gomoku-white.wav`, `gomoku-victory.wav`,
  `puzzle-move.wav`, `puzzle-win.wav`, `2048-move.wav`,
  `2048-merge.wav`, `2048-win.wav`, `2048-over.wav`,
  `snake-eat.wav`, and `snake-crash.wav`.

- [ ] **Step 1: Write catalog and WAV contract tests**

Create `scripts/generate-game-sounds.test.mjs` with Node's built-in test runner. Assert that the 15 filenames are unique, all declared durations are within 0.05–0.7 seconds, rendered buffers contain audible non-zero samples without clipping, and encoded files begin with `RIFF` and contain `WAVE`.

```js
import assert from "node:assert/strict";
import test from "node:test";
import { SOUND_SPECS, encodeWav, renderSound } from "./generate-game-sounds.mjs";

test("sound catalog is complete and bounded", () => {
  assert.equal(SOUND_SPECS.length, 15);
  assert.equal(new Set(SOUND_SPECS.map(({ file }) => file)).size, 15);
  for (const spec of SOUND_SPECS) {
    assert.ok(spec.duration >= 0.05 && spec.duration <= 0.7);
  }
});

test("every sound renders as a valid non-clipped PCM WAV", () => {
  for (const spec of SOUND_SPECS) {
    const samples = renderSound(spec);
    const peak = samples.reduce((value, sample) => Math.max(value, Math.abs(sample)), 0);
    assert.ok(peak > 0.02, `${spec.file} is effectively silent`);
    assert.ok(peak <= 1, `${spec.file} clips`);
    const wav = encodeWav(samples);
    assert.equal(wav.toString("ascii", 0, 4), "RIFF");
    assert.equal(wav.toString("ascii", 8, 12), "WAVE");
  }
});
```

- [ ] **Step 2: Run the test and confirm the missing-module failure**

Run: `node --test scripts/generate-game-sounds.test.mjs`

Expected: FAIL because `scripts/generate-game-sounds.mjs` does not exist.

- [ ] **Step 3: Implement deterministic synthesis and WAV encoding**

Create `scripts/generate-game-sounds.mjs` with a 44,100 Hz mono, 16-bit PCM encoder. Use a fixed-seed pseudo-random generator for noise layers so output is reproducible. Provide small render helpers for decaying tones, filtered noise, impacts, slides, and short note cadences. Each `SoundSpec` supplies its filename, duration, and renderer.

The direct-run entry point must write all assets without affecting imports from the test:

```js
const SAMPLE_RATE = 44_100;

export function encodeWav(samples, sampleRate = SAMPLE_RATE) {
  const buffer = Buffer.alloc(44 + samples.length * 2);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + samples.length * 2, 4);
  buffer.write("WAVEfmt ", 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((sample, index) => {
    buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, sample)) * 32_767), 44 + index * 2);
  });
  return buffer;
}

export async function generateAll(outputDir) {
  await mkdir(outputDir, { recursive: true });
  await Promise.all(SOUND_SPECS.map(async (spec) => {
    await writeFile(join(outputDir, spec.file), encodeWav(renderSound(spec)));
  }));
}
```

Use these event-specific sound shapes:

- `move.wav`: 0.12 s dry light wooden impact.
- `capture.wav`: 0.22 s double wooden impact with a lower body.
- `xiangqi-check.wav`: 0.28 s firm two-note warning.
- `xiangqi-victory.wav`: 0.62 s warm four-note wooden cadence.
- `gomoku-black.wav`: 0.13 s stone click with a lower body.
- `gomoku-white.wav`: 0.11 s lighter stone click.
- `gomoku-victory.wav`: 0.58 s soft ascending chime.
- `puzzle-move.wav`: 0.14 s filtered slide ending in a quiet tap.
- `puzzle-win.wav`: 0.55 s warm three-note bell cadence.
- `2048-move.wav`: 0.10 s soft tile slide.
- `2048-merge.wav`: 0.18 s slide plus rounded wooden-percussion tone.
- `2048-win.wav`: 0.65 s gentle ascending success cadence.
- `2048-over.wav`: 0.48 s low muted descending cadence.
- `snake-eat.wav`: 0.12 s small water-drop/wooden pluck.
- `snake-crash.wav`: 0.26 s low dry impact.

- [ ] **Step 4: Run tests and generate assets**

Run: `node --test scripts/generate-game-sounds.test.mjs`

Expected: 2 tests PASS.

Run: `node scripts/generate-game-sounds.mjs`

Expected: all 15 WAV files exist under `public/sounds/`, each has a RIFF/WAVE header, and no file is empty.

- [ ] **Step 5: Commit the generator and assets**

```powershell
git add -- scripts/generate-game-sounds.mjs scripts/generate-game-sounds.test.mjs public/sounds
git commit -m "feat: generate playground game sounds"
```

### Task 2: Add the Shared Playback Utility

**Files:**
- Create: `src/lib/gameSounds.ts`

**Interfaces:**
- Produces: `GameSound` union inferred from the catalog keys.
- Produces: `playGameSound(sound: GameSound): void`.
- Consumes: the 15 files generated in Task 1.

- [ ] **Step 1: Add a typed sound catalog and safe player**

Create `src/lib/gameSounds.ts`. Keep it framework-independent and safe when evaluated outside the browser.

```ts
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
  const [path, volume] = GAME_SOUNDS[sound];
  const audio = players.get(sound) ?? new Audio(path);
  audio.volume = volume;
  audio.currentTime = 0;
  players.set(sound, audio);
  void audio.play().catch(() => {});
}
```

- [ ] **Step 2: Run static verification**

Run: `npm run lint -- src/lib/gameSounds.ts`

Expected: exit code 0 with no ESLint errors.

- [ ] **Step 3: Commit the playback utility**

```powershell
git add -- src/lib/gameSounds.ts
git commit -m "feat: add shared game sound player"
```

### Task 3: Connect Chess and Gomoku Events

**Files:**
- Modify: `src/components/games/Xiangqi.tsx:3-5,508-580,620-649`
- Modify: `src/components/games/Gomoku.tsx:1-5,313-426,428-598`

**Interfaces:**
- Consumes: `playGameSound(sound: GameSound): void` from Task 2.

- [ ] **Step 1: Replace Xiangqi's local players**

Import `playGameSound` from `@/lib/gameSounds`. Remove the four local playback callbacks. Keep the existing event boundaries and call:

```ts
if (showCheckAlert) playGameSound("xiangqi-check");

playGameSound(move.captured ? "xiangqi-capture" : "xiangqi-move");

if (nextStatus !== "playing") {
  setStatus(nextStatus);
  playGameSound("xiangqi-victory");
  return;
}
```

Do not change move legality, AI behavior, or board state.

- [ ] **Step 2: Replace Gomoku's local synthesis**

Import `playGameSound`, delete the local `AudioContext` synthesis functions, and preserve the existing placement and victory boundaries:

```ts
const place = useCallback((idx: number, b: Stone[], t: "black" | "white"): Stone[] => {
  const next = [...b];
  next[idx] = t;
  playGameSound(t === "black" ? "gomoku-black" : "gomoku-white");
  return next;
}, []);
```

Replace every `playVictorySound()` call with `playGameSound("gomoku-victory")`. Remove only dependency entries made obsolete by deleted callbacks.

- [ ] **Step 3: Run focused lint**

Run: `npm run lint -- src/components/games/Xiangqi.tsx src/components/games/Gomoku.tsx`

Expected: exit code 0 with no ESLint errors.

- [ ] **Step 4: Commit chess integrations**

```powershell
git add -- src/components/games/Xiangqi.tsx src/components/games/Gomoku.tsx
git commit -m "feat: add tactile sounds to board games"
```

### Task 4: Connect Puzzle, 2048, and Snake Events

**Files:**
- Modify: `src/components/games/SlidePuzzle.tsx:3-4,84-109`
- Modify: `src/components/games/Game2048.tsx:1-6,147-164`
- Modify: `src/components/games/SnakeGame.tsx:3-6,53-121,254-328,400-480`

**Interfaces:**
- Consumes: `playGameSound(sound: GameSound): void` from Task 2.

- [ ] **Step 1: Add Slide Puzzle sounds only for valid moves**

After an adjacent tile is applied, compute `solved` once. Play the completion sound for the winning move; otherwise play the move sound. Invalid and post-win clicks remain silent.

```ts
const solved = isSolved(newTiles);
playGameSound(solved ? "puzzle-win" : "puzzle-move");
if (solved) setIsWon(true);
```

- [ ] **Step 2: Add one prioritized sound per valid 2048 input**

After computing `nextGrid`, determine terminal state before playback. A win or loss sound replaces the ordinary movement sound; otherwise a merge uses the combined slide-and-percussion asset and a non-merge uses the slide asset.

```ts
const won = nextGrid.some((row) => row.includes(2048)) && gameState !== "won" && !continued;
const over = !won && checkGameOver(nextGrid);

if (won) playGameSound("2048-win");
else if (over) playGameSound("2048-over");
else playGameSound(scoreIncrease > 0 ? "2048-merge" : "2048-move");
```

Keep blocked inputs silent by retaining the existing early `if (!moved) return`.

- [ ] **Step 3: Replace Snake eat/crash synthesis and remove turn audio**

Delete all three local Web Audio callbacks. Call `playGameSound("snake-eat")` at the existing food collision and `playGameSound("snake-crash")` inside `gameOver`. Remove both keyboard and touch calls to the deleted turn sound so rapid direction changes stay silent.

- [ ] **Step 4: Run focused lint**

Run: `npm run lint -- src/components/games/SlidePuzzle.tsx src/components/games/Game2048.tsx src/components/games/SnakeGame.tsx`

Expected: exit code 0 with no ESLint errors.

- [ ] **Step 5: Commit remaining game integrations**

```powershell
git add -- src/components/games/SlidePuzzle.tsx src/components/games/Game2048.tsx src/components/games/SnakeGame.tsx
git commit -m "feat: add interaction sounds to arcade games"
```

### Task 5: Full Verification and Local Audition

**Files:**
- Verify only; modify a task-owned file only when a failing check identifies a sound-related defect.

**Interfaces:**
- Consumes: all prior tasks.

- [ ] **Step 1: Verify generated assets and repository quality gates**

Run:

```powershell
node --test scripts/generate-game-sounds.test.mjs
npm run lint
npm run build
git diff --check
```

Expected: every command exits 0; the audio test reports 2 passing tests.

- [ ] **Step 2: Start the site and verify the Playground route**

Start `npm run dev` in a hidden detached process, verify that port 3000 is listening, and request `http://localhost:3000/playground` with `Invoke-WebRequest`.

Expected: HTTP 200 and no terminal compile error.

- [ ] **Step 3: Audition all event boundaries in the browser**

Verify:

- Opening `/playground` plays nothing.
- Xiangqi legal move, capture, check, and victory use the intended effects; invalid selection is silent.
- Gomoku black and white placements differ subtly; victory plays once.
- Slide Puzzle valid movement sounds once, invalid clicks stay silent, and completion uses the win sound.
- 2048 invalid moves stay silent; ordinary moves, merges, 2048 completion, and game over are distinct.
- Snake direction changes stay silent; food and collision are distinct.
- Keyboard and pointer/touch-supported interactions still work.

- [ ] **Step 4: Review the final diff scope**

Run: `git status --short` and `git diff --stat HEAD~3..HEAD` (adjust the commit range if fewer commits were made).

Expected: sound generator/tests/assets, one sound utility, and five game components only. Existing unrelated working-tree changes remain uncommitted and untouched.
