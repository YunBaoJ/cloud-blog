# Playground Game Sound Effects Design

## Goal

Add short, natural interaction sounds to all five Playground games. The sounds
must reinforce actions such as placing a piece, sliding a tile, merging numbers,
eating food, winning, and losing. They must never behave like background music.

## Sound Direction

- Use quiet, tactile sounds inspired by wood, stone, paper, and soft percussion.
- Keep every sound short, approximately 0.05–0.7 seconds.
- Do not loop, autoplay on page load, or add continuous ambience.
- Keep playback restrained so repeated actions do not become tiring.
- Store the generated effects as WAV files under `public/sounds/`.

## Event Map

### Chinese Chess

- Move: a light wooden piece landing on a board.
- Capture: a heavier double impact.
- Check: a short, firm warning accent.
- Victory: a restrained ascending wooden-percussion cadence.

### Gomoku

- Black stone: a slightly heavier stone-on-wood click.
- White stone: a slightly lighter stone-on-wood click.
- Victory: a soft ascending chime.

### Slide Puzzle

- Tile move: a short paper or thin-wood slide ending in a quiet tap.
- Completion: a brief, warm bell cadence.

### 2048

- Move without merge: a soft tile slide.
- Merge: the slide plus a rounded wooden-percussion note.
- Reach 2048: a gentle ascending success cadence.
- Game over: a low, muted descending cadence.

### Snake

- Direction changes remain silent to avoid fatigue during rapid input.
- Eat food: a small water-drop or wooden-pluck sound.
- Collision: a low, dry impact.

## Implementation Shape

- Add one small shared client-side sound utility that plays named WAV assets.
- Reuse audio elements by sound name so repeated game actions do not create a new
  browser audio object every time.
- Restart an effect from the beginning when the same event repeats quickly.
- Ignore browser playback rejection without interrupting gameplay.
- Integrate sounds only at existing confirmed game-event boundaries.
- Do not add a background-music system or unrelated UI changes.

## Verification

- Confirm every mapped event triggers the intended sound exactly once.
- Confirm invalid moves and blocked inputs remain silent.
- Confirm no sound starts when merely opening the Playground page.
- Check all five games locally with both pointer and keyboard controls where
  supported.
- Run `npm run lint`, `npm run build`, and `git diff --check`.
