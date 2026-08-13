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
    assert.equal(wav.readUInt16LE(22), 1, `${spec.file} is not mono`);
    assert.equal(wav.readUInt16LE(34), 16, `${spec.file} is not 16-bit PCM`);

    const sampleRate = wav.readUInt32LE(24);
    const byteRate = wav.readUInt32LE(28);
    const blockAlign = wav.readUInt16LE(32);
    const dataBytes = wav.readUInt32LE(40);
    assert.equal(byteRate, sampleRate * blockAlign, `${spec.file} has an invalid byte rate`);
    assert.equal(wav.length, 44 + dataBytes, `${spec.file} has an invalid data length`);

    const encodedDuration = dataBytes / byteRate;
    assert.ok(encodedDuration >= 0.05 && encodedDuration <= 0.7, `${spec.file} is ${encodedDuration}s`);
    assert.ok(Math.abs(encodedDuration - spec.duration) <= 1 / sampleRate, `${spec.file} duration differs from its spec`);
  }
});
