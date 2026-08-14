# Realistic Board Game Sounds Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace only the Chinese Chess and Gomoku synthetic effects with user-approved physical recordings, while removing non-physical check and victory sounds.

**Architecture:** Acquire CC0 WAV candidates into a plan-owned audition directory and stop for user approval before production changes. After approval, store four normalized source recordings, process them deterministically into browser-ready WAV files, keep the existing shared player, and remove the three non-physical status sounds and their event calls.

**Tech Stack:** Node.js built-in modules and test runner, mono PCM WAV assets, Next.js 16, React 19, TypeScript.

## Global Constraints

- Only Chinese Chess and Gomoku change; Slide Puzzle, 2048, and Snake remain untouched.
- Chinese Chess keeps only physical move and capture sounds.
- Gomoku keeps only physical black-stone and white-stone placement sounds.
- Check and victory remain visible states but play no sound.
- Candidate recordings must be auditioned and approved by the user before replacing production assets.
- Use CC0 recordings and record the source URL, creator, license, original filename, and processing performed.
- Do not bypass login, paywall, or download restrictions.
- Preserve physical transients; do not add melodies, oscillators, synthetic victory cues, or conspicuous pitch effects.
- Do not change game rules, AI behavior, scoring, visual status messages, or unrelated Playground code.
- Preserve all unrelated working-tree changes.

---

## File Map

- Create `docs/audio-sources.md`: source, creator, license, checksum, and processing record.
- Create `assets/sounds/sources/xiangqi-move-cc0.wav`: approved raw move recording.
- Create `assets/sounds/sources/xiangqi-capture-cc0.wav`: approved raw capture recording.
- Create `assets/sounds/sources/gomoku-black-cc0.wav`: approved raw black-stone recording.
- Create `assets/sounds/sources/gomoku-white-cc0.wav`: approved raw white-stone recording.
- Create `scripts/process-recorded-board-sounds.mjs`: PCM WAV decoding, transient trim, downmix, resample, fade, normalization, and output.
- Create `scripts/process-recorded-board-sounds.test.mjs`: processor and final recorded-asset tests.
- Modify `scripts/generate-game-sounds.mjs`: retain only the eight unchanged synthetic-game assets.
- Modify `scripts/generate-game-sounds.test.mjs`: expect twelve production sounds, separating eight generated and four recorded files.
- Replace `public/sounds/move.wav`, `capture.wav`, `gomoku-black.wav`, and `gomoku-white.wav`.
- Delete `public/sounds/xiangqi-check.wav`, `xiangqi-victory.wav`, and `gomoku-victory.wav`.
- Modify `src/lib/gameSounds.ts`: remove the three obsolete status mappings.
- Modify `src/components/games/Xiangqi.tsx`: remove check and victory playback only.
- Modify `src/components/games/Gomoku.tsx`: remove all victory playback only.

### Task 1: Acquire Candidates and Stop for Audition

**Files:**
- Create in ignored SDD workspace: `candidates/`
- Create in ignored SDD workspace: `candidate-sources.md`

**Interfaces:**
- Produces four user-approved candidate roles: `xiangqi-move`, `xiangqi-capture`, `gomoku-black`, `gomoku-white`.
- No production file may change in this task.

- [ ] **Step 1: Download only openly available CC0 candidates**

Use these sources in order:

1. Freesound `Wooden Hit` by jackyyang09, CC0:
   `https://freesound.org/people/jackyyang09/sounds/506718/`
2. OpenGameArt `Boardgame piece wobbles` by Aidan_Walker, CC0:
   `https://opengameart.org/content/boardgame-piece-wobbles`
3. Ear0 `在棋盘上落子的声音` by 代号091, CC0:
   `https://www.ear0.com/sound/show/soundid-39400`
4. Polar_34 `Material Sound Effects`, asset license CC0:
   `https://polar-34.itch.io/material-sound-effects`

Save original files without renaming inside `candidates/originals/<source-name>/`.
If Freesound requires login, record that fact and continue to the next source;
do not scrape a gated original. Prefer WAV candidates. MP3 candidates may be
presented for listening but cannot become production sources in this plan.

- [ ] **Step 2: Verify license pages and file integrity**

Write `candidate-sources.md` with the source page URL, creator, displayed
license, downloaded filename, byte size, and SHA-256 for every candidate.
Reject HTML error pages, zero-byte files, and sources whose displayed license
is not CC0.

- [ ] **Step 3: Present playable candidates to the user**

