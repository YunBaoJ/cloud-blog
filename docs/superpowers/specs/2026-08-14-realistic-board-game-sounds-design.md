# Realistic Board Game Sounds Design

## Goal

Replace the synthetic Chinese Chess and Gomoku effects with short recordings
that resemble the physical games. Keep the other three Playground games
unchanged.

## Scope

### Chinese Chess

- A legal non-capture move plays one wooden piece-on-board impact.
- A capture plays a slightly heavier, closely spaced physical impact.
- Check and victory remain visible game states but play no sound.

### Gomoku

- A placed black stone plays one recorded stone-on-board impact.
- A placed white stone plays a second natural recording variation.
- Victory remains visible but plays no sound.

### Unchanged Games

- Slide Puzzle, 2048, and Snake keep their current sound assets and event
  mappings.

## Recording Sources and Licensing

- Prefer CC0 recordings that may be modified and redistributed.
- Candidate wooden impact source: `Wooden Hit` by jackyyang09 on Freesound,
  published under CC0.
- Candidate board-placement source: `在棋盘上落子的声音` by 代号091 on
  Ear0, published under CC0.
- Record the source URL, creator, license, original filename, and processing
  performed in the repository.
- Download candidates and present them to the user for audition before they
  replace production assets.

## Audio Processing

- Produce short WAV files with silence removed and a restrained fade at both
  ends to prevent clicks.
- Preserve the physical transient; do not add melodies, oscillators, synthetic
  victory cues, or conspicuous pitch effects.
- Normalize conservatively so repeated moves remain comfortable.
- Keep two natural variants for Gomoku rather than making color differences
  sound exaggerated.

## Runtime Changes

- Keep the existing shared `playGameSound` utility.
- Retain only these chess-related mappings:
  `xiangqi-move`, `xiangqi-capture`, `gomoku-black`, and `gomoku-white`.
- Remove calls and mappings for `xiangqi-check`, `xiangqi-victory`, and
  `gomoku-victory`.
- Remove the three obsolete generated WAV files after confirming they have no
  remaining direct or indirect references.
- Do not change game rules, AI behavior, scoring, visual status messages, or
  unrelated Playground code.

## Verification

- User auditions and approves the candidate recordings before integration.
- Legal moves and captures trigger their corresponding physical recordings.
- Invalid inputs remain silent.
- Check and victory states display normally without playing sound.
- The three unchanged games retain their existing sound behavior.
- Validate the final WAV headers, durations, non-silence, and non-clipping.
- Run the sound tests, focused lint, full lint, `git diff --check`, and the
  available production-build command.
