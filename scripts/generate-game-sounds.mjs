import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SAMPLE_RATE = 44_100;

function createNoise(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return state / 0x1_0000_0000 * 2 - 1;
  };
}

function envelope(time, duration, attack = 0.003, decay = 8) {
  if (time < 0 || time >= duration) return 0;
  return Math.min(1, time / attack) * Math.exp(-decay * time / duration);
}

function tone(samples, start, duration, frequency, amplitude, options = {}) {
  const { attack, decay, bend = 0 } = options;
  const first = Math.floor(start * SAMPLE_RATE);
  const last = Math.min(samples.length, Math.ceil((start + duration) * SAMPLE_RATE));
  for (let index = first; index < last; index += 1) {
    const time = index / SAMPLE_RATE - start;
    const pitch = frequency * (1 + bend * time / duration);
    samples[index] += Math.sin(2 * Math.PI * pitch * time) * amplitude * envelope(time, duration, attack, decay);
  }
}

function noise(samples, start, duration, amplitude, seed, options = {}) {
  const { attack = 0.001, decay = 10, smoothing = 0.84 } = options;
  const random = createNoise(seed);
  const first = Math.floor(start * SAMPLE_RATE);
  const last = Math.min(samples.length, Math.ceil((start + duration) * SAMPLE_RATE));
  let filtered = 0;
  for (let index = first; index < last; index += 1) {
    const time = index / SAMPLE_RATE - start;
    filtered = smoothing * filtered + (1 - smoothing) * random();
    samples[index] += filtered * amplitude * envelope(time, duration, attack, decay);
  }
}

function impact(samples, start, seed, low = 180, amplitude = 0.55) {
  noise(samples, start, 0.055, amplitude * 0.55, seed, { decay: 13, smoothing: 0.45 });
  tone(samples, start, 0.09, low, amplitude * 0.5, { attack: 0.001, decay: 8, bend: -0.12 });
  tone(samples, start, 0.045, low * 2.4, amplitude * 0.22, { attack: 0.001, decay: 14 });
}

function slide(samples, start, duration, seed, amplitude = 0.28) {
  noise(samples, start, duration, amplitude, seed, { attack: 0.004, decay: 3.8, smoothing: 0.92 });
  tone(samples, start, duration, 250, amplitude * 0.23, { attack: 0.004, decay: 4, bend: -0.25 });
}

function cadence(samples, notes, amplitude = 0.35) {
  for (const [start, duration, frequency] of notes) {
    tone(samples, start, duration, frequency, amplitude, { attack: 0.006, decay: 3.5 });
    tone(samples, start, duration, frequency * 2.01, amplitude * 0.16, { attack: 0.006, decay: 5 });
  }
}

function render(duration, draw) {
  const samples = new Float32Array(Math.round(duration * SAMPLE_RATE));
  draw(samples);
  let peak = 0;
  for (const sample of samples) peak = Math.max(peak, Math.abs(sample));
  if (peak > 0.92) {
    for (let index = 0; index < samples.length; index += 1) samples[index] *= 0.92 / peak;
  }
  return samples;
}

export const SOUND_SPECS = [
  { file: "move.wav", duration: 0.12, render: (s) => impact(s, 0.004, 11, 220, 0.45) },
  { file: "capture.wav", duration: 0.22, render: (s) => { impact(s, 0.005, 12, 150, 0.55); impact(s, 0.085, 13, 120, 0.52); } },
  { file: "xiangqi-check.wav", duration: 0.28, render: (s) => cadence(s, [[0.01, 0.11, 440], [0.14, 0.12, 554]], 0.38) },
  { file: "xiangqi-victory.wav", duration: 0.62, render: (s) => cadence(s, [[0.01, 0.18, 262], [0.14, 0.18, 330], [0.27, 0.18, 392], [0.4, 0.21, 523]], 0.34) },
  { file: "gomoku-black.wav", duration: 0.13, render: (s) => impact(s, 0.004, 21, 175, 0.48) },
  { file: "gomoku-white.wav", duration: 0.11, render: (s) => impact(s, 0.004, 22, 270, 0.34) },
  { file: "gomoku-victory.wav", duration: 0.58, render: (s) => cadence(s, [[0.02, 0.2, 523], [0.16, 0.2, 659], [0.3, 0.24, 784]], 0.28) },
  { file: "puzzle-move.wav", duration: 0.14, render: (s) => { slide(s, 0, 0.105, 31, 0.27); impact(s, 0.1, 32, 300, 0.16); } },
  { file: "puzzle-win.wav", duration: 0.55, render: (s) => cadence(s, [[0.02, 0.2, 392], [0.18, 0.2, 494], [0.34, 0.21, 659]], 0.32) },
  { file: "2048-move.wav", duration: 0.1, render: (s) => slide(s, 0, 0.09, 41, 0.22) },
  { file: "2048-merge.wav", duration: 0.18, render: (s) => { slide(s, 0, 0.1, 42, 0.2); impact(s, 0.075, 43, 245, 0.31); } },
  { file: "2048-win.wav", duration: 0.65, render: (s) => cadence(s, [[0.02, 0.2, 330], [0.17, 0.2, 415], [0.32, 0.2, 494], [0.47, 0.18, 659]], 0.3) },
  { file: "2048-over.wav", duration: 0.48, render: (s) => cadence(s, [[0.02, 0.2, 330], [0.16, 0.2, 262], [0.3, 0.18, 196]], 0.3) },
  { file: "snake-eat.wav", duration: 0.12, render: (s) => { tone(s, 0.005, 0.1, 620, 0.34, { attack: 0.001, decay: 5, bend: -0.35 }); noise(s, 0.005, 0.045, 0.13, 51, { decay: 12, smoothing: 0.7 }); } },
  { file: "snake-crash.wav", duration: 0.26, render: (s) => impact(s, 0.006, 61, 90, 0.6) },
];

export function renderSound(spec) {
  return render(spec.duration, spec.render);
}

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

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateAll(join(dirname(fileURLToPath(import.meta.url)), "..", "public", "sounds"));
}