Render every viable candidate with an absolute local path and label the likely
role. Do not rank by unheard subjective quality. Ask the user to select one WAV
for each of the four roles.

- [ ] **Step 4: Hard stop for approval**

Do not begin Task 2 until the user explicitly approves the four role choices.
If no candidate is acceptable, acquire another CC0 source and repeat Task 1.

### Task 2: Add Reproducible Recorded-Sound Processing

**Files:**
- Create: `assets/sounds/sources/xiangqi-move-cc0.wav`
- Create: `assets/sounds/sources/xiangqi-capture-cc0.wav`
- Create: `assets/sounds/sources/gomoku-black-cc0.wav`
- Create: `assets/sounds/sources/gomoku-white-cc0.wav`
- Create: `scripts/process-recorded-board-sounds.mjs`
- Create: `scripts/process-recorded-board-sounds.test.mjs`
- Create: `docs/audio-sources.md`
- Replace: `public/sounds/move.wav`
- Replace: `public/sounds/capture.wav`
- Replace: `public/sounds/gomoku-black.wav`
- Replace: `public/sounds/gomoku-white.wav`

**Interfaces:**
- Produces: `RECORDED_SOUND_SPECS`, containing `source`, `output`, `maxDuration`, and `targetPeak`.
- Produces: `decodePcmWav(buffer): DecodedWav` for PCM integer 16/24/32-bit and IEEE float 32-bit WAV.
- Produces: `processRecordedSound(spec): Promise<Buffer>`.
- Produces: `writeRecordedSounds(outputDir): Promise<void>`.

- [ ] **Step 1: Copy only the four approved WAV originals**

Copy the user-selected originals to the four standardized source paths. Keep
their PCM data unchanged at this step. Record each original filename, SHA-256,
creator, page URL, CC0 license URL, and selected role in `docs/audio-sources.md`.

- [ ] **Step 2: Write failing processor tests**

Use Node's built-in test runner. Create small PCM fixtures in memory and assert:

- mono and stereo PCM decode correctly;
- the processor downmixes to mono and resamples to 44,100 Hz;
- output is 16-bit PCM WAV;
- leading/trailing silence is removed around the strongest physical transient;
- 5 ms fades prevent non-zero first and last samples;
- output peaks remain below full scale and above the non-silent threshold;
- each final output is no longer than its exact maximum: move `0.22 s`, capture
  `0.30 s`, Gomoku black `0.20 s`, Gomoku white `0.20 s`.

Run: `node --test scripts/process-recorded-board-sounds.test.mjs`

Expected: FAIL because the processor module does not exist.

- [ ] **Step 3: Implement the minimal WAV processor**

Implement chunk-based RIFF parsing rather than assuming fixed offsets. Downmix
channels by averaging, linearly resample to 44,100 Hz, locate the strongest
absolute peak, keep up to the configured maximum duration around that transient,
apply 5 ms linear fades, and normalize to the configured conservative peak.
Use these output targets:

```js
export const RECORDED_SOUND_SPECS = [
  { source: "xiangqi-move-cc0.wav", output: "move.wav", maxDuration: 0.22, targetPeak: 0.55 },
  { source: "xiangqi-capture-cc0.wav", output: "capture.wav", maxDuration: 0.30, targetPeak: 0.62 },
  { source: "gomoku-black-cc0.wav", output: "gomoku-black.wav", maxDuration: 0.20, targetPeak: 0.50 },
  { source: "gomoku-white-cc0.wav", output: "gomoku-white.wav", maxDuration: 0.20, targetPeak: 0.46 },
];
```

- [ ] **Step 4: Process and verify the approved recordings**

Run:

```powershell
node --test scripts/process-recorded-board-sounds.test.mjs
node scripts/process-recorded-board-sounds.mjs
node --test scripts/process-recorded-board-sounds.test.mjs
```

Expected: tests pass and exactly four production WAVs are written.

- [ ] **Step 5: Present the processed files for final sound approval**

Render the four production WAVs as playable local audio. If the user rejects a
processed result, adjust only its approved source selection or trim window,
rerun the processor tests, and present it again before committing.

- [ ] **Step 6: Commit approved recordings and processing**

```powershell
git add -- assets/sounds/sources docs/audio-sources.md scripts/process-recorded-board-sounds.mjs scripts/process-recorded-board-sounds.test.mjs public/sounds/move.wav public/sounds/capture.wav public/sounds/gomoku-black.wav public/sounds/gomoku-white.wav
git commit -m "feat: add recorded board game sounds"
```

