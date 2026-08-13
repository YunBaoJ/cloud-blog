import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { SOUND_SPECS, encodeWav, renderSound } from "./generate-game-sounds.mjs";

const REPOSITORY_ROOT = fileURLToPath(new URL("../", import.meta.url));
const SOUNDS_DIRECTORY = join(REPOSITORY_ROOT, "public", "sounds");
const EXPECTED_FILES = [
  "move.wav",
  "capture.wav",
  "xiangqi-check.wav",
  "xiangqi-victory.wav",
  "gomoku-black.wav",
  "gomoku-white.wav",
  "gomoku-victory.wav",
  "puzzle-move.wav",
  "puzzle-win.wav",
  "2048-move.wav",
  "2048-merge.wav",
  "2048-win.wav",
  "2048-over.wav",
  "snake-eat.wav",
  "snake-crash.wav",
];

function parseWav(buffer, file) {
  assert.ok(buffer.length >= 44, `${file} is too short to be a WAV file`);
  assert.equal(buffer.toString("ascii", 0, 4), "RIFF", `${file} has no RIFF header`);
  assert.equal(buffer.toString("ascii", 8, 12), "WAVE", `${file} has no WAVE header`);
  assert.equal(buffer.readUInt32LE(4) + 8, buffer.length, `${file} has an invalid RIFF length`);

  const chunks = new Map();
  let offset = 12;
  while (offset < buffer.length) {
    assert.ok(offset + 8 <= buffer.length, `${file} has a truncated chunk header`);
    const id = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const dataOffset = offset + 8;
    const nextOffset = dataOffset + size + (size % 2);
    assert.ok(nextOffset <= buffer.length, `${file} has an invalid ${id} chunk length`);
    chunks.set(id, { dataOffset, size });
    offset = nextOffset;
  }

  assert.equal(offset, buffer.length, `${file} has an invalid chunk layout`);
  assert.ok(chunks.has("fmt "), `${file} has no fmt chunk`);
  assert.ok(chunks.has("data"), `${file} has no data chunk`);
  return chunks;
}

test("sound catalog is complete and bounded", async () => {
  assert.equal(SOUND_SPECS.length, 15);
  assert.equal(new Set(SOUND_SPECS.map(({ file }) => file)).size, 15);
  assert.deepEqual(SOUND_SPECS.map(({ file }) => file), EXPECTED_FILES);
  assert.deepEqual(
    (await readdir(SOUNDS_DIRECTORY)).filter((file) => file.endsWith(".wav")).sort(),
    [...EXPECTED_FILES].sort(),
  );
  for (const spec of SOUND_SPECS) {
    assert.ok(spec.duration >= 0.05 && spec.duration <= 0.7);
  }
});

test("every generated asset is deterministic valid non-clipped PCM WAV", async () => {
  for (const spec of SOUND_SPECS) {
    const wav = await readFile(join(SOUNDS_DIRECTORY, spec.file));
    assert.deepEqual(wav, encodeWav(renderSound(spec)), `${spec.file} is not deterministic`);

    const chunks = parseWav(wav, spec.file);
    const format = chunks.get("fmt ");
    const data = chunks.get("data");
    assert.ok(format.size >= 16, `${spec.file} has an invalid fmt chunk`);

    const audioFormat = wav.readUInt16LE(format.dataOffset);
    const channels = wav.readUInt16LE(format.dataOffset + 2);
    const sampleRate = wav.readUInt32LE(format.dataOffset + 4);
    const byteRate = wav.readUInt32LE(format.dataOffset + 8);
    const blockAlign = wav.readUInt16LE(format.dataOffset + 12);
    const bitsPerSample = wav.readUInt16LE(format.dataOffset + 14);
    const dataBytes = data.size;

    assert.equal(audioFormat, 1, `${spec.file} is not PCM format 1`);
    assert.equal(channels, 1, `${spec.file} is not mono`);
    assert.equal(bitsPerSample, 16, `${spec.file} is not 16-bit PCM`);
    assert.equal(blockAlign, channels * bitsPerSample / 8, `${spec.file} has an invalid block alignment`);
    assert.equal(byteRate, sampleRate * blockAlign, `${spec.file} has an invalid byte rate`);
    assert.equal(dataBytes % blockAlign, 0, `${spec.file} has a partial PCM frame`);

    const encodedDuration = dataBytes / byteRate;
    assert.ok(encodedDuration >= 0.05 && encodedDuration <= 0.7, `${spec.file} is ${encodedDuration}s`);
    assert.ok(Math.abs(encodedDuration - spec.duration) <= 1 / sampleRate, `${spec.file} duration differs from its spec`);

    let peak = 0;
    for (let offset = data.dataOffset; offset < data.dataOffset + dataBytes; offset += 2) {
      peak = Math.max(peak, Math.abs(wav.readInt16LE(offset)));
    }
    assert.ok(peak > 0, `${spec.file} is silent`);
    assert.ok(peak < 32_767, `${spec.file} reaches full-scale clipping`);
  }
});