### Task 3: Remove Non-Physical Chess Status Sounds

**Files:**
- Modify: `scripts/generate-game-sounds.mjs:73-89`
- Modify: `scripts/generate-game-sounds.test.mjs:10-88`
- Modify: `src/lib/gameSounds.ts:1-18`
- Modify: `src/components/games/Xiangqi.tsx:506-514,562-572`
- Modify: `src/components/games/Gomoku.tsx:330-482`
- Delete: `public/sounds/xiangqi-check.wav`
- Delete: `public/sounds/xiangqi-victory.wav`
- Delete: `public/sounds/gomoku-victory.wav`

**Interfaces:**
- Consumes: the four approved recorded WAVs from Task 2.
- Preserves: `playGameSound(sound: GameSound): void`.
- Produces: a twelve-file production sound catalog: eight synthetic files for
  unchanged games plus four recorded board-game files.

- [ ] **Step 1: Write the failing catalog expectations**

Update the test's exact production file list to remove the three status files.
Split it into `GENERATED_FILES` with the eight unchanged non-chess assets and
`RECORDED_FILES` with the four physical board-game assets. Assert that the
directory contains exactly their twelve-file union and that only generated
files are byte-equal to `encodeWav(renderSound(spec))`.

Run: `node --test scripts/generate-game-sounds.test.mjs`

Expected: FAIL because the generator and directory still include the obsolete
status sounds.

- [ ] **Step 2: Narrow the synthetic generator**

Remove `move.wav`, `capture.wav`, both Gomoku placement files, and all three
status sounds from `SOUND_SPECS`. Leave only the eight assets belonging to Slide
Puzzle, 2048, and Snake. Direct generator execution must not overwrite recorded
board-game files.

- [ ] **Step 3: Remove runtime status playback**

- Delete `xiangqi-check`, `xiangqi-victory`, and `gomoku-victory` from
  `GAME_SOUNDS`.
- Remove the Xiangqi check-effect playback and victory playback calls while
  preserving check display and winner state.
- Remove all three Gomoku victory playback calls while preserving winner state,
  score updates, and visual victory messages.

- [ ] **Step 4: Delete only the three newly orphaned status WAVs**

Before deletion, run:

```powershell
rg -n "xiangqi-check|xiangqi-victory|gomoku-victory" src scripts public docs
```

Expected: only test expectations or documentation being changed in this task.
Delete the three exact files and no other asset.

- [ ] **Step 5: Run focused verification and commit**

```powershell
node --test scripts/generate-game-sounds.test.mjs scripts/process-recorded-board-sounds.test.mjs
npx eslint src/lib/gameSounds.ts src/components/games/Xiangqi.tsx src/components/games/Gomoku.tsx
git diff --check
git add -- scripts/generate-game-sounds.mjs scripts/generate-game-sounds.test.mjs src/lib/gameSounds.ts src/components/games/Xiangqi.tsx src/components/games/Gomoku.tsx public/sounds
git commit -m "feat: keep only physical board game sounds"
```

Expected: all tests and focused lint pass.

### Task 4: Final Verification

**Files:**
- Verify only; modify task-owned files only when a failing check identifies a board-sound defect.

**Interfaces:**
- Consumes all prior tasks.

- [ ] **Step 1: Verify audio assets and references**

Run both Node test files, confirm exactly twelve WAVs exist, and search for the
three removed semantic names across `src`, `scripts`, `public`, and `docs`.

Expected: tests pass, twelve WAVs exist, and no runtime reference remains.

- [ ] **Step 2: Run repository gates**

Run:

```powershell
npm run lint
git diff --check
npm run build
npm run build -- --webpack
```

Record existing unrelated build failures separately; do not fix `now` or other
routes under this plan.

- [ ] **Step 3: Verify the local Playground route**

Start the task worktree with Webpack on an unused port, confirm `/playground`
and all twelve `/sounds/*.wav` paths return HTTP 200, and check that opening the
page plays no sound automatically.

- [ ] **Step 4: Verify event behavior**

- Xiangqi legal move and capture play their approved physical recordings.
- Xiangqi check and victory remain visible and silent.
- Gomoku black and white placements play their approved natural variants.
- Gomoku victory remains visible and silent.
- Invalid board inputs remain silent.
- Slide Puzzle, 2048, and Snake retain their current sound behavior.

- [ ] **Step 5: Review final diff scope**

Confirm the diff contains only source/license records, recorded-audio processing,
the four replacement assets, the three exact deletions, catalog/tests, and the
two board-game components.
